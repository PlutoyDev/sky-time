import { httpBatchLink } from '@trpc/client/links/httpBatchLink';
import { loggerLink } from '@trpc/client/links/loggerLink';
import { withTRPC } from '@trpc/next';
import { NextPage } from 'next';
import { AppProps } from 'next/app';
import { AppType } from 'next/dist/shared/lib/utils';
import { ReactElement, ReactNode, useMemo, useState } from 'react';
import superjson from 'superjson';
import { AppLayout } from '~/components/layout/AppLayout';
import type { AppRouter } from '~/router';
import { MantineThemeOverride, MantineProvider } from '@mantine/core';
import getBaseUrl from '~/utils/getBaseUrl';
import { trpc } from '~/libs/trpc/client';
import { QueryClient, QueryClientProvider } from 'react-query';
import { AuthProvider } from '~/context/AuthContext';

const appTheme: MantineThemeOverride = {
  colorScheme: 'dark',
};

export type NextPageWithLayout = NextPage & {
  getLayout?: (page: ReactElement) => ReactNode;
};

type AppPropsWithLayout = AppProps & {
  Component: NextPageWithLayout;
};

function addProviders(children: ReactNode) {
  const [accessToken, setAccessToken] = useState<string>();
  const [queryClient] = useState(() => new QueryClient());
  const [trpcClient] = useState(() =>
    trpc.createClient({
      url: '/api/trpc',
      transformer: superjson,
      links: [
        loggerLink({
          enabled: (opts) =>
            process.env.NODE_ENV === 'development' || (opts.direction === 'down' && opts.result instanceof Error),
        }),
        httpBatchLink({
          url: `/api/trpc`,
        }),
      ],
      headers: () => ({ authorization: accessToken }),
    }),
  );

  return (
    <trpc.Provider client={trpcClient} queryClient={queryClient}>
      <QueryClientProvider client={queryClient}>
        <AuthProvider setAccessToken={setAccessToken}>
          <MantineProvider theme={appTheme} withGlobalStyles emotionOptions={{ key: 'mantine', prepend: true }}>
            {children}
          </MantineProvider>
        </AuthProvider>
      </QueryClientProvider>
    </trpc.Provider>
  );
}

export default function MyApp({ Component, pageProps }: AppPropsWithLayout) {
  // const getLayout = Component.getLayout ?? ((page) => <AppLayout>{page}</AppLayout>);

  return addProviders(
    <AppLayout>
      <Component {...pageProps} />
    </AppLayout>,
  );
}
