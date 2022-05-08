import { NextApiRequest, NextApiResponse } from 'next';
import { genDiscordAuthUrl } from '~/libs/discordAuth';

export default function getOauthUrl(req: NextApiRequest, res: NextApiResponse) {
  const { bot, guild_id } = req.query;

  return res.send(genDiscordAuthUrl(bot === 'true', guild_id as string));
}
