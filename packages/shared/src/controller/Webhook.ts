import { Webhook, IWebhook } from '../model';
import { OptionalBase } from './lib';

// Webhook

export const createWebhook = (webhook: OptionalBase<IWebhook>) => {
  return Webhook.create(webhook);
};

export const getWebhook = (webhook_id: string, lean = true) => {
  return Webhook.findOne({ _id: webhook_id }, { lean }).exec();
};

export const getWebhooks = (webhook_ids: string | string[], lean = true) => {
  return Webhook.find({ _id: { $in: webhook_ids } }, { lean }).exec();
};

export const updateWebhook = (webhook: IWebhook) => {
  return Webhook.findByIdAndUpdate(webhook._id, webhook, { new: true }).lean().exec();
};

export const deleteWebhook = (webhook_id: string) => {
  return Webhook.findByIdAndDelete(webhook_id).lean().exec();
};

//Relations
export const getGuildWebhooks = (guild_id: string, lean = true) => {
  return Webhook.find({ guild_ids: { $elemMatch: guild_id } }, { lean }).exec();
};

export const getMessageWebhook = (message_id: string, lean = true) => {
  return Webhook.findOne({ message_ids: { $elemMatch: message_id } }, { lean }).exec();
};
