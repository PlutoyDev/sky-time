import { setCookies } from 'cookies-next';
import { APIGuildChannel, GuildChannelType, Routes } from 'discord-api-types/v9';
import jwt from 'jsonwebtoken';
import { NextApiRequest, NextApiResponse } from 'next';
import {
  BASE_URL,
  DISCORD_CLIENT_ID,
  JWT_ACCESS_TOKEN_SECRET,
  JWT_REFRESH_TOKEN_SECRET,
  NODE_ENV,
  REFRESH_TOKEN_COOKIE_NAME,
} from './constants';
import { Model } from './database';
import { DiscordRest } from './discordRest';
import { AppError, ErrorType } from './error';

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
      guild_id: string;
      webhook_ids: string[];
    };

type RefreshTokenPayload = {
  user_id?: string;
  guild_id?: string;
};

const genRefreshToken = (payload: RefreshTokenPayload) =>
  jwt.sign(payload, JWT_REFRESH_TOKEN_SECRET, { expiresIn: '14d' });

export const genAccessToken = (payload: AccessTokenPayload) =>
  jwt.sign(payload, JWT_ACCESS_TOKEN_SECRET, { expiresIn: '30m' });

export const verifyRefreshToken = (token: string) =>
  jwt.verify(token, JWT_REFRESH_TOKEN_SECRET) as RefreshTokenPayload & { iat: number };

export const verifyAccessToken = (token: string) =>
  jwt.verify(token, JWT_ACCESS_TOKEN_SECRET) as AccessTokenPayload & { iat: number };

export type AuthParams = {
  guild_id?: string;

  user_id?: string;
  username?: string;
  discriminator?: string;
  avatar?: string;

  webhook_id?: string;
  channel_id?: string;
  webhook_token?: string;

  res: NextApiResponse;
  req: NextApiRequest;
};

export function generateAuthUrl(withBot: boolean) {
  const scopeArray = ['identify', 'guilds', 'guilds.members.read'];
  if (withBot) scopeArray.push('bot');

  const scope = scopeArray.join(' ');

  const param = {
    client_id: DISCORD_CLIENT_ID,
    redirect_uri: BASE_URL + '/api/auth/callback',
    permissions: '536871936',
    response_type: 'code',
    scope,
  };

  return `https://discordapp.com/api/oauth2/authorize?${new URLSearchParams(param)}`;
}

export default async function authenticate(params: AuthParams) {
  const { guild_id, user_id, webhook_id, res, req } = params;

  let user = user_id && user_id !== '' && (await Model.User.findById(user_id));
  let guild = guild_id && guild_id !== '' && (await Model.Guild.findById(guild_id));
  let webhook = webhook_id && webhook_id !== '' && (await Model.Webhook.findById(webhook_id));

  if (user_id && !user) {
    console.log('user not found');
    const guild_ids = guild_id ? [guild_id] : undefined;
    //Add User with Guild ID
    //Check params for user
    const { username, discriminator, avatar } = params;
    if (!username || !discriminator || !avatar) {
      throw new AppError(ErrorType.AUTH_MISSING_PARAMS, 'Missing params for creating user');
    }
    user = await Model.User.create({
      _id: user_id,
      guild_ids,
      username,
      discriminator,
      avatar,
    });
  }

  if (webhook_id && !webhook) {
    console.log('webhook not found');
    if (!guild_id) {
      throw new AppError(ErrorType.AUTH_MISSING_GUILD, 'guild_id is required');
    }
    const { webhook_token } = params;
    if (!webhook_token) {
      throw new AppError(ErrorType.AUTH_MISSING_PARAMS, 'webhook_token is required');
    }

    webhook = await Model.Webhook.create({
      _id: webhook_id,
      guild_id,
      webhook_token,
    });
  }

  if (guild_id && !guild) {
    console.log('guild not found');
    const user_ids = user_id ? [user_id] : undefined;
    const webhook_ids = webhook_id ? [webhook_id] : undefined;

    guild = await Model.Guild.create({
      _id: guild_id,
      user_ids,
      webhook_ids,
    });
  }

  const refresh_token = genRefreshToken({ guild_id, user_id });
  setCookies(REFRESH_TOKEN_COOKIE_NAME, refresh_token, {
    res,
    req,
    httpOnly: true,
    sameSite: 'strict',
    maxAge: 1000 * 60 * 60 * 24 * 14,
    secure: NODE_ENV === 'production',
  });

  return;
}

export async function getDiscordGuildChannels(guild_id: string) {
  try {
    const channels = (await DiscordRest.get(Routes.guildChannels(guild_id))) as APIGuildChannel<GuildChannelType>[];
    return channels.map(({ id }) => id);
  } catch (e) {
    return [];
  }
}

export async function refresh(refresh_token: string) {
  const payload = verifyRefreshToken(refresh_token);
  const { guild_id, user_id } = payload;

  if (user_id) {
    const user = await Model.User.findById(user_id);
    if (!user) {
      throw new AppError(ErrorType.AUTH_USER_NOT_FOUND, 'User not found');
    }
    let { username, discriminator, avatar, guild_ids } = user;

    const channel_ids = (await Promise.all(guild_ids.map(getDiscordGuildChannels))).flat();
    const webhook_ids = (
      await Model.Guild.find().where('_id').in(guild_ids).select('webhook_ids').lean().exec()
    ).flatMap(({ webhook_ids }) => webhook_ids);

    console.log({ channel_ids, webhook_ids });

    return {
      guild_ids,
      username,
      discriminator,
      avatar,
      access_token: genAccessToken({
        type: 'Oauth',
        user_id,
        guild_ids,
        channel_ids,
        webhook_ids,
      }),
    };
  } else if (guild_id) {
    const guild = await Model.Guild.findById(guild_id);
    if (!guild) {
      throw new AppError(ErrorType.AUTH_GUILD_NOT_FOUND, 'Guild not found');
    }
    const { webhook_ids } = guild;
    return {
      guild_ids: [guild_id],
      access_token: genAccessToken({
        type: 'Webhook',
        guild_id,
        webhook_ids,
      }),
    };
  } else {
    throw new AppError(ErrorType.AUTH_MISSING_PARAMS, 'Missing params');
  }
}
