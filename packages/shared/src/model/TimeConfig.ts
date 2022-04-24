import { Schema, Types } from 'mongoose';
import { createModel, schemaOptions, Base } from './libs';

export interface ITimeConfig extends Base {
  name: string | undefined;
  webhook_id: string;
  guild_id: string;
  type: string;
  strings: Map<string, string | undefined>;
  enables: Map<string, boolean | undefined>;
  unix_formats: Map<string, string | undefined>;
}

export const TimeConfigSchema = new Schema<ITimeConfig>(
  {
    name: String,
    webhook_id: {
      type: String,
      required: true,
    },
    guild_id: {
      type: String,
      ref: 'Guild',
      autopopulate: true,
    },
    type: {
      type: String,
      required: true,
    },
    strings: {
      type: Map,
      of: String,
    },
    enables: {
      type: Map,
      of: Boolean,
    },
    unix_formats: {
      type: Map,
      of: String,
    },
  },
  schemaOptions,
);

export const TimeConfig = createModel('TimeConfig', TimeConfigSchema);
