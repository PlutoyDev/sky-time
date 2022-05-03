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

  ASSERTION_FAILED = 'assertion_failed',

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
    return `/error?=${this.type}&message=${encodeURIComponent(this.message)}`;
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

  toJSON(): { type: string; message: string } {
    return { type: this.type, message: this.message };
  }
}

export function assert(condition: any, type: ErrorType, message?: string): asserts condition {
  if (!condition) {
    throw new AppError(type, message);
  }
}

export function assertMethod(value: boolean): asserts value {
  if (!value) {
    throw new AppError(ErrorType.METHOD_NOT_ALLOWED);
  }
}

export const apiErrorHandler = (req: NextApiRequest, res: NextApiResponse, error: any, useRedirect = false) => {
  const { method, headers, body, query } = req;
  //TODO: Add MongoDB error handling
  //TODO: Add Mongoose Error Handling

  const debug = NODE_ENV !== 'production' && {
    method,
    headers,
    body,
    query,
  };

  if (useRedirect) {
    res.redirect(error.errorUrl);
  }

  if (error instanceof TokenExpiredError) {
    res.status(401);
  } else if (error instanceof JsonWebTokenError) {
    res.status(403);
  } else if (error instanceof AppError) {
    res.status(error.status);
  } else {
    res.status(500);
  }

  res.json({
    error,
    debug,
  });
};
