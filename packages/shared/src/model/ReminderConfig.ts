import { Schema, Types } from 'mongoose';
import { createModel, schemaOptions, Base } from './libs';
import { v4 as uuid } from 'uuid';

export interface IReminderConfig extends Base {
  _id: string;
  name?: string | undefined;
  type: string;
  webhook_id: string;
  guild_id: string;
  strings: Map<string, string | undefined>;
  mentions: string[];
}

export const ReminderConfigSchema = new Schema<IReminderConfig>(
  {
    _id: {
      type: String,
      default: uuid,
    },
    name: String,
    type: {
      type: String,
      required: true,
    },
    webhook_id: {
      type: String,
      required: true,
      ref: 'Webhook',
    },
    guild_id: {
      type: String,
      required: true,
      ref: 'Guild',
    },
    strings: {
      type: Map,
      of: String,
    },
    mentions: [String],
  },
  schemaOptions,
);

export const ReminderConfig = createModel('ReminderConfig', ReminderConfigSchema);
