import Head from 'next/head';
import { ReactNode } from 'react';
import { ReactQueryDevtools } from 'react-query/devtools';
import AppHeader from './AppHeader';

type AppLayoutProps = { children: ReactNode };

export const AppLayout = ({ children }: AppLayoutProps) => {
  return (
    <>
      <Head>
        <title>Sky Time</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <AppHeader />
      <main>{children}</main>

      {process.env.NODE_ENV !== 'production' && <ReactQueryDevtools initialIsOpen={false} />}
    </>
  );
};

export default AppLayout;
