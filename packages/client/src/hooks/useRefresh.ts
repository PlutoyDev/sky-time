import { useCallback } from 'react';
import { useQuery } from 'react-query';
import authAxios from '~/libs/axios/authAxios';

export function useRefresh(setAccessToken: (token: string | undefined) => void) {
  const refresh = useCallback(async () => {
    const { data } = await authAxios.get('/api/auth/refresh');
    setAccessToken(data.accessToken);
  }, []);

  const onQueryError = useCallback(async (error: any) => {
    // if (error instanceof TRPCClientError && error.cause instanceof TRPCError) {
    //   if (error.cause.code === "UNAUTHORIZED") {
    //     await refresh();
    //   }
    // }
  }, []);

  const onMutationError = useCallback(async (error: any) => {
    // if (error instanceof TRPCClientError && error.cause instanceof TRPCError) {
    //   if (error.cause.code === "UNAUTHORIZED") {
    //     await refresh();
    //   }
    // }
  }, []);

  return {
    refresh,
    onQueryError,
    onMutationError,
  };
}
