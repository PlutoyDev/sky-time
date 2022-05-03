import { createContext, useCallback, useContext, useEffect, useState } from 'react';
import { useQuery, useQueryClient } from 'react-query';
import appAxios from '~/libs/axios/appAxios';
import type { refresh } from '../libs/appAuth';

type UserData = Awaited<ReturnType<typeof refresh>>;

type AuthContextValue = UserData & {
  isAuthenticated: boolean | undefined;
  refresh: () => Promise<void>;
  logout: () => void;

  setNickname: (nickname: string | undefined) => void;
  nickname?: string;

  setGuildName: (guildName: string | undefined) => void;
  guildName?: string;
};

type AuthProviderProps = {
  children: React.ReactNode;
};

/*
avatar: string | undefined;
username: string;
discriminator: string;
discord_access_token: string | undefined;
guild_ids: string[];
access_token: string;

guild_ids: string[];
access_token: string;
avatar?: undefined;
username?: undefined;
discriminator?: undefined;
discord_access_token?: undefined;

*/

const defaultValue: AuthContextValue = {
  user_id: undefined,
  username: undefined,
  discriminator: undefined,
  avatar: undefined,

  guild_ids: [],

  access_token: '',
  discord_access_token: undefined,

  isAuthenticated: undefined,

  refresh: () => Promise.resolve(),
  logout: () => {},

  setNickname: () => {},
  nickname: undefined,

  setGuildName: () => {},
  guildName: undefined,
};

export const AuthContext = createContext<AuthContextValue>(defaultValue);

const getUserData = async () => {
  return (await appAxios.post<UserData>('/api/auth/refresh')).data;
};

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const {
    data: userAuthData,
    isSuccess: isAuthenticated,
    refetch,
  } = useQuery({
    queryKey: 'userAuthData',
    queryFn: getUserData,
    retry: false,
    refetchOnReconnect: false,
    refetchOnMount: false,
    refetchOnWindowFocus: false,
  });
  const queryClient = useQueryClient();

  const refresh = useCallback(async () => {
    await refetch({ throwOnError: true });
  }, []);

  const logout = useCallback(() => {
    throw new Error('Not implemented');
  }, []);

  useEffect(() => {
    appAxios.defaults.headers.common.Authorization = `Bearer ${userAuthData?.access_token} ${userAuthData?.discord_access_token}`;
  }, [userAuthData?.access_token, userAuthData?.discord_access_token]);

  useEffect(() => {
    queryClient.setDefaultOptions({
      queries: {
        queryFn: async ({ queryKey: [route] }) => {
          const response = await appAxios.get(route as string);
          return response.data;
        },
        onError: async (...params: unknown[]) => {
          console.log('Query Client (onQueryError)', ...params);
        },
      },
      mutations: {
        onError: async (...params: unknown[]) => {
          console.log('Query Client (onMutationError)', ...params);
        },
      },
    });
  }, []);

  const [nickname, setNickname] = useState<string | undefined>();
  const [guildName, setGuildName] = useState<string | undefined>();

  const value: AuthContextValue = !userAuthData
    ? defaultValue
    : {
        refresh,
        logout,
        ...userAuthData,
        isAuthenticated,

        nickname,
        setNickname,
        guildName,
        setGuildName,
      };

  return <AuthContext.Provider value={value} children={children} />;
};

export function useAuth() {
  return useContext(AuthContext);
}

export default AuthContext;
