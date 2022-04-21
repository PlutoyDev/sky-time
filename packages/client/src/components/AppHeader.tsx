import React from 'react';
import { createStyles, Menu, Center, Header, Container, Group, UnstyledButton } from '@mantine/core';
import { useBooleanToggle } from '@mantine/hooks';
import { ChevronDown } from 'tabler-icons-react';
import Link from 'next/link';
import { useRouter } from 'next/router';

const HEADER_HEIGHT = 60;

const useStyles = createStyles((theme) => ({
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

  linkLabel: {
    marginRight: 5,
  },
}));

interface NavLinks {
  label: string;
  link: string;
  links?: { link: string; label: string }[];
}

const links: NavLinks[] = [
  {
    label: 'Home',
    link: '/',
  },
  {
    label: 'Add To Server',
    link: '/add',
  },
  {
    label: 'Configure Bot',
    link: '/configure',
  },
];

interface AppHeaderProps {}

export function NavButton({ label, link, links }: NavLinks) {
  const router = useRouter();
  const { classes } = useStyles();
  const menuItems = links?.map((item) => (
    <Link href={item.link} passHref>
      <Menu.Item key={item.label}>{item.label}</Menu.Item>
    </Link>
  ));
  const NavButton = (
    <UnstyledButton className={classes.link} onClick={() => router.push(link)}>
      <Center>
        <span className={classes.linkLabel}>{label}</span>
        {!menuItems || <ChevronDown size={12} />}
      </Center>
    </UnstyledButton>
  );

  return menuItems ? (
    <Menu
      key={label}
      trigger="hover"
      delay={0}
      transition="scale-y"
      transitionDuration={200}
      placement="end"
      gutter={1}
      control={NavButton}
      children={menuItems}
    />
  ) : (
    // <NavButton />
    <Link href={link} passHref children={NavButton} />
    // NavButton
  );
}

export function AppHeader({}: AppHeaderProps) {
  const { classes } = useStyles();
  const [opened, toggleOpened] = useBooleanToggle(false);

  const items = links.map((link) => <NavButton key={link.label} {...link} />);

  return (
    <Header height={HEADER_HEIGHT} sx={{ borderBottom: 0 }} mb={120}>
      <Container className={classes.inner} fluid>
        <Group>
          {/* <Burger opened={opened} onClick={() => toggleOpened()} className={classes.burger} size="sm" /> */}
          {/* <AppLogo /> */}
        </Group>
        <Group spacing={5} className={classes.links}>
          {items}
        </Group>
        <Group>{/* <UserButton /> */}</Group>
      </Container>
    </Header>
  );
}

export default AppHeader;
