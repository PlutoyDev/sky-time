import { useState } from 'react';
import { useQuery } from 'react-query';
import { ExclamationMark } from 'tabler-icons-react';
import IconButton from '~/components/button/IconButton';
import { AppRoutes } from '~/libs/appRoutes';
import { sleep } from '~/utils/sleep';

type Props = {
  addBot?: boolean;
};

export default function DiscordLoginForm({ addBot }: Props) {
  const { refetch: getOauthUrl } = useQuery<string>(AppRoutes.api(`/auth/oauth?bot=${addBot ?? false}`), {
    enabled: false,
    retryDelay: 1500,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const onButtonClick = async () => {
    if (error || loading) return;
    setLoading(true);
    const [{ data: authUrl }] = await Promise.all([getOauthUrl(), sleep(5000)]).catch(() => void setError(true) || []);
    setLoading(false);
    if (!error && authUrl) {
      window.location.href = authUrl;
    } else {
      setError(true);
      await sleep(5000);
      setError(false);
    }
  };

  return (
    <IconButton
      label={loading ? 'Redirecting ...' : error ? 'Error redirecting' : 'Login with Discord'}
      weight="bold"
      color={error ? '#FF3737' : '#5865F2'}
      onClick={onButtonClick}
      iconPath="/assets/logo/discordWhite.png"
      icon={error ? ExclamationMark : undefined}
      loading={loading}
    />
  );
}
