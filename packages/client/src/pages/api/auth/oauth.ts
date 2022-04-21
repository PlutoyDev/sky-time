import { NextApiRequest, NextApiResponse } from 'next';
import getBaseUrl from '~/utils/getBaseUrl';

export default function getOauthUrl(req: NextApiRequest, res: NextApiResponse) {
  if (!process.env.DISCORD_CLIENT_ID) {
    throw new Error('DISCORD_CLIENT_ID is not defined');
  }
  const mode = req.query.mode;
  if (!mode || typeof mode !== 'string') {
    return res.redirect(getBaseUrl());
  }

  const scopeArray = ['identify', 'guilds.members.read'];
  if (mode !== 'user') scopeArray.push(mode);

  const scope = encodeURIComponent(scopeArray.join(' '));

  const param = {
    client_id: process.env.DISCORD_CLIENT_ID,
    redirect_uri: getBaseUrl() + '/api/auth/callback',
    permissions: '536871936',
    response_type: 'code',
    scope,
  };

  const url = `https://discordapp.com/api/oauth2/authorize?${new URLSearchParams(param)}`;

  return res.redirect(url);
}
