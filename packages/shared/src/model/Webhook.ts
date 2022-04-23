import mongoose from 'mongoose';
import { autoPopField, timestampMap } from './pre';

export const webhookSchema = new mongoose.Schema(
  {
    _id: String,
    token: String,
    guild_id: autoPopField(String, 'Guild'),
    channel_id: String,
  },
  {
    timestamps: timestampMap,
  },
);

export const Webhook = mongoose.model('Webhook', webhookSchema);
