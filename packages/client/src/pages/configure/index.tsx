import { Center, Divider, Group, Loader, Paper, Text, Title } from '@mantine/core';
import { useBooleanToggle } from '@mantine/hooks';
import { useState } from 'react';
import { useQuery } from 'react-query';
import { Link } from 'tabler-icons-react';
import DiscordButton from '~/components/button/DiscordButton';
import IconButton from '~/components/button/IconButton';
import TextOverlay from '~/components/TextOverlay';
import DiscordRedirectModal from '~/components/modal/DiscordRedirect';
import { useAuth } from '~/context/AuthContext';
import { AppRoutes } from '~/libs/appRoutes';
import type db from '~/libs/database';
import { sleep } from '~/utils/sleep';
import { NextRouter, useRouter } from 'next/router';
import { useEffect } from 'react';

export function configRouting(router: NextRouter, isAuthenticated: boolean) {
  useEffect(() => {
    if (isAuthenticated && router.pathname === '/configure/login') {
      router.replace('/configure/select');
    } else if (!isAuthenticated && router.pathname !== '/configure/login') {
      router.replace('/configure/login');
    }
  }, [isAuthenticated]);
}

function ConfigureMainPage() {
  const { isAuthenticated } = useAuth();
  const router = useRouter();

  configRouting(router, isAuthenticated);

  return (
    // <Center style={{ height: '80vh' }}>
    //   <Group direction="column">
    //     <Loader color="#5865F2" my="xl" mx="auto" size={120} />
    //     <Text size="lg" align="center">
    //       Loading Information...
    //     </Text>
    //   </Group>
    // </Center>
    <div></div>
  );
}

export default ConfigureMainPage;
