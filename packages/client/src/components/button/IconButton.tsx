import { createStyles, UnstyledButton, Group, Box, Text, Title, Center, MantineSize } from '@mantine/core';
import { Icon } from 'tabler-icons-react';
import Image from 'next/image';
import Link from 'next/link';
import { CSSProperties } from 'react';

type DiscordButtonProps = {
  icon?: Icon;
  iconSize?: number;
  iconPath?: string;
  label?: string;
  size?: MantineSize;
  weight?: CSSProperties['fontWeight'];
  href?: string;
  onClick?: () => void;
  color?: string;
  hoverColor?: string;
};

type IconStyleParams = {
  color?: string;
  hoverColor?: string;
};

const useStyles = createStyles((theme, param: IconStyleParams) => ({
  iconButton: {
    padding: `${theme.spacing.xs}px ${theme.spacing.md}px`,
    borderRadius: theme.radius.md,
    backgroundColor: param.color ?? '#1664ab',

    '&:hover': {
      backgroundColor: param.hoverColor ?? param.color ?? '#1c7ed6',
    },
  },
}));

function ArrowButton({
  color,
  hoverColor,
  label,
  size,
  weight,
  href,
  onClick,
  icon: Icon,
  iconPath,
  iconSize,
}: DiscordButtonProps) {
  iconSize = iconSize ?? size === 'sm' ? 24 : 32;
  const { classes } = useStyles({ color, hoverColor });
  const dButton = (
    <UnstyledButton className={classes.iconButton} onClick={onClick}>
      <Group direction="row" spacing="md" align="center">
        {Icon ? <Icon size={iconSize} /> : iconPath && <Image src={iconPath} width={iconSize} height={iconSize} />}
        {label && <Text size={size ?? 'xl'} weight={weight} children={label} />}
      </Group>
    </UnstyledButton>
  );

  return href ? <Link href={href} children={dButton} passHref /> : dButton;
}

export default ArrowButton;
