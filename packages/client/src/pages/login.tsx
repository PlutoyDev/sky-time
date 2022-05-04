import { createStyles, Divider, Group, MediaQuery, Paper, SimpleGrid, Space, Text, Title } from '@mantine/core';
import DiscordLoginForm from '~/components/form/discordLogin';
import WebhookUrlForm from '~/components/form/webhookUrl';
import TextOverlay from '~/components/TextOverlay';

const useStyles = createStyles(theme => ({
  centerText: {
    textAlign: 'center',
  },
}));

const wideBp = 'md';

function LoginPage() {
  const { classes } = useStyles();
  const onDiscordLoginClick = () => {};

  return (
    <Paper>
      <Title order={2} className={classes.centerText}>
        Login
      </Title>
      <Divider my="md" size="lg" />
      <SimpleGrid cols={1} spacing="md" breakpoints={[{ minWidth: wideBp, cols: 2, spacing: 64 }]}>
        <Group direction="column" align="stretch" spacing="xs">
          <Title order={2} className={classes.centerText}>
            With Discord
          </Title>
          <Text className={classes.centerText}> Easiest way to configure </Text>
          <Space />
          <DiscordLoginForm />
        </Group>
        <MediaQuery largerThan={wideBp} styles={{ display: 'none' }} children={<Divider size="lg" />} />
        <TextOverlay height={150} text="Not ready ><">
          <Group direction="column" align="stretch" spacing="xs">
            <Title className={classes.centerText} order={2}>
              With Webhook URL
            </Title>
            <Text className={classes.centerText} mb="sm">
              Don't trust me with your data{' '}
            </Text>
            <WebhookUrlForm />
          </Group>
        </TextOverlay>
      </SimpleGrid>
      <MediaQuery smallerThan={wideBp} styles={{ display: 'none' }} children={<Divider size="lg" />} />
    </Paper>
  );
}

export default LoginPage;
