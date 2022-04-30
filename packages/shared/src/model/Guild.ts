import { Schema } from 'mongoose';
import { schemaOptions, createModel, Base } from './libs';
export interface IGuild extends Base {
  _id: string;
  name?: string | undefined;
  user_ids: string[];
  webhook_ids: string[];
  time_config_ids: string[];
  reminder_config_ids: string[];
  info_config_id?: string | undefined; //TODO: Merge with Guild
}

export const GuildSchema = new Schema<IGuild>(
  {
    _id: String,
    name: String,
    user_ids: [
      {
        type: String,
        ref: 'User',
      },
    ],
    webhook_ids: [
      {
        type: String,
        ref: 'Webhook',
      },
    ],
    time_config_ids: [
      {
        type: String,
        ref: 'TimeConfig',
      },
    ],
    reminder_config_ids: [
      {
        type: String,
        ref: 'ReminderConfig',
      },
    ],
    info_config_id: {
      type: String,
      ref: 'InfoConfig',
    },
  },
  schemaOptions,
);

export const Guild = createModel('Guild', GuildSchema);
