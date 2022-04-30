import { TimeConfig, ITimeConfig } from '../model';

// Time Config

export const createTimeConfig = (timeConfig: ITimeConfig) => {
  return TimeConfig.create(timeConfig);
};

export const getTimeConfigs = (timeConfig_ids: string | string[], lean = true) => {
  const filter = typeof timeConfig_ids === 'string' ? { _id: timeConfig_ids } : { _id: { $in: timeConfig_ids } };
  return TimeConfig.find(filter, { lean }).exec();
};

export const updateTimeConfig = (timeConfig: ITimeConfig) => {
  return TimeConfig.findByIdAndUpdate(timeConfig._id, timeConfig, { new: true }).lean().exec();
};

export const deleteTimeConfig = (timeConfig_id: string) => {
  return TimeConfig.findByIdAndDelete(timeConfig_id).lean().exec();
};
