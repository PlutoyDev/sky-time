import mongoose from 'mongoose';
import autoPopulate from 'mongoose-autopopulate';

mongoose.plugin(autoPopulate);

const autoPopField = <T>(type: T, ref: string) => ({ type, ref, autopopulate: true });

const timestampMap = {
  createdAt: 'created_at',
  updatedAt: 'updated_at',
};

export { autoPopField, timestampMap };
