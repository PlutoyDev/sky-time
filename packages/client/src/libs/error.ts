export const enum ErrorType {
  AUTH_INVALID_CODE = 'auth_invalid_code',
  AUTH_MISSING_GUILD = 'auth_missing_guild',
  AUTH_MISSING_PARAMS = 'auth_missing_params',
  AUTH_USER_NOT_FOUND = 'auth_user_not_found',
  AUTH_GUILD_NOT_FOUND = 'auth_guild_not_found',
}

export class AppError extends Error {
  get errorUrl(): string {
    return `/error?=${this.type}`;
  }

  constructor(public type: ErrorType, public message: string) {
    super(message);
  }
}
