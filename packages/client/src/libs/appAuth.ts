import { setCookies } from 'cookies-next';
import { APIGuildChannel, GuildChannelType, Routes } from 'discord-api-types/v9';
import jwt from 'jsonwebtoken';
import { NextApiRequest, NextApiResponse } from 'next';
import {
  DISCORD_ACCESS_TOKEN_COOKIE_NAME,
  JWT_ACCESS_TOKEN_SECRET,
  JWT_REFRESH_TOKEN_SECRET,
  NODE_ENV,
  REFRESH_TOKEN_COOKIE_NAME,
} from './constants';
import db from './database';
import { DiscordRest } from './discordRest';
import { AppError, ErrorType } from './error';

//JWT Refresh Token
type RefreshTokenPayload = {
  user_id?: string;
  guild_id?: string;
};

const genRefreshToken = (payload: RefreshTokenPayload) =>
  jwt.sign(payload, JWT_REFRESH_TOKEN_SECRET, { expiresIn: '14d' });

const verifyRefreshToken = (token: string) =>
  jwt.verify(token, JWT_REFRESH_TOKEN_SECRET) as RefreshTokenPayload & { iat: number };

//JWT Access Token
type AccessTokenPayload =
  | {
      type: 'Oauth';
      user_id: string;
      guild_ids: string[];
      webhook_ids: string[];
      channel_ids: string[];
    }
  | {
      type: 'Webhook';
      guild_ids: string[];
      webhook_ids: string[];
    };

const genAccessToken = (payload: AccessTokenPayload) =>
  jwt.sign(payload, JWT_ACCESS_TOKEN_SECRET, { expiresIn: '30m' });

export const verifyAccessToken = (token: string) =>
  jwt.verify(token, JWT_ACCESS_TOKEN_SECRET) as AccessTokenPayload & { iat: number };

//Authentication

type CookieOption = NonNullable<Parameters<typeof setCookies>[2]>;

export type AuthParams = {
  guild_id?: string;

  user_id?: string;
  username?: string;
  discriminator?: string;
  avatar?: string;
  discord_access_token?: string;

  webhook_id?: string;
  channel_id?: string;
  webhook_token?: string;

  res: NextApiResponse;
  req: NextApiRequest;
};

export async function authenticate(params: AuthParams) {
  const { guild_id, user_id, webhook_id, discord_access_token, res, req } = params;

  let user = user_id && user_id !== '' && (await db.getUser(user_id));
  let guild = guild_id && guild_id !== '' && (await db.getGuild(guild_id));
  let webhook = webhook_id && webhook_id !== '' && (await db.getWebhook(webhook_id));

  if (user_id && !user) {
    const guild_ids = guild_id ? [guild_id] : [];
    const { username, discriminator, avatar } = params;
    if (!username || !discriminator) {
      throw new AppError(ErrorType.AUTH_MISSING_PARAMS, 'Missing params for creating user');
    }
    user = await db.createUser({
      _id: user_id,
      guild_ids,
      username,
      discriminator,
      avatar,
    });
  }

  if (webhook_id && !webhook) {
    if (!guild_id) {
      throw new AppError(ErrorType.AUTH_MISSING_GUILD, 'guild_id is required');
    }
    const { webhook_token } = params;
    if (!webhook_token) {
      throw new AppError(ErrorType.AUTH_MISSING_PARAMS, 'webhook_token is required');
    }

    webhook = await db.createWebhook({
      _id: webhook_id,
      guild_id,
      token: webhook_token,
      message_ids: [],
    });
  }

  if (guild_id && !guild) {
    const user_ids = user_id ? [user_id] : undefined;
    const webhook_ids = webhook_id ? [webhook_id] : undefined;

    guild = await db.createGuild({
      _id: guild_id,
      user_ids,
      webhook_ids,
    });
  }

  const cookieOption: CookieOption = {
    res,
    req,
    httpOnly: true,
    sameSite: 'strict',
    maxAge: 1000 * 60 * 60 * 24 * 14,
    secure: NODE_ENV === 'production',
  };

  const refresh_token = genRefreshToken({ guild_id, user_id });
  setCookies(REFRESH_TOKEN_COOKIE_NAME, refresh_token, cookieOption);

  if (discord_access_token) {
    setCookies(DISCORD_ACCESS_TOKEN_COOKIE_NAME, discord_access_token, cookieOption);
  }

  return;
}

async function getDiscordGuildChannels(guild_id: string) {
  try {
    const channels = (await DiscordRest.get(Routes.guildChannels(guild_id))) as APIGuildChannel<GuildChannelType>[];
    return channels.map(({ id }) => id);
  } catch (e) {
    return [];
  }
}

export async function refresh(cookies: Record<string, string>) {
  const refresh_token = cookies[REFRESH_TOKEN_COOKIE_NAME];
  const discord_access_token = cookies[DISCORD_ACCESS_TOKEN_COOKIE_NAME];

  if (!refresh_token) {
    throw new AppError(ErrorType.AUTH_MISSING_REFRESH_TOKEN, 'Missing refresh token');
  }

  const payload = verifyRefreshToken(refresh_token);
  const { guild_id, user_id } = payload;

  if (user_id) {
    const user = await db.getUser(user_id);
    if (!user) {
      throw new AppError(ErrorType.AUTH_USER_NOT_FOUND, 'User not found');
    }
    let { username, discriminator, avatar, guild_ids } = user;

    const channel_ids = (await Promise.all(guild_ids.map(getDiscordGuildChannels))).flat();
    const webhook_ids = (await db.getGuilds(guild_ids)).flatMap(({ webhook_ids }) => webhook_ids);

    console.log({ channel_ids, webhook_ids });

    return {
      user_id,
      avatar,
      username,
      discriminator,
      discord_access_token,
      guild_ids,
      access_token: genAccessToken({
        type: 'Oauth',
        user_id,
        guild_ids,
        channel_ids,
        webhook_ids,
      }),
    };
  } else if (guild_id) {
    const guild = await db.getGuild(guild_id);
    if (!guild) {
      throw new AppError(ErrorType.AUTH_GUILD_NOT_FOUND, 'Guild not found');
    }
    const { webhook_ids } = guild;
    const guild_ids = [guild_id];
    return {
      guild_ids: [guild_id],
      access_token: genAccessToken({
        type: 'Webhook',
        guild_ids,
        webhook_ids,
      }),
    };
  } else {
    throw new AppError(ErrorType.AUTH_MISSING_PARAMS, 'Missing params');
  }
}
