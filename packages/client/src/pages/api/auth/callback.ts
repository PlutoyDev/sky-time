import { NextApiRequest, NextApiResponse } from 'next';
import discordAxios from '~/libs/axios/discordAxios';
import {
  APIUser,
  RESTPostOAuth2AccessTokenResult as AccessTokenResult,
  RESTPostOAuth2AccessTokenWithBotAndGuildsScopeResult as BotResult,
  Routes as DiscordAPIRoutes,
} from 'discord-api-types/v9';
import authenticate, { AuthParams } from '~/libs/authentication';
import { BASE_URL, DISCORD_CLIENT_ID, DISCORD_CLIENT_SECRET } from '~/libs/constants';

export default async function OauthCallback(req: NextApiRequest, res: NextApiResponse) {
  try {
    const { code } = req.query;
    if (!code || typeof code !== 'string') {
      return res.redirect('/?error=invalid_code');
    }

    const param = {
      client_id: DISCORD_CLIENT_ID,
      client_secret: DISCORD_CLIENT_SECRET,
      redirect_uri: BASE_URL + '/api/auth/callback',
      grant_type: 'authorization_code',
      code,
    };

    const { data: tokenData } = await discordAxios.post<AccessTokenResult & Partial<BotResult>>(
      '/oauth2/token',
      new URLSearchParams(param).toString(),
    );

    const {
      data: { id: user_id, username, discriminator, avatar },
    } = await discordAxios.get<APIUser>(DiscordAPIRoutes.user(), {
      headers: { Authorization: `Bearer ${tokenData.access_token}` },
    });

    const authParams: AuthParams = {
      res,
      req,
      user_id,
      username,
      discriminator,
      avatar: avatar ?? undefined,
      guild_id: tokenData.guild?.id,
    };

    await authenticate(authParams);
    return res.redirect('/configure');
  } catch (e) {
    console.error(e);
    return res.redirect('/?error=unknown_error');
  }
}
