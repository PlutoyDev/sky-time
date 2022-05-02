//Single File for all **server** constants

export const NODE_ENV = process.env.NODE_ENV;
export const BASE_URL =
  typeof window !== 'undefined'
    ? ''
    : process.env.VERCEL_URL
    ? `https://${process.env.VERCEL_URL}`
    : `http://localhost:${process.env.PORT ?? 3000}`;

export const HARDCODED_ADMIN_IDS = ['702740689846272002', '693802004018888714'].concat(
  process.env.HARDCODED_ADMIN_IDS?.split(',') ?? [],
);
export const REFRESH_TOKEN_COOKIE_NAME = process.env.REFRESH_TOKEN_COOKIE_NAME ?? 'refresh_token';
export const DISCORD_ACCESS_TOKEN_COOKIE_NAME = process.env.DISCORD_ACCESS_TOKEN_COOKIE_NAME ?? 'discord_access_token';
//JWT
export const JWT_REFRESH_TOKEN_SECRET = process.env.JWT_REFRESH_TOKEN_SECRET as string;
export const JWT_ACCESS_TOKEN_SECRET = process.env.JWT_ACCESS_TOKEN_SECRET as string;
//discord
export const DISCORD_APPLICATION_ID = (process.env.DISCORD_APPLICATION_ID ?? '966981144237207562') as string;
export const DISCORD_CLIENT_ID = (process.env.DISCORD_CLIENT_ID ?? '966981144237207562') as string;
export const DISCORD_CLIENT_SECRET = process.env.DISCORD_CLIENT_SECRET as string;
export const DISCORD_BOT_TOKEN = process.env.DISCORD_BOT_TOKEN as string;

//Console Log NODE_ENV
console.log(`NODE_ENV: ${NODE_ENV}`);

//Check envs
const envObject = {
  JWT_REFRESH_TOKEN_SECRET,
  JWT_ACCESS_TOKEN_SECRET,
  DISCORD_CLIENT_SECRET,
  DISCORD_BOT_TOKEN,
};
Object.entries(envObject).forEach(([key, value]) => {
  if (!value) {
    throw new Error(`${key} is not defined`);
  }
});
