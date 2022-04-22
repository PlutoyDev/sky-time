import { createStyles, UnstyledButton, Group, Box, Text, Title, Center, MantineSize } from '@mantine/core';
import Image from 'next/image';
import Link from 'next/link';
import { CSSProperties } from 'react';

type DiscordButtonProps = {
  label: string;
  size?: MantineSize;
  weight?: CSSProperties['fontWeight'];
  href?: string;
  onClick?: () => void;
};

const useStyles = createStyles((theme) => ({
  discordButton: {
    padding: `${theme.spacing.xs}px ${theme.spacing.md}px`,
    borderRadius: theme.radius.md,
    backgroundColor: '#5865F2',
  },
}));

function DiscordButton({ label, size, weight, href, onClick }: DiscordButtonProps) {
  const { classes } = useStyles();
  const dButton = (
    <UnstyledButton className={classes.discordButton} onClick={onClick}>
      <Group direction="row" spacing="md" align="center">
        <Image src="/assets/logo/discordWhite.png" width={32} height={32} />
        <Text size={size ?? 'xl'} weight={weight}>
          {label}
        </Text>
      </Group>
    </UnstyledButton>
  );

  return href ? <Link href={href} children={dButton} passHref /> : dButton;
}

export default DiscordButton;
