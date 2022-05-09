import { NextFunction, Request, Response } from 'express';
import { APIGuildChannel, GuildChannelType, Routes } from 'discord-api-types/v9';
import jwt, { TokenExpiredError, JsonWebTokenError } from 'jsonwebtoken';
import { HARDCODED_ADMIN_IDS, JWT_ACCESS_TOKEN_SECRET, NODE_ENV } from './constants';

//JWT Access Token
type AccessTokenPayload =
  | {
      type: 'Oauth';
      user_id: string;
      guild_ids: string[];
      webhook_ids: string[];
      channel_ids: string[];
    }
  | {
      type: 'Webhook';
      guild_ids: string[];
      webhook_ids: string[];
    };

export const verifyAccessToken = (token: string) =>
  jwt.verify(token, JWT_ACCESS_TOKEN_SECRET) as AccessTokenPayload & { iat: number };

type RequestWithAccess = Request & { access?: AccessTokenPayload };

export const AuthMiddleware = (req: RequestWithAccess, res: Response, next: NextFunction) => {
  const access_token = req.headers.authorization?.split(' ')[1];
  if (!access_token) {
    res.status(401).json({
      message: 'Missing access token',
    });
    return false;
  }
  try {
    const payload = verifyAccessToken(access_token);
    req.access = payload;
    return next();
  } catch (e) {
    if (e instanceof TokenExpiredError || e instanceof JsonWebTokenError) {
      res.status(401).json({
        message: 'Invalid access token',
      });
      return false;
    }
  }
};

export const AdminAuthMiddleware = (req: RequestWithAccess, res: Response, next: NextFunction) => {
  if (!req.access) {
    res.status(401).json({
      message: 'Unknown error',
    });
    return false;
  }
  if (req.access.type !== 'Oauth' || !HARDCODED_ADMIN_IDS.includes(req.access.user_id)) {
    res.status(403).json({
      message: 'Not an admin',
    });
    return false;
  }
  return next();
};
