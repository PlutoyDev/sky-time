import { Group, Modal, Center, Loader, Text } from '@mantine/core';

type Props = {
  error?: boolean;
  opened: boolean;
  onClose?: () => void;
};

function DiscordRedirectModal({ opened, error, onClose }: Props) {
  onClose = onClose ?? (() => {});
  const text = error
    ? `An error occurred while trying to get the authorization url`
    : `You will be redirected to Discord shortly to authorize the bot to access your server`;

  return (
    <Modal
      centered
      withCloseButton={false}
      opened={opened}
      onClose={onClose}
      title="Redirecting you..."
      overlayOpacity={0.95}
    >
      <Group>
        <Loader color="#5865F2" my="xl" mx="auto" size={120} />
        <Text size="lg" align="center">
          {text}
        </Text>
      </Group>
    </Modal>
  );
}

export default DiscordRedirectModal;
