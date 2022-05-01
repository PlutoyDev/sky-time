import { TokenExpiredError, JsonWebTokenError } from 'jsonwebtoken';
import { NODE_ENV } from './constants';
import type { NextApiRequest, NextApiResponse } from 'next';

export const enum ErrorType {
  AUTH_INVALID_CODE = 'auth_invalid_code',
  AUTH_MISSING_GUILD = 'auth_missing_guild',
  AUTH_MISSING_PARAMS = 'auth_missing_params',
  AUTH_USER_NOT_FOUND = 'auth_user_not_found',
  AUTH_GUILD_NOT_FOUND = 'auth_guild_not_found',
  AUTH_MISSING_REFRESH_TOKEN = 'auth_missing_refresh_token',
  AUTH_MISSING_ACCESS_TOKEN = 'auth_missing_access_token',
  AUTH_INVALID_REFRESH_TOKEN = 'auth_invalid_refresh_token',
  AUTH_INVALID_ACCESS_TOKEN = 'auth_invalid_access_token',

  DISCORD_API_MISSING_PARAMS = 'discord_api_missing_params',

  //HTTP Client side errors
  BAD_REQUEST = 'bad_request',
  FORBIDDEN = 'forbidden',
  NOT_FOUND = 'not_found',
  NOT_AUTHORIZED = 'not_authorized',
  METHOD_NOT_ALLOWED = 'method_not_allowed',
  //HTTP Server side errors
  NOT_IMPLEMENTED = 'not_implemented',

  MISSING_PARAMS = 'missing_params',
  RESOURCE_NOT_FOUND = 'resource_not_found',
}

export class AppError extends Error {
  get errorUrl(): string {
    return `/error?=${this.type}`;
  }

  get status(): number {
    switch (this.type) {
      case ErrorType.BAD_REQUEST:
      case ErrorType.AUTH_INVALID_CODE:
      case ErrorType.AUTH_MISSING_GUILD:
      case ErrorType.AUTH_MISSING_PARAMS:
      case ErrorType.MISSING_PARAMS:
        return 400;

      case ErrorType.NOT_AUTHORIZED:
      case ErrorType.AUTH_MISSING_REFRESH_TOKEN:
      case ErrorType.AUTH_MISSING_ACCESS_TOKEN:
      case ErrorType.AUTH_INVALID_REFRESH_TOKEN:
      case ErrorType.AUTH_INVALID_ACCESS_TOKEN:
        return 401;

      case ErrorType.FORBIDDEN:
        return 403;

      case ErrorType.NOT_FOUND:
      case ErrorType.RESOURCE_NOT_FOUND:
      case ErrorType.AUTH_USER_NOT_FOUND:
      case ErrorType.AUTH_GUILD_NOT_FOUND:
        return 404;

      case ErrorType.METHOD_NOT_ALLOWED:
        return 405;

      default:
        return 500;
    }
  }

  constructor(public type: ErrorType, message?: string) {
    super(message ?? type.split('_').join(' '));
  }
}

export const apiErrorHandler = (req: NextApiRequest, res: NextApiResponse, error: any) => {
  const { method, headers, body, query } = req;
  //TODO: Add MongoDB error handling
  //TODO: Add Mongoose Error Handling

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
};
