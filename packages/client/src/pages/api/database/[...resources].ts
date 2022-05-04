import { JsonWebTokenError, TokenExpiredError } from 'jsonwebtoken';
import { NextApiRequest, NextApiResponse } from 'next';
import { verifyAccessToken } from '~/libs/appAuth';
import { apiErrorHandler, AppError, ErrorType, assertMethod } from '~/libs/error';
import db from '~/libs/database';
import { NODE_ENV } from '~/libs/constants';

export default async (req: NextApiRequest, res: NextApiResponse) => {
  const { method, headers, body, query } = req;
  const access_token = headers.authorization?.split(' ')?.[1];
  const resources = query.resources as [string, ...string[]];

  try {
    let [tlr, tlr_id, slr] = resources;

    if (!access_token) {
      throw new AppError(ErrorType.AUTH_MISSING_ACCESS_TOKEN);
    }

    const access = verifyAccessToken(access_token);
    if (tlr === 'guilds') {
      if (tlr_id && !access.guild_ids.includes(tlr_id)) {
        throw new AppError(ErrorType.FORBIDDEN, `You are not allowed to access this guild (${tlr_id})`);
      }
      if (slr) {
        if (slr === 'users') {
          assertMethod(method === 'GET');
          const users = await db.getGuildUsers(tlr_id);
          res.status(200).json(users);
          return;
        } else if (slr === 'webhooks') {
          assertMethod(method === 'GET');
          const webhooks = await db.getGuildWebhooks(tlr_id);
          res.status(200).json(webhooks);
          return;
        } else if (slr === 'timeConfigs') {
          assertMethod(method === 'GET');
          const timeConfigs = await db.getGuildTimeConfigs(tlr_id);
          res.status(200).json(timeConfigs);
          return;
        } else if (slr === 'reminderConfigs') {
          //TODO
          throw new AppError(ErrorType.NOT_IMPLEMENTED, 'reminder configs are not implemented yet');
        } else {
          throw new AppError(ErrorType.RESOURCE_NOT_FOUND, `Resource ${slr} not found`);
        }
      } else if (tlr_id) {
        if (method === 'GET') {
          const guild = await db.getGuild(tlr_id);
          res.status(200).json(guild);
          return;
        } else if (method === 'PATCH') {
          if (body.id !== tlr_id) {
            throw new AppError(ErrorType.MISSING_PARAMS, 'id does not match');
          }
          const guild = await db.updateGuild(body);
          res.status(200).json(guild);
          return;
        } else if (method === 'DELETE') {
          const guild = await db.deleteGuild(tlr_id);
          res.status(200).json(guild);
          return;
        } else {
          throw new AppError(ErrorType.METHOD_NOT_ALLOWED);
        }
      } else {
        assertMethod(method === 'GET');
        const guilds = await db.getGuilds(access.guild_ids);
        res.status(200).json(guilds);
        return;
      }
    } else if (tlr === 'users') {
      if (access.type !== 'Oauth') {
        throw new AppError(ErrorType.FORBIDDEN, 'You are not allowed to access this resource');
      }
      if (!tlr_id && tlr_id === access.user_id) {
        throw new AppError(ErrorType.FORBIDDEN, 'You are not allowed to access this resource');
      }
      if (slr) {
        if (slr === 'guilds') {
          assertMethod(method === 'GET');
          const guilds = await db.getUserGuilds(tlr_id);
          res.status(200).json(guilds);
          return;
        } else {
          throw new AppError(ErrorType.RESOURCE_NOT_FOUND, `Resource ${slr} not found`);
        }
      } else {
        assertMethod(method === 'GET');
        const user = await db.getUser(tlr_id);
        res.status(200).json(user);
        return;
      }
    } else if (tlr === 'webhooks') {
      if (slr) {
        throw new AppError(ErrorType.RESOURCE_NOT_FOUND, `No sub-level (${slr}) for ${tlr}`);
      } else if (tlr_id) {
        if (method === 'GET') {
          const webhook = await db.getWebhook(tlr_id);
          res.status(200).json(webhook);
          return;
        } else if (method === 'PATCH') {
          if (body.id !== tlr_id) {
            throw new AppError(ErrorType.MISSING_PARAMS, 'id does not match');
          }
          const webhook = await db.updateWebhook(body);
          res.status(200).json(webhook);
          return;
        } else if (method === 'DELETE') {
          const webhook = await db.deleteWebhook(tlr_id);
          res.status(200).json(webhook);
          return;
        } else {
          throw new AppError(ErrorType.METHOD_NOT_ALLOWED);
        }
      } else {
        assertMethod(method === 'GET');
        const webhooks = await db.getWebhooks(access.webhook_ids);
        res.status(200).json(webhooks);
        return;
      }
    } else if (tlr === 'timeConfigs') {
      if (slr) {
        throw new AppError(ErrorType.RESOURCE_NOT_FOUND, `No sub-level (${slr}) for ${tlr}`);
      } else if (tlr_id) {
        if (method === 'GET') {
          const timeConfig = await db.getTimeConfig(tlr_id);
          res.status(200).json(timeConfig);
          return;
        } else if (method === 'PATCH') {
          if (body.id !== tlr_id) {
            throw new AppError(ErrorType.MISSING_PARAMS, 'id does not match');
          }
          const timeConfig = await db.updateTimeConfig(body);
          res.status(200).json(timeConfig);
          return;
        } else if (method === 'DELETE') {
          const timeConfig = await db.deleteTimeConfig(tlr_id);
          res.status(200).json(timeConfig);
          return;
        } else {
          throw new AppError(ErrorType.METHOD_NOT_ALLOWED);
        }
      } else {
        throw new AppError(ErrorType.BAD_REQUEST, 'No id provided');
      }
    } else if (tlr === 'reminderConfigs') {
      //TODO
      throw new AppError(ErrorType.NOT_IMPLEMENTED, 'reminder configs are not implemented yet');
    } else {
      throw new AppError(ErrorType.RESOURCE_NOT_FOUND, `Resource ${tlr} not found`);
    }
  } catch (error) {
    apiErrorHandler(req, res, error);
  }
};

export const BaseRoute = '/api/database' as const;

export type DatabaseRoutes = {
  '/api/database/guilds': db.IGuild[];
  '/api/database/users': db.IUser[];
  '/api/database/webhooks': db.IWebhook[];
  '/api/database/timeConfigs': db.ITimeConfig[];
  '/api/database/reminderConfigs': db.IReminderConfig[];

  [key: `/api/database/guilds/${number}`]: db.IGuild;
  [key: `/api/database/users/${number}`]: db.IUser;
  [key: `/api/database/webhooks/${number}`]: db.IWebhook;
  [key: `/api/database/timeConfigs/${number}`]: db.ITimeConfig;
  [key: `/api/database/reminderConfigs/${number}`]: db.IReminderConfig;

  [key: `/api/database/guilds/${number}/users`]: db.IUser;
  [key: `/api/database/guilds/${number}/webhooks`]: db.IWebhook;
  [key: `/api/database/guilds/${number}/timeConfigs`]: db.ITimeConfig;
  [key: `/api/database/guilds/${number}/reminderConfigs`]: db.IReminderConfig;
};
