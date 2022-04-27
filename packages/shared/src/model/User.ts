import { Schema } from 'mongoose';
import { createModel, Base } from './libs';

export interface IUser extends Base {
  _id: string;
  username: string;
  discriminator: string;
  guild_ids: string[];
  last_login: Date;
  avatar: string | undefined;
  refresh_token: string;
  access_token: string;
  expires_at: Date;

  //Virtual
  _discriminator: number;
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

  refresh_token: {
    type: String,
    required: true,
  },
  access_token: {
    type: String,
    required: true,
  },
  expires_at: {
    type: Date,
    required: true,
  },
});

userSchema
  .virtual('_discriminator')
  .get(function (this: IUser) {
    return parseInt(this.discriminator);
  })
  .set(function (this: IUser, value: number) {
    this.discriminator = value.toString();
  });

export const User = createModel('User', userSchema);
