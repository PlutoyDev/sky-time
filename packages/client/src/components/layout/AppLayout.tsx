import Head from 'next/head';
import { ReactElement, ReactNode } from 'react';
import { ReactQueryDevtools } from 'react-query/devtools';
import AppHeader from './AppHeader';
import { AppShell, ScrollArea, Container } from '@mantine/core';

type AppLayoutProps = { children: ReactNode };

let deBorder: string | undefined = /* '1px grey solid' || */ undefined;

export const AppLayout = ({ children }: AppLayoutProps) => {
  return (
    <>
      <Head>
        <title>Sky Time</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <AppShell header={<AppHeader />}>
        <ScrollArea style={{ height: 'calc(100vh - 110px)', border: deBorder, padding: '4px' }}>
          <Container style={{ border: deBorder }}>
            <main>{children}</main>
          </Container>
        </ScrollArea>
      </AppShell>

      {process.env.NODE_ENV !== 'production' && <ReactQueryDevtools initialIsOpen={false} />}
    </>
  );
};

export default AppLayout;
