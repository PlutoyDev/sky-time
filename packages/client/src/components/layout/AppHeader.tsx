import React from 'react';
import { createStyles, Center, Header, Container, Group, UnstyledButton } from '@mantine/core';
import { useBooleanToggle } from '@mantine/hooks';
import Link from 'next/link';
import { useRouter } from 'next/router';

const HEADER_HEIGHT = 60;

const useStyles = createStyles(theme => ({
  inner: {
    height: HEADER_HEIGHT,
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: theme.colors.dark[6],
    boxShadow: `5px 5px 10px ${theme.colors.dark[9]}`,
  },

  links: {
    [theme.fn.smallerThan('sm')]: {
      display: 'none',
    },
  },

  burger: {
    [theme.fn.largerThan('sm')]: {
      display: 'none',
    },
  },

  link: {
    display: 'block',
    lineHeight: 1,
    padding: '8px 12px',
    borderRadius: theme.radius.sm,
    textDecoration: 'none',
    color: theme.colorScheme === 'dark' ? theme.colors.dark[0] : theme.colors.gray[7],
    fontSize: theme.fontSizes.sm,
    fontWeight: 500,

    '&:hover': {
      backgroundColor: theme.colorScheme === 'dark' ? theme.colors.dark[6] : theme.colors.gray[0],
    },
  },

  activeLink: {
    backgroundColor: theme.colorScheme === 'dark' ? theme.colors.dark[5] : theme.colors.gray[2],

    '&:hover': {
      backgroundColor: theme.colorScheme === 'dark' ? theme.colors.dark[5] : theme.colors.gray[2],
    },
  },

  linkLabel: {
    marginRight: 5,
  },
}));

interface NavLinks {
  label: string;
  link: string;
}

const links: NavLinks[] = [
  // {
  //   label: 'Home',
  //   link: '/',
  // },
  {
    label: 'Add To Server',
    link: '/add',
  },
  {
    label: 'Configure Bot',
    link: '/configure',
  },
  // {
  //   label: 'FAQ',
  //   link: '/faq',
  // },
  // {
  //   label: 'Contact Developer',
  //   link: '/contact',
  // },
];

interface AppHeaderProps {}

export function NavButton({ label, link }: NavLinks) {
  const router = useRouter();
  const isActive = router.pathname === link;
  const { classes } = useStyles();
  const linkClassName = classes.link + (isActive ? ` ${classes.activeLink}` : '');
  return (
    <Link href={link} passHref>
      <UnstyledButton className={linkClassName}>
        <Center>
          <span className={classes.linkLabel}>{label}</span>
        </Center>
      </UnstyledButton>
    </Link>
  );
}

export function AppHeader({}: AppHeaderProps) {
  const { classes } = useStyles();
  const [opened, toggleOpened] = useBooleanToggle(false);

  const items = links.map(link => <NavButton key={link.label} {...link} />);

  return (
    <Header height={HEADER_HEIGHT} sx={{ borderBottom: 0 }}>
      <Container className={classes.inner} fluid>
        <Group>
          {/* <Burger opened={opened} onClick={() => toggleOpened()} className={classes.burger} size="sm" /> */}
          {/* <AppLogo /> */}
        </Group>
        <Group spacing={10} className={classes.links}>
          {items}
        </Group>
        <Group>{/* <UserButton /> */}</Group>
      </Container>
    </Header>
  );
}

export default AppHeader;
