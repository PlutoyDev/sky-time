import { refresh, verifyRefreshToken } from '~/libs/authentication';
import { NextApiRequest, NextApiResponse } from 'next';
import { REFRESH_TOKEN_COOKIE_NAME } from '~/libs/constants';

export default async (req: NextApiRequest, res: NextApiResponse) => {
  const refresh_token = req.cookies[REFRESH_TOKEN_COOKIE_NAME];
  if (!refresh_token) {
    return res.status(401).json({
      error: 'refresh_token_not_found',
    });
  }
  const data = await refresh(refresh_token);

  res.json(data);
};
