import { Group, Paper, Box, Text, Title, Center, Divider, Overlay } from '@mantine/core';
import { useBooleanToggle } from '@mantine/hooks';
import DiscordButton from '~/components/button/DiscordButton';
import DiscordRedirectModal from '~/components/modal/DiscordRedirect';
import { trpc } from '~/libs/trpc/client';

function AddPage() {
  const { data: authJson, isSuccess: isAuthUrlSuccess } = trpc.useQuery(['authUrl', { withBot: true }]);
  const [isDRModelOpen, toggleDRModel] = useBooleanToggle(false);
  const onDiscordLoginClick = () => {
    setTimeout(() => {
      toggleDRModel();
      if (isAuthUrlSuccess) location.href = authJson.authUrl;
    }, 5000);
    toggleDRModel();
  };

  return (
    <>
      <DiscordRedirectModal opened={isDRModelOpen} />
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
          <Box sx={{ height: 150, position: 'relative' }}>
            <Overlay opacity={0.6} color="#000" zIndex={5} p={60}>
              <Center>
                <Text size="xl" color="white">
                  Coming soon
                </Text>
              </Center>
            </Overlay>
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
          </Box>
        </section>
      </Paper>
    </>
  );
}

export default AddPage;
