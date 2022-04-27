import { Group, Paper, Box, Text, Title, Center, Divider, Overlay } from '@mantine/core';
import { useBooleanToggle } from '@mantine/hooks';
import DiscordButton from '~/components/button/DiscordButton';
import ComingSoonOverlay from '~/components/ComingSoonOverlay';
import DiscordRedirectModal from '~/components/modal/DiscordRedirect';
import axios from 'axios';
import { useState } from 'react';

function AddPage() {
  const [AuthUrlErr, setAuthUrlErr] = useState(false);
  const [isDRModelOpen, toggleDRModel] = useBooleanToggle(false);
  const onDiscordLoginClick = () => {
    const authUrlPromise = axios
      .get('/api/auth/oauth')
      .then(res => res.data)
      .catch(() => undefined);
    setTimeout(async () => {
      const authUrl = await authUrlPromise;
      if (authUrl) {
        window.location.href = authUrl;
      } else {
        setAuthUrlErr(true);
        setTimeout(() => void toggleDRModel() || void setAuthUrlErr(false), 5000);
      }
    }, 5000);
    toggleDRModel();
  };

  return (
    <>
      <DiscordRedirectModal opened={isDRModelOpen} error={AuthUrlErr} />
      <Paper p="md" pl="lg">
        <Center>
          <Group direction="column" align="center" spacing={0}>
            <Title>Add to your Discord Server</Title>
            <Text>You can have the timings in your server too !!</Text>
            <Text>Use one of the method bellow to add to your server</Text>
          </Group>
        </Center>
        <Divider my="xl" />
        <section>
          <Group style={{ justifyContent: 'space-between' }}>
            <Group direction="column" spacing="xs">
              <Title order={2}>With Discord Bot</Title>
              <Text> Easiest way to configure </Text>
              <Text> Bots can grab the info it needs to configure </Text>
            </Group>
            <DiscordButton label="Add to Server" weight="bold" onClick={onDiscordLoginClick} />
          </Group>
        </section>
        <Divider my="xl" />
        <section>
          <ComingSoonOverlay height={150}>
            <Group style={{ justifyContent: 'space-between' }}>
              <Group direction="column" spacing="xs">
                <Title order={2}>With Webhook Url</Title>
                <Text> Don't trust me with your server's data, Sure!! </Text>
                <Text> Let's do the slightly inconvenient way </Text>
              </Group>
              {/* 
               //TODO: Add Webhook URL Field
              */}
            </Group>
          </ComingSoonOverlay>
        </section>
      </Paper>
    </>
  );
}

export default AddPage;
