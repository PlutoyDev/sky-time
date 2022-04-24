import { plugin, Schema, model, models, Model, Types } from 'mongoose';
import autoPopulate from 'mongoose-autopopulate';

plugin(autoPopulate);

const autoPopField = <T>(type: T, ref: string, required = false) => ({ type, ref, required, autopopulate: true });

const timestamps = {
  createdAt: 'created_at',
  updatedAt: 'updated_at',
};

const schemaOptions = {
  timestamps,
};

export type Base = {
  created_at: Date;
  updated_at: Date;
};

export function createModel<TSchema extends Schema<any>, TData = TSchema extends Schema<infer IData> ? IData : never>(
  name: string,
  schema: TSchema,
): Model<TData> {
  return models[name] ?? model(name, schema);
}

export { autoPopField, timestamps, schemaOptions };
