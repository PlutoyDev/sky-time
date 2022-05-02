import { DiscordAPIError, HTTPError, RequestMethod } from '@discordjs/rest';
import _ from 'lodash';
import { NextApiRequest, NextApiResponse } from 'next';
import { verifyAccessToken } from '~/libs/appAuth';
import { DiscordRest, setTokenAsBot } from '~/libs/discordRest';
import { apiErrorHandler, AppError, assert, ErrorType } from '~/libs/error';

type RequestOptionType = Parameters<typeof DiscordRest.request>[0];

function discordApiErrorHandler(res: NextApiResponse, error: any) {
  if (error instanceof HTTPError || error instanceof DiscordAPIError) {
    res.status(error.status).json({
      error,
    });
  } else {
    console.log(error);
    throw error;
  }
}

export default async (req: NextApiRequest, res: NextApiResponse) => {
  const { method, headers, body, query } = req;
  const authParts = headers.authorization?.split(' ');
  try {
    assert(method, ErrorType.BAD_REQUEST);

    if (!authParts || authParts.length < 1) {
      throw new AppError(ErrorType.AUTH_MISSING_ACCESS_TOKEN);
    }

    const [, access_token, discord_access_token] = authParts;

    if (!access_token) {
      throw new AppError(ErrorType.AUTH_MISSING_ACCESS_TOKEN);
    }

    const access = verifyAccessToken(access_token);

    const discordApiQuery = _.omit(query, ['params']) as Record<string, string>;
    const reason = headers['x-audit-log-reason'] as string | undefined;

    const urlParams = query.params as [string, ...string[]];
    const discordRoute = ('/' + urlParams.join('/')) as `/${string}`;

    const baseRequestOption: RequestOptionType = {
      method: method.toLowerCase() as RequestMethod,
      query: new URLSearchParams(discordApiQuery),
      fullRoute: discordRoute,
      // passThroughBody: method === 'GET' ? undefined : true,
      body: method === 'GET' ? undefined : body,
      reason,
    };

    console.log({ baseRequestOption });

    //Webhook Token
    const isWebhook = urlParams[0] === 'webhooks';
    if (isWebhook) {
      try {
        const data = await DiscordRest.request({
          ...baseRequestOption,
          auth: false,
        });
        res.status(200).json(data);
      } catch (error) {
        discordApiErrorHandler(res, error);
      }

      return;
    }

    //Bearer Token
    if (access.type !== 'Oauth' || !discord_access_token) {
      throw new AppError(ErrorType.FORBIDDEN, 'Only Oauth access tokens are allowed');
    }

    const hasAtMe = urlParams.indexOf('@me') !== -1;
    if (hasAtMe) {
      try {
        DiscordRest.setToken(discord_access_token);

        const data = await DiscordRest.request({
          ...baseRequestOption,
          authPrefix: 'Bearer',
        });
        res.status(200).json(data);
        setTokenAsBot();
      } catch (error) {
        setTokenAsBot();
        discordApiErrorHandler(res, error);
      }
      return;
    }

    //Bot Token
    const allowedTopLevelRoutes = ['channels', 'guilds', 'users', 'application', 'invites'];
    const isCreateGuild = method === 'POST' && urlParams[0] === 'guilds' && urlParams.length === 1;
    const isGlobalAppCommand = urlParams[0] === 'applications' && urlParams[2] === 'commands'; // applications/${applicationId}/commands/:commandId
    const isDisallowed = isGlobalAppCommand || isCreateGuild || allowedTopLevelRoutes.indexOf(urlParams[0]) === -1;

    if (isDisallowed) {
      throw new AppError(ErrorType.FORBIDDEN, 'Routes not allowed');
    }

    const guildParamIdx = urlParams.indexOf('guilds');
    const guild_id = guildParamIdx !== -1 && urlParams[guildParamIdx + 1];
    const guildAllowed = !guild_id || access.guild_ids.includes(guild_id);

    const channelParamIdx = urlParams.indexOf('channels');
    const channel_id = channelParamIdx !== -1 && urlParams[channelParamIdx + 1];
    const channelAllowed = !channel_id || access.channel_ids.includes(channel_id);

    if (!guildAllowed || !channelAllowed) {
      throw new AppError(ErrorType.FORBIDDEN, 'You are not allowed to access this route');
    }

    try {
      const data = await DiscordRest.request(baseRequestOption);
      res.status(200).json(data);
    } catch (error) {
      discordApiErrorHandler(res, error);
    }
    return;
  } catch (error) {
    apiErrorHandler(req, res, error);
  }
};
