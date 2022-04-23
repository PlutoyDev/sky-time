import { Schema } from 'mongoose';
import { autoPopField, timestamps, createModel } from './libs';

export interface IGuild {
  _id: string;
  name: string;
  user_ids: string[];
  webhook_ids: string[];
}

export const guildSchema = new Schema<IGuild>(
  {
    _id: String,
    name: String,
    user_ids: [autoPopField(String, 'User')],
    webhook_ids: [autoPopField(String, 'Webhook')],
  },
  {
    timestamps,
  },
);

export const Guild = createModel('Guild', guildSchema);
