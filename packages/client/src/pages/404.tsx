import { Center, Paper, Text } from '@mantine/core';
import { useRouter } from 'next/router';

export default function Custom404() {
  const router = useRouter();

  return (
    <Center style={{ height: '80vh' }}>
      <Paper>
        <Text>{router.pathname !== '/404' ? 'Page not available \n(yet) :P' : 'Page not available'}</Text>
      </Paper>
    </Center>
  );
}
