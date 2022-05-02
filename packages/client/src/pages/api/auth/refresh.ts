import { refresh } from '~/libs/appAuth';
import { NextApiRequest, NextApiResponse } from 'next';
import { apiErrorHandler } from '~/libs/error';

export default async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    res.json(await refresh(req.cookies));
  } catch (e) {
    apiErrorHandler(req, res, e);
  }
};
