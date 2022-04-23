import { Schema } from 'mongoose';
import { autoPopField, createModel, timestamps } from './libs';

export interface IUser {
  _id: string;
  guild_ids: string[];
  username: string;
  discriminator: string;
  avatar: string;
  refresh_token: string;
  access_token: string;
  expires_at: Date;
  admin: boolean;
  last_login: Date;
}

export const userSchema = new Schema<IUser>(
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
    timestamps,
  },
);

export const User = createModel('User', userSchema);
