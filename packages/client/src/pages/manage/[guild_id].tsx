import { APIGuild, Routes } from 'discord-api-types/v9';
import { useRouter } from 'next/router';
import { useQuery } from 'react-query';
import { useAuth } from '~/context/AuthContext';
import { AppRoutes } from '~/libs/appRoutes';
import db from '~/libs/database';

function ManageBotPage() {
  const { isAuthenticated, type: authType } = useAuth({ protected: true });
  const router = useRouter();
  const guild_id = router.query.guild_id as string;
  const { data: dbGuild } = useQuery<db.IGuild>(AppRoutes.database('guilds', guild_id), {
    enabled: isAuthenticated === true,
  });

  const { data: discordGuild } = useQuery<APIGuild>(AppRoutes.discord(Routes.guild(guild_id)), {
    enabled: isAuthenticated === true && authType === 'Oauth',
  });

  return <div>{guild_id}</div>;
}

export default ManageBotPage;
