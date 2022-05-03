import { Center, Divider, Group, Paper, Text, Title } from '@mantine/core';
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
import { sleep } from '~/utils/sleep';
import { configRouting } from '.';
import { useRouter } from 'next/router';
import WebhookUrlForm from '~/components/form/webhookUrl';

export default function Login() {
  const { isAuthenticated } = useAuth();
  const router = useRouter();
  configRouting(router, isAuthenticated);

  const [AuthUrlErr, setAuthUrlErr] = useState(false);
  const [isDRModelOpen, toggleDRModel] = useBooleanToggle(false);
  const { refetch: getOauthUrl } = useQuery<string>(AppRoutes.api('/auth/oauth'), {
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
          <Title>Bot Configuration</Title>
          <Text>This is for configuring the bot in your server</Text>
          <Text>Please use the same login method as what you had use when adding</Text>
        </Group>
      </Center>
      <Divider my="xl" />
      <Group direction="row" position="apart">
        <Title order={2}>Not in server??</Title>
        <IconButton label="Add to Server" weight="bold" href="/add" icon={Link} />
      </Group>
      <Divider my="xl" />
      <Group direction="row" position="apart">
        <Title order={2}>With Discord Bot</Title>
        <IconButton
          label="Login with Discord"
          weight="bold"
          onClick={onDiscordLoginClick}
          iconPath="/assets/logo/discordWhite.png"
        />
      </Group>
      <Divider my="xl" />
      <TextOverlay height={80} text="Not supported yet ><">
        <Group direction="row" position="apart">
          <Title order={2}>With Webhook Url</Title>
          <WebhookUrlForm />
        </Group>
      </TextOverlay>
    </Paper>
  );
}
