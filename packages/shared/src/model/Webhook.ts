import { Schema } from 'mongoose';
import { createModel, schemaOptions, Base } from './libs';

export interface IWebhook extends Base {
  _id: string;
  name: string | undefined;
  token: string;
  message_ids: string[] | undefined;
  guild_id: string;
}

export const WebhookSchema = new Schema<IWebhook>(
  {
    _id: String,
    name: String,
    token: {
      type: String,
      required: true,
    },
    message_ids: [
      {
        type: String,
        ref: 'Message',
      },
    ],
    guild_id: {
      type: String,
      ref: 'Guild',
    },
  },
  schemaOptions,
);

export const Webhook = createModel('Webhook', WebhookSchema);
