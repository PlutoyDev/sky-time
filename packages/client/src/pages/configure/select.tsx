import { useRouter } from 'next/router';
import { useQuery } from 'react-query';
import { useAuth } from '~/context/AuthContext';
import { AppRoutes } from '~/libs/appRoutes';
import type db from '~/libs/database';
import { configRouting } from '.';

export default function SelectGuild() {
  const { isAuthenticated } = useAuth();
  const router = useRouter();

  configRouting(router, isAuthenticated);
  const { data: guilds, isLoading } = useQuery<db.IGuild[]>(AppRoutes.database('guilds'));

  return <div></div>;
}
