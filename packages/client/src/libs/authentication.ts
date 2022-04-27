import jwt from 'jsonwebtoken';
import { NextApiResponse } from 'next';
import { setCookies } from 'cookies-next';
import { connectDb, Model } from '@sky-time/shared';
import { AppError, ErrorType } from './error';
import {
  BASE_URL,
  DISCORD_CLIENT_ID,
  DISCORD_CLIENT_SECRET,
  JWT_ACCESS_TOKEN_SECRET,
  JWT_REFRESH_TOKEN_SECRET,
  NODE_ENV,
} from './constants';

type AccessTokenPayload =
  | {
      type: 'Oauth';
      access_token: string;
      user_id: string;
    }
  | {
      type: 'Webhook';
      guild_id: string;
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
  refresh_token?: string;
  access_token?: string;
  expires_at?: Date;

  webhook_id?: string;
  channel_id?: string;
  webhook_token?: string;

  res: NextApiResponse;
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
  await connectDb();
  const { guild_id, user_id, webhook_id, res } = params;

  let user = user_id !== '' && (await Model.User.findById(user_id));
  let guild = guild_id !== '' && (await Model.Guild.findById(guild_id));
  let webhook = webhook_id !== '' && (await Model.Webhook.findById(webhook_id));

  if (user_id && !user) {
    const guild_ids = guild_id ? [guild_id] : undefined;
    //Add User with Guild ID
    //Check params for user
    const { username, discriminator, avatar, refresh_token, access_token, expires_at } = params;
    if (!username || !discriminator || !avatar || !refresh_token || !access_token || !expires_at) {
      throw new AppError(ErrorType.AUTH_MISSING_PARAMS, 'Missing params for creating user');
    }
    user = await Model.User.create({
      _id: user_id,
      guild_ids,
      username,
      discriminator,
      avatar,
      refresh_token,
      access_token,
      expires_at,
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

    webhook = await Model.Webhook.create({
      _id: webhook_id,
      guild_id,
      webhook_token,
    });
  }

  if (guild_id && !guild) {
    const user_ids = user_id ? [user_id] : undefined;
    const webhook_ids = webhook_id ? [webhook_id] : undefined;

    guild = await Model.Guild.create({
      _id: guild_id,
      user_ids,
      webhook_ids,
    });
  }

  const refresh_token = genRefreshToken({ guild_id, user_id });
  setCookies('refresh_token', refresh_token, {
    res,
    httpOnly: true,
    sameSite: 'strict',
    maxAge: 1000 * 60 * 60 * 24 * 14,
    secure: process.env.NODE_ENV === 'production',
  });

  return;
}
