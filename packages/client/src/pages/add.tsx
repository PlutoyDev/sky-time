import { Group, Paper, Box, Text, Title, Center, Divider, Button, Overlay } from '@mantine/core';
import { useBooleanToggle } from '@mantine/hooks';
import { Link } from 'tabler-icons-react';
import DiscordButton from '~/components/button/DiscordButton';
import IconButton from '~/components/button/IconButton';
import TextOverlay from '~/components/TextOverlay';
import DiscordRedirectModal from '~/components/modal/DiscordRedirect';
import { useState } from 'react';
import { useQuery } from 'react-query';
import { AppRoutes } from '~/libs/appRoutes';
import { sleep } from '~/utils/sleep';
import WebhookUrlForm from '~/components/form/webhookUrl';

function AddPage() {
  const [AuthUrlErr, setAuthUrlErr] = useState(false);
  const [isDRModelOpen, toggleDRModel] = useBooleanToggle(false);
  const { refetch: getOauthUrl } = useQuery<string>(AppRoutes.api('/auth/oauth?mode=add'), {
    enabled: false,
  });

  const onDiscordLoginClick = async () => {
    toggleDRModel();
    const [{ data: authUrl }] = await Promise.all([getOauthUrl(), sleep(5000)]).catch(
      () => void setAuthUrlErr(true) || [],
    );
    if (authUrl) {
      window.location.href = authUrl;
    } else {
      setAuthUrlErr(true);
      await sleep(5000);
      toggleDRModel();
      setAuthUrlErr(false);
    }
  };

  return (
    <Paper>
      <DiscordRedirectModal opened={isDRModelOpen} error={AuthUrlErr} />
      <Center>
        <Group direction="column" align="center" spacing={0}>
          <Title>Add to your Discord Server</Title>
          <Text>Use one of the method bellow to add to your server</Text>
        </Group>
      </Center>
      <Divider my="xl" />
      <section>
        <Group position="apart">
          <Title order={2}>Already in server??</Title>
          <IconButton label="Configure Bot" weight="bold" href="/configure" icon={Link} />
        </Group>
      </section>
      <Divider my="xl" />
      <section>
        <Group position="apart">
          <Group direction="column" spacing="xs">
            <Title order={2}>With Discord Bot</Title>
            <Text> Easiest way to configure </Text>
            <Text> Bots can grab the info it needs to configure </Text>
          </Group>
          <IconButton
            label="Add to Server"
            weight="bold"
            onClick={onDiscordLoginClick}
            iconPath="/assets/logo/discordWhite.png"
          />
        </Group>
      </section>
      <Divider my="xl" />
      <section>
        <TextOverlay height={150} text="Not supported yet ><">
          <Group position="apart">
            <Group direction="column" spacing="xs">
              <Title order={2}>With Webhook Url</Title>
              <Text> Don't trust me with your data and your server's data, Sure!! </Text>
              <Text> Let's do the slightly inconvenient way </Text>
            </Group>

            <Center>
              <WebhookUrlForm />
            </Center>
          </Group>
        </TextOverlay>
      </section>
    </Paper>
  );
}

export default AddPage;
