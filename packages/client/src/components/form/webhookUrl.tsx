import { ActionIcon, Group, TextInput, useMantineTheme } from '@mantine/core';
import React, { useState } from 'react';
import { ArrowRight, Clipboard } from 'tabler-icons-react';

export function WebhookUrlForm() {
  const [webhookUrl, setWebhookUrl] = useState('');
  const theme = useMantineTheme();

  const onPasteClick = (e: React.MouseEvent) => {
    navigator.clipboard.readText().then(text => {
      setWebhookUrl(text);
    });
    e.preventDefault();
  };

  const onSubmit = (e: React.MouseEvent) => {
    e.preventDefault();
  };

  const onTextChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setWebhookUrl(e.currentTarget.value);
  };

  return (
    <TextInput
      value={webhookUrl}
      size="lg"
      radius="sm"
      rightSection={
        <Group direction="row" spacing="xs" align="end">
          <ActionIcon size={36} radius="xl" color={theme.primaryColor} variant="filled" onClick={onPasteClick}>
            <Clipboard />
          </ActionIcon>
          <ActionIcon
            size={36}
            radius="xl"
            color={theme.primaryColor}
            variant="filled"
            onClick={onSubmit}
            disabled={!webhookUrl}
          >
            <ArrowRight />
          </ActionIcon>
        </Group>
      }
      placeholder="Webhook URL"
      rightSectionWidth={100}
      onChange={onTextChange}
    />
  );
}

export default WebhookUrlForm;
