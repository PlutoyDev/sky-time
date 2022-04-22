import { Group, Modal, Center, Loader, Text } from '@mantine/core';

type Props = {
  opened: boolean;
  onClose?: () => void;
};

function DiscordRedirectModal({ opened, onClose }: Props) {
  onClose = onClose ?? (() => {});

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
          You will be redirected to Discord shortly to authorize the bot to access your server
        </Text>
      </Group>
    </Modal>
  );
}

export default DiscordRedirectModal;
