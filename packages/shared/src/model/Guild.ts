import mongoose from 'mongoose';
import { autoPopField, timestampMap } from './pre';

export const guildSchema = new mongoose.Schema(
  {
    _id: String,
    name: String,
    user_ids: [autoPopField(String, 'User')],
    webhook_ids: [autoPopField(String, 'Webhook')],
  },
  {
    timestamps: timestampMap,
  },
);

export const Guild = mongoose.model('Guild', guildSchema);
