import { createContext, useCallback, useContext, useEffect } from 'react';
import { useQuery, useQueryClient } from 'react-query';
import appAxios from '~/libs/axios/appAxios';
import type { refresh } from '../libs/appAuth';

type UserData = Awaited<ReturnType<typeof refresh>>;

type AuthContextValue = UserData & {
  refresh: () => Promise<void>;
  logout: () => void;
};

type AuthProviderProps = {
  children: React.ReactNode;
};

export const AuthContext = createContext<AuthContextValue | undefined>(undefined);

const getUserData = async () => {
  return (await appAxios.post<UserData>('/api/auth/refresh')).data;
};

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const {
    data: userAuthData,
    isSuccess,
    refetch,
  } = useQuery({
    queryKey: 'userAuthData',
    queryFn: getUserData,
    retry: false,
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
  }, []);

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

  const value: AuthContextValue | undefined = !userAuthData
    ? undefined
    : {
        refresh,
        logout,
        ...userAuthData,
      };

  return <AuthContext.Provider value={value} children={children} />;
};

export function useAuth() {
  return useContext(AuthContext);
}

export default AuthContext;
