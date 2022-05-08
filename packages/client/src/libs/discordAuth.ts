import {
  APIUser,
  OAuth2Routes,
  RESTPostOAuth2AccessTokenResult as AccessTokenResult,
  RESTPostOAuth2AccessTokenWithBotAndGuildsScopeResult as BotResult,
  Routes,
} from 'discord-api-types/v9';
import { BASE_URL, DISCORD_CLIENT_ID, DISCORD_CLIENT_SECRET } from './constants';
import { DiscordRest, setTokenAsBot } from './discordRest';
import { AppError, ErrorType } from './error';

export function genDiscordAuthUrl(botOnly: boolean, guild_id?: string) {
  const scopeArray = botOnly ? ['bot', 'applications.commands'] : ['identify', 'guilds', 'guilds.members.read'];

  const scope = scopeArray.join(' ');

  const param = {
    client_id: DISCORD_CLIENT_ID,
    redirect_uri: BASE_URL + '/api/auth/callback',
    permissions: '536871936',
    response_type: 'code',
    scope,
    guild_id: guild_id as string,
  };

  return `${OAuth2Routes.authorizationURL}?${new URLSearchParams(param)}`;
}

export async function discordAuthorize(code: any) {
  if (!code || typeof code !== 'string') {
    throw new AppError(ErrorType.AUTH_INVALID_CODE);
  }

  const param = {
    client_id: DISCORD_CLIENT_ID,
    client_secret: DISCORD_CLIENT_SECRET,
    redirect_uri: BASE_URL + '/api/auth/callback',
    grant_type: 'authorization_code',
    code,
  };

  const tokenData = (await DiscordRest.post(Routes.oauth2TokenExchange(), {
    auth: false,
    passThroughBody: true,
    body: new URLSearchParams(param).toString(),
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
  })) as AccessTokenResult & Partial<BotResult>;

  DiscordRest.setToken(tokenData.access_token);

  const {
    id: user_id,
    username,
    discriminator,
    avatar,
  } = (await DiscordRest.get(Routes.user(), {
    authPrefix: 'Bearer',
  })) as APIUser;

  setTokenAsBot();

  return {
    user_id,
    username,
    discriminator,
    avatar: avatar ?? undefined,
    guild_id: tokenData.guild?.id,
    guild_name: tokenData.guild?.name,
    guild_icon: tokenData.guild?.icon ?? undefined,
    discord_access_token: tokenData.access_token,
  };
}
