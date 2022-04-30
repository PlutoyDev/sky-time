import { Webhook, IWebhook } from '../model';

// Webhook

export const createWebhook = (webhook: IWebhook) => {
  return Webhook.create(webhook);
};

export const getWebhooks = (webhook_ids: string | string[], lean = true) => {
  const filter = typeof webhook_ids === 'string' ? { _id: webhook_ids } : { _id: { $in: webhook_ids } };
  return Webhook.find(filter, { lean }).exec();
};

export const updateWebhook = (webhook: IWebhook) => {
  return Webhook.findByIdAndUpdate(webhook._id, webhook, { new: true }).lean().exec();
};

export const deleteWebhook = (webhook_id: string) => {
  return Webhook.findByIdAndDelete(webhook_id).lean().exec();
};

// * maybe
// Webhook's Messages
// export const addWebhookMessage = (webhook_id: string, message_ids: string | string[]) => {
//   const $addToSet =
//     typeof message_ids === 'string' ? { message_ids: message_ids } : { message_ids: { $each: message_ids } };
//   return Webhook.findByIdAndUpdate(webhook_id, { $addToSet }, { new: true }).lean().exec();
// };

// export const removeWebhookMessage = (webhook_id: string, message_ids: string | string[]) => {
//   const $pull = typeof message_ids === 'string' ? { message_ids: message_ids } : { message_ids: { $in: message_ids } };
//   return Webhook.findByIdAndUpdate(webhook_id, { $pull }, { new: true }).lean().exec();
// };
