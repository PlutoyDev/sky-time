import { NextApiRequest, NextApiResponse } from 'next';
import discordAxios from '~/libs/axios/discordAxios';
import {
  APIUser,
  RESTPostOAuth2AccessTokenResult as AccessTokenResult,
  RESTPostOAuth2AccessTokenWithBotAndGuildsScopeResult as BotResult,
  RESTPostOAuth2AccessTokenWithBotAndWebhookIncomingScopeResult as WebhookResult,
  Routes as DiscordAPIRoutes,
} from 'discord-api-types/v9';
import authenticate, { AuthParams } from '~/libs/authentication';
import getBaseUrl from '~/utils/getBaseUrl';

export default async function OauthCallback(req: NextApiRequest, res: NextApiResponse) {
  if (!process.env.DISCORD_CLIENT_ID || !process.env.DISCORD_CLIENT_SECRET) {
    throw new Error('DISCORD_CLIENT_ID or DISCORD_CLIENT_SECRET is not defined');
  }
  try {
    const { code } = req.query;
    if (!code || typeof code !== 'string') {
      return res.redirect('/?error=invalid_code');
    }

    const param = {
      client_id: process.env.DISCORD_CLIENT_ID,
      client_secret: process.env.DISCORD_CLIENT_SECRET,
      redirect_uri: getBaseUrl() + '/api/auth/callback',
      grant_type: 'authorization_code',
      code,
    };

    const { data: tokenData } = await discordAxios.post<AccessTokenResult>(
      '/oauth2/token',
      new URLSearchParams(param).toString(),
    );

    const scopeArray = tokenData.scope.split(' ');

    const {
      data: { id: user_id, username, discriminator, avatar },
    } = await discordAxios.get<APIUser>(DiscordAPIRoutes.user());

    const authParams: AuthParams = {
      ...tokenData,
      res,
      user_id,
      username,
      discriminator,
      avatar: avatar ?? undefined,
      expires_at: new Date(Date.now() + tokenData.expires_in * 1000),
    };

    if (scopeArray.includes('bot')) {
      const {
        guild: { id: guild_id },
      } = tokenData as BotResult;

      authParams['guild_id'] = guild_id;
    }

    await authenticate(authParams);
    return res.redirect('/');
  } catch (e) {
    return res.redirect('/?error=unknown_error');
  }
}
