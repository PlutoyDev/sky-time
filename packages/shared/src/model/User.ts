import { Schema } from 'mongoose';
import { createModel, Base } from './libs';

export interface IUser extends Base {
  _id: string;
  username: string;
  discriminator: string;
  avatar: string | undefined;
  guild_ids: string[];
  last_login: Date | undefined;
}

export const userSchema = new Schema<IUser>({
  _id: String,
  username: {
    type: String,
    required: true,
  },
  discriminator: {
    type: String,
    required: true,
  },
  avatar: {
    type: String,
  },
  guild_ids: [
    {
      type: String,
      ref: 'Guild',
    },
  ],
  last_login: {
    type: Date,
    default: Date.now,
    required: true,
  },
});

export const User = createModel('User', userSchema);
