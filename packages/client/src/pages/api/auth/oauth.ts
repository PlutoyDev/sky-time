import { NextApiRequest, NextApiResponse } from 'next';
import { genDiscordAuthUrl } from '~/libs/discordAuth';

export default function getOauthUrl(req: NextApiRequest, res: NextApiResponse) {
  return res.send(genDiscordAuthUrl(true));
}
