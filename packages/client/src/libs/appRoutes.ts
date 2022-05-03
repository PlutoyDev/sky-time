import { Routes } from 'discord-api-types/v9';

type TRoute = typeof Routes;
type DiscordSubPath = ReturnType<TRoute[keyof TRoute]>;

type T_TLR = 'guilds' | 'users' | 'webhooks' | 'timeConfigs' | 'reminderConfigs';
type T_SLR = Exclude<T_TLR, 'guilds'>;

export const AppRoutes = {
  api(subPath: `/${string}`) {
    return `/api${subPath}`;
  },

  discord(path: DiscordSubPath) {
    return `/api/discord/${path}`;
  },

  database(tlr: T_TLR, tlr_id?: string, slr?: T_SLR) {
    return `/api/database/${tlr}` + (tlr_id ? `/${tlr_id}` : '') + (slr ? `/${slr}` : '');
  },
};
