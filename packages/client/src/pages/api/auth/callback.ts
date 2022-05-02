import { NextApiRequest, NextApiResponse } from 'next';
import { authenticate } from '~/libs/appAuth';
import { discordAuthorize } from '~/libs/discordAuth';
import { apiErrorHandler } from '~/libs/error';

export default async function OauthCallback(req: NextApiRequest, res: NextApiResponse) {
  try {
    await authenticate({
      req,
      res,
      ...discordAuthorize(req.query.code),
    });
    return res.redirect('/configure');
  } catch (e) {
    apiErrorHandler(req, res, e);
  }
}
