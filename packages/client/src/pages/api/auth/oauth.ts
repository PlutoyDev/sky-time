import { NextApiRequest, NextApiResponse } from 'next';
import { generateAuthUrl } from '~/libs/authentication';

export default function getOauthUrl(req: NextApiRequest, res: NextApiResponse) {
  return res.send(generateAuthUrl(true));
}
