import { Schema } from 'mongoose';
import { autoPopField, createModel, timestamps } from './libs';

export interface IWebhook {
  _id: string;
  token: string;
  guild_id: string;
  channel_id: string;
}

export const webhookSchema = new Schema<IWebhook>(
  {
    _id: String,
    token: String,
    guild_id: autoPopField(String, 'Guild'),
    channel_id: String,
  },
  {
    timestamps,
  },
);

export const Webhook = createModel('Webhook', webhookSchema);
