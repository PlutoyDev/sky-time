import { Schema, model, models, Model, SchemaOptions } from 'mongoose';

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

export { timestamps, schemaOptions };
