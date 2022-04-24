import { Schema } from 'mongoose';
import { createModel, schemaOptions, Base } from './libs';

export enum MessageType {
  TIMESTAMP = 'timestamp',
  TIMESTAMP_RAW = 'timestamp_raw',
  TIMESTAMP_REPT = 'timestamp_rept',
  TIMESTAMP_REPT_RAW = 'timestamp_rept_raw',

  REMINDER = 'reminder',
  REMINDER_REPT = 'reminder_rept',

  CHANGELOG = 'changelog',
  ANNOUNCEMENT = 'announcement',
}

export interface IMessage extends Base {
  _id: string;
  type: string;
  webhook_id: string;
}

export const MessageSchema = new Schema<IMessage>(
  {
    _id: String,
    type: {
      type: String,
      required: true,
    },
    webhook_id: {
      type: String,
      required: true,
      ref: 'Webhook',
      autopopulate: true,
    },
  },
  schemaOptions,
);

export const Message = createModel('Message', MessageSchema);
