//Modified from https://github.com/mantinedev/ui.mantine.dev/tree/master/components/UserButton/UserButton.tsx

import React from 'react';
import { UnstyledButton, UnstyledButtonProps, Group, Avatar, Text, createStyles, Button } from '@mantine/core';
import { ChevronRight } from 'tabler-icons-react';
import { useAuth } from '~/context/AuthContext';
import Link from 'next/link';

const useStyles = createStyles(theme => ({
  user: {
    display: 'block',
    width: '400',
    padding: theme.spacing.md,
    color: theme.colorScheme === 'dark' ? theme.colors.dark[0] : theme.black,

    '&:hover': {
      backgroundColor: theme.colorScheme === 'dark' ? theme.colors.dark[8] : theme.colors.gray[0],
    },
  },
}));

export function UserButton() {
  const { isAuthenticated, user_id, username, discriminator, avatar, nickname, guildName, logout } = useAuth();
  const { classes } = useStyles();
  const logoutButton = (
    <Button color="red" onClick={() => logout()}>
      Logout
    </Button>
  );

  let href = '/login';
  let userDisplayName = 'Login';
  let guildDisplayName = guildName ?? '';
  let tag = '';
  let avatarUrl: string | undefined;

  if (isAuthenticated) {
    href = `/select`;
    if (user_id) {
      const parsedDiscriminator = parseInt(discriminator, 10);
      userDisplayName = nickname ?? username; //or nickname
      tag = `${nickname ? username : ''}#${discriminator}`;
      avatarUrl = avatar
        ? `https://cdn.discordapp.com/avatars/${user_id}/${avatar}.${avatar.startsWith('a_') ? 'gif' : 'png'}`
        : `https://cdn.discordapp.com/embed/avatars/${parsedDiscriminator % 5}.png`;
    } else {
      userDisplayName = `Admin of `;
    }
  }

  const _Button = (
    <Group>
      <UnstyledButton className={classes.user}>
        <Group>
          <Avatar src={avatarUrl} radius="xl" />

          <div style={{ flex: 1 }}>
            <Text size="md" weight={500} children={userDisplayName} />

            <Text color="dimmed" size="xs" children={tag} />
            <Text color="dimmed" size="xs" children={guildDisplayName} />
          </div>
          {!isAuthenticated && <ChevronRight size={28} />}
        </Group>
      </UnstyledButton>
      {isAuthenticated && logoutButton}
    </Group>
  );

  return href ? <Link href={href} passHref children={_Button} /> : _Button;
}
export default UserButton;
