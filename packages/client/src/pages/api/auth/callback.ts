import { NextApiRequest, NextApiResponse } from 'next';
import discordAxios from '~/libs/axios/discordAxios';
import {
  APIUser,
  RESTPostOAuth2AccessTokenResult as AccessTokenResult,
  RESTPostOAuth2AccessTokenWithBotAndGuildsScopeResult as BotResult,
  Routes as DiscordAPIRoutes,
} from 'discord-api-types/v9';
import { apiErrorHandler } from '~/libs/error';
import { authenticate } from '~/libs/appAuth';
import { discordAuthorize } from '~/libs/discordAuth';
import { BASE_URL, DISCORD_CLIENT_ID, DISCORD_CLIENT_SECRET } from '~/libs/constants';

export default async function OauthCallback(req: NextApiRequest, res: NextApiResponse) {
  try {
    await authenticate({
      req,
      res,
      ...discordAuthorize(req.query.code),
    });
    return res.redirect('/configure');
  } catch (e) {
    apiErrorHandler(req, res, e);
  }
}
