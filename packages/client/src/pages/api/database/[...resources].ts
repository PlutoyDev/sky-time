import { JsonWebTokenError, TokenExpiredError } from 'jsonwebtoken';
import { NextApiRequest, NextApiResponse } from 'next';
import { verifyAccessToken } from '~/libs/authentication';
import { AppError, ErrorType } from '~/libs/error';
import db from '~/libs/database';
import { NODE_ENV } from '~/libs/constants';

function assertMethod(value: boolean): asserts value {
  if (!value) {
    throw new AppError(ErrorType.METHOD_NOT_ALLOWED);
  }
}

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
    console.log(method, headers, body, query);
    if (tlr === 'guilds') {
      if (tlr_id && !access.guild_ids.includes(tlr_id)) {
        throw new AppError(ErrorType.FORBIDDEN, `You are not allowed to access this guild (${tlr_id})`);
      }
      if (slr) {
        if (slr === 'users') {
          assertMethod(method === 'GET');
          const users = await db.getGuildUsers(tlr_id);
          console.log('Hello');
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
    }

    throw new AppError(ErrorType.RESOURCE_NOT_FOUND, `Resource ${tlr} not found`);

    //* Move database logic to controller
    // if (tlr === 'guilds') {
    //   if (tlr_id && !access.guild_ids.includes(tlr_id)) {
    //     throw new AppError(ErrorType.FORBIDDEN, `You are not allowed to access this guild (${tlr_id})`);
    //   } else if (tlr_id && slr) {
    //     //TODO: Sub-resources User for Guilds
    //     //TODO: Sub-resources Webhook for Guilds
    //     //TODO: Sub-resources TimeConfig for Guilds
    //     //TODO: Sub-resources ReminderConfig for Guilds
    //   } else if (method === 'GET') {
    //     const guild_ids = tlr_id ? [tlr_id] : access.guild_ids;
    //     const guilds = await Model.Guild.find({ _id: { $in: guild_ids } });
    //     res.status(200).json(guilds);
    //   } else if (method === 'PATCH') {
    //     //? use json patch instead
    //     if (!tlr_id) {
    //       throw new AppError(ErrorType.AUTH_MISSING_PARAMS, 'guild_id is required');
    //     } else {
    //       //! Add Modification Checks
    //       const guild = await Model.Guild.findByIdAndUpdate(tlr_id, body, { new: true });
    //       res.status(200).json(guild);
    //     }
    //   } else {
    //     throw new AppError(ErrorType.METHOD_NOT_ALLOWED, `${method} is not allowed`);
    //   }
    // } else if (tlr === 'users') {
    //   if (method === 'GET') {
    //     if (tlr_id) {
    //       const user = await Model.User.findById(tlr_id);
    //       if (!user) {
    //         throw new AppError(ErrorType.RESOURCE_NOT_FOUND, `User not found (${tlr_id})`);
    //       } else if (!user.guild_ids.find(id => access.guild_ids.includes(id))) {
    //         throw new AppError(ErrorType.FORBIDDEN, `You are not allowed to access this user (${tlr_id})`);
    //       } else {
    //         res.status(200).json(user);
    //       }
    //     } else {
    //       const users = await Model.User.find({ guild_ids: { $elemMatch: { $in: access.guild_ids } } });
    //       res.status(200).json(users);
    //     }
    //   } else {
    //     throw new AppError(ErrorType.METHOD_NOT_ALLOWED, `${method} is not allowed`);
    //   }
    // } else if (tlr === 'webhooks') {
    //   if (method === 'GET') {
    //     if (tlr_id) {
    //       const webhook = await Model.Webhook.findById(tlr_id);
    //       if (!webhook) {
    //         throw new AppError(ErrorType.RESOURCE_NOT_FOUND, `Webhook not found (${tlr_id})`);
    //       } else if (!access.guild_ids.includes(webhook.guild_id)) {
    //         throw new AppError(ErrorType.FORBIDDEN, `You are not allowed to access this webhook (${tlr_id})`);
    //       } else {
    //         res.status(200).json(webhook);
    //       }
    //     } else {
    //       const webhooks = await Model.Webhook.find({ guild_id: { $in: access.guild_ids } });
    //       res.status(200).json(webhooks);
    //     }
    //   } else {
    //     throw new AppError(ErrorType.METHOD_NOT_ALLOWED, `${method} is not allowed`);
    //   }
    // } else if (tlr === 'timeConfigs') {
    //   if (!tlr_id) {
    //     throw new AppError(ErrorType.AUTH_MISSING_PARAMS, 'timeConfig_id is required');
    //   }
    // } else if (tlr === 'reminderConfigs') {
    //   if (!tlr_id) {
    //     throw new AppError(ErrorType.AUTH_MISSING_PARAMS, 'reminderConfig_id is required');
    //   }
    // } else {
    //   throw new AppError(ErrorType.RESOURCE_NOT_FOUND, `Resource ${tlr} not supported`);
    // }

    // if (tlr === 'guilds') {
    //   if (method === 'GET') {
    //     if (tlr_id) {
    //       const hasAccess =
    //         access.type === 'Oauth' ? access.guild_ids.includes(tlr_id) : access.guild_id === access.guild_id;
    //       if (hasAccess) {
    //         const guild = await Model.Guild.findById(tlr_id);
    //         if (!guild) {
    //           throw new AppError(ErrorType.RESOURCE_NOT_FOUND, `Guild with ID ${tlr_id} not found.`);
    //         }
    //         res.status(200).json(guild);
    //       } else {
    //       }
    //     } else {
    //       const guild_ids = access.type === 'Oauth' ? access.guild_ids : [access.guild_id];
    //       res.json(guild_ids);
    //     }
    //   }
    // }
  } catch (error) {
    if (error instanceof TokenExpiredError) {
      res.status(401).json({
        error,
      });
      return;
    } else if (error instanceof JsonWebTokenError) {
      res.status(403).json({
        error,
      });
      return;
    } else if (error instanceof AppError) {
      res.status(error.status).json(
        NODE_ENV === 'production'
          ? { error }
          : {
              error,
              request: {
                method,
                headers,
                body,
                query,
              },
            },
      );
      return;
    } else {
      res.status(500).json({
        error,
      });
      return;
    }
  }
};
