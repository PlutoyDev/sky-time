import mongoose from 'mongoose';
import { autoPopField, timestampMap } from './pre';

export const userSchema = new mongoose.Schema(
  {
    _id: String,
    guild_ids: [autoPopField(String, 'Guild')],
    username: String,
    discriminator: String,
    avatar: String,
    refresh_token: String,
    access_token: String,
    expires_at: Date,
    admin: Boolean,
    last_login: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: timestampMap,
  },
);

export const User = mongoose.model('User', userSchema);
