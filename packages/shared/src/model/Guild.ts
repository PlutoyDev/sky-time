import { Schema } from 'mongoose';
import { schemaOptions, createModel, Base } from './libs';
export interface IGuild extends Base {
  _id: string;
  name: string | undefined;
  user_ids: string[];
  webhook_ids: string[];
  time_config_ids: string[];
  reminder_config_ids: string[];
  info_config_id: string | undefined;
  log_ids: string[];
}

export const GuildSchema = new Schema<IGuild>(
  {
    _id: String,
    name: String,
    user_ids: [
      {
        type: String,
        ref: 'User',
        autopopulate: true,
      },
    ],
    webhook_ids: [
      {
        type: String,
        ref: 'Webhook',
        autopopulate: true,
      },
    ],
    time_config_ids: [
      {
        type: String,
        ref: 'TimeConfig',
        autopopulate: true,
      },
    ],
    reminder_config_ids: [
      {
        type: String,
        ref: 'ReminderConfig',
        autopopulate: true,
      },
    ],
    info_config_id: {
      type: String,
      ref: 'InfoConfig',
      autopopulate: true,
    },
    log_ids: [
      {
        type: String,
        ref: 'Log',
        autopopulate: true,
      },
    ],
  },
  schemaOptions,
);

export const Guild = createModel('Guild', GuildSchema);
