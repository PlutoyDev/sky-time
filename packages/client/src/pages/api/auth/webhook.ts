import { NextApiRequest, NextApiResponse } from 'next';
import discordAxios from '~/libs/axios/discordAxios';
import { RESTGetAPIWebhookWithTokenResult } from 'discord-api-types/v9';
import authenticate from '~/libs/authentication';

export default async function webhookAuth(req: NextApiRequest, res: NextApiResponse) {
  const { id: webhook_id, token: webhook_token } = req.query;

  if (!webhook_id || !webhook_token || typeof webhook_id !== 'string' || typeof webhook_token !== 'string') {
    return res.redirect('/?error=invalid_webhook_url');
  }

  try {
    const { data: webhookData } = await discordAxios.get<RESTGetAPIWebhookWithTokenResult>(
      `/webhooks/${webhook_id}/${webhook_token}`,
    );
    const guild_id = webhookData.guild_id;
    if (!guild_id) {
      throw new Error('guild_id is not defined');
    }

    await authenticate({ res, guild_id, webhook_id, webhook_token });

    return res.redirect('/');
  } catch (e) {
    return res.redirect('/?error=invalid_webhook_url');
  }
}
