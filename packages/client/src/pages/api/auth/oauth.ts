import { NextApiRequest, NextApiResponse } from 'next';
import { genDiscordAuthUrl } from '~/libs/discordAuth';

export default function getOauthUrl(req: NextApiRequest, res: NextApiResponse) {
  const { mode } = req.query;

  return res.send(genDiscordAuthUrl(mode === 'add'));
}
