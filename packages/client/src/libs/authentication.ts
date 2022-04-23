import jwt from 'jsonwebtoken';
import { NextApiRequest, NextApiResponse } from 'next';
import { setCookies } from 'cookies-next';
import getBaseUrl from '~/utils/getBaseUrl';
import { connectDb, Guild, User, Webhook } from '@sky-time/shared';

const RT_SECRET = process.env.RT_SECRET;
const AT_SECRET = process.env.AT_SECRET;

if (!RT_SECRET || !AT_SECRET) {
  throw new Error('RT_SECRET or AT_SECRET is not defined');
}

type AccessTokenPayload = {
  access_token?: string;
  user_id?: string;
  guild_id?: string;
};

type RefreshTokenPayload = Omit<AccessTokenPayload, 'access_token'>;

const genRefreshToken = (payload: RefreshTokenPayload) => jwt.sign(payload, RT_SECRET, { expiresIn: '14d' });

export const genAccessToken = (payload: AccessTokenPayload) => jwt.sign(payload, AT_SECRET, { expiresIn: '30m' });

export const verifyRefreshToken = (token: string) =>
  jwt.verify(token, RT_SECRET) as RefreshTokenPayload & { iat: number };

export const verifyAccessToken = (token: string) =>
  jwt.verify(token, AT_SECRET) as AccessTokenPayload & { iat: number };

//Plutoy(Me, the Developer) and Clement(the Founder of Sky Info-graphics Discord Server) will have permanent access to admin console.
//Will not change :P
const HARDCODED_ADMIN_ID = ['702740689846272002', '693802004018888714'].concat(
  ...(process.env.HARDCODED_ADMIN_ID?.split(',') ?? []),
);

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
  if (!process.env.DISCORD_CLIENT_ID) {
    throw new Error('DISCORD_CLIENT_ID is not defined');
  }

  const scopeArray = ['identify', 'guilds.members.read'];
  if (withBot) scopeArray.push('bot');

  const scope = scopeArray.join(' ');

  const param = {
    client_id: process.env.DISCORD_CLIENT_ID,
    redirect_uri: getBaseUrl() + '/api/auth/callback',
    permissions: '536871936',
    response_type: 'code',
    scope,
  };

  return `https://discordapp.com/api/oauth2/authorize?${new URLSearchParams(param)}`;
}

export default async function authenticate(params: AuthParams) {
  const { guild_id, user_id, webhook_id, res } = params;

  let user = user_id && (await User.findById(user_id));
  let guild = guild_id && (await Guild.findById(guild_id));
  let webhook = webhook_id && (await Webhook.findById(webhook_id));

  if (user_id && !user) {
    const { username, discriminator, avatar, refresh_token, access_token, expires_at } = params;
    if (!username || !discriminator || !avatar || !refresh_token || !access_token || !expires_at)
      throw new Error('Missing parameters for creating user');

    const admin = HARDCODED_ADMIN_ID.includes(user_id);

    const userData = {
      _id: user_id,
      guild_ids: [guild_id],
      username,
      discriminator,
      avatar,
      refresh_token,
      access_token,
      expires_at,
      admin,
    };

    user = await User.create(userData);
  }

  if (guild_id && !guild) {
    guild = await Guild.create({ _id: guild_id });
  }

  if (webhook_id && !webhook) {
    const { channel_id, webhook_token } = params;
    if (!guild_id || !channel_id || !webhook_token) throw new Error('Missing parameters for creating webhook');

    webhook = await Webhook.create({ _id: webhook_id, channel_id, webhook_token });
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
