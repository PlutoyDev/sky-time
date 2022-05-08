import {
  Group,
  Paper,
  Box,
  Text,
  Title,
  Center,
  Divider,
  Button,
  Overlay,
  SimpleGrid,
  Card,
  Avatar,
  UnstyledButton,
  useMantineTheme,
  Space,
  Modal,
  LoadingOverlay,
} from '@mantine/core';
import { useBooleanToggle } from '@mantine/hooks';
import { Link, CirclePlus } from 'tabler-icons-react';
import DiscordButton from '~/components/button/DiscordButton';
import IconButton from '~/components/button/IconButton';
import TextOverlay from '~/components/TextOverlay';
import { useEffect, useState } from 'react';
import { useQuery } from 'react-query';
import { AppRoutes } from '~/libs/appRoutes';
import { sleep } from '~/utils/sleep';
import { useAuth } from '~/context/AuthContext';
import {
  RESTGetAPICurrentUserGuildsResult as CurrentUserGuilds,
  RESTAPIPartialCurrentUserGuild as CurrentUserGuild,
  RESTGetCurrentUserGuildMemberResult as CurrentUserGuildMember,
  Routes,
} from 'discord-api-types/v9';
import { Collection } from '@discordjs/collection';
import { useRouter } from 'next/router';

import type db from '~/libs/database';
import DiscordLoginForm from '~/components/form/discordLogin';

type GuildCardData = {
  id: string;
  name?: string;
  icon?: string | null;
  inDb?: boolean;
};

type GuildCardProp = GuildCardData & {
  onButtonClick: (id: string) => void;
};

function GuildCard({ id, name, icon, inDb, onButtonClick }: GuildCardProp) {
  const isLoadMore = id === 'load-more';
  const iconUrl = icon
    ? `https://cdn.discordapp.com/icons/${id}/${icon}.png?size=${128}`
    : 'https://cdn.discordapp.com/embed/avatars/0.png';
  name = isLoadMore ? 'Load from Discord' : name ?? id;

  const onClick = () => onButtonClick(id);
  return (
    <UnstyledButton onClick={onClick}>
      <Card withBorder radius="md">
        <Card.Section>
          {!isLoadMore ? (
            <Avatar src={iconUrl} size={150} radius={10} />
          ) : (
            <Center
              style={{ width: 150, height: 150, backgroundColor: '#25282c' }}
              children={<CirclePlus size={90} strokeWidth={2} />}
            />
          )}
        </Card.Section>
        <Space my="xs" />
        <Card.Section>
          <Text
            style={{
              width: 150,
              minHeight: 76,
              lineClamp: 3,
              overflow: 'hidden',
              textAlign: 'center',
            }}
          >
            {name}
          </Text>
        </Card.Section>
      </Card>
    </UnstyledButton>
  );
}

export default function SelectGuildPage() {
  const router = useRouter();
  const theme = useMantineTheme();

  const [openModal, setOpenModel] = useState(false);
  const [selectedGuildId, setSelectedGuildId] = useState<string>('');
  const { isAuthenticated, type: authType } = useAuth({ protected: true });
  const [guildsCollection] = useState(() => new Collection<string, GuildCardData>());
  // const [useDiscord, setUseDiscord] = useState(false);
  const { data: dbGuilds, status: dbStatus } = useQuery<db.IGuild[]>(AppRoutes.database('guilds'), {
    enabled: isAuthenticated === true,
  });
  const {
    data: curUserGuilds,
    status: disStatus,
    refetch: fetchDis,
  } = useQuery<CurrentUserGuilds>(AppRoutes.discord(Routes.userGuilds()), {
    enabled: false,
  });

  const loading = dbStatus === 'idle' || dbStatus === 'loading' || disStatus === 'loading';

  const onCardClick = (id: string) => {
    if (id === 'load-more') {
      fetchDis();
    } else {
      setSelectedGuildId(id);
      if (guildsCollection.get(id)?.inDb) {
        router.push(`/manage/${id}`);
      } else {
        setOpenModel(true);
      }
    }
  };

  if (dbGuilds) {
    dbGuilds.forEach(guild => {
      if (!guildsCollection.has(guild._id))
        guildsCollection.set(guild._id, {
          id: guild._id,
          name: guild.name,
          icon: guild.icon,
          inDb: true,
        });
    });
  }
  if (curUserGuilds) {
    curUserGuilds.forEach(guild => {
      const perm = parseInt(guild.permissions, 10);
      const hasManageGuild = perm & 0x00000020;
      if (!guildsCollection.has(guild.id) && hasManageGuild) {
        guildsCollection.set(guild.id, {
          id: guild.id,
          name: guild.name,
          icon: guild.icon,
          inDb: false,
        });
      }
    });
  }

  const guildCards = guildsCollection.map(guild => <GuildCard onButtonClick={onCardClick} key={guild.id} {...guild} />);

  if (authType === 'Oauth' && !curUserGuilds) {
    guildCards.push(<GuildCard onButtonClick={onCardClick} key="load-more" id="load-more" />);
  }

  return (
    <>
      <Modal
        centered
        opened={openModal}
        onClose={() => setOpenModel(false)}
        title={<Title order={3} children="Bot is not in server" />}
        transition="fade"
        transitionDuration={600}
        transitionTimingFunction="ease"
      >
        <Center>
          <DiscordLoginForm addBot guildId={selectedGuildId} />
        </Center>
      </Modal>
      <div style={{ position: 'relative' }}>
        <LoadingOverlay visible={loading} />
        <Paper>
          <Title mb="lg">Select Server</Title>
          <Group p="md" position="left" style={{ backgroundColor: theme.colors.gray[8] }}>
            {guildCards}
          </Group>
        </Paper>
      </div>
    </>
  );
}
