import { TimeConfig, ITimeConfig } from '../model';
import { OptionalBase } from './lib';
// Time Config

export const createTimeConfig = (timeConfig: OptionalBase<ITimeConfig>) => {
  return TimeConfig.create(timeConfig);
};

export const getTimeConfig = (timeConfig_id: string, lean = true) => {
  return TimeConfig.findOne({ _id: timeConfig_id }, null, { lean }).exec();
};

export const getTimeConfigs = (timeConfig_ids: string | string[], lean = true) => {
  return TimeConfig.find({ _id: { $in: timeConfig_ids } }, null, { lean }).exec();
};

export const updateTimeConfig = (timeConfig: ITimeConfig) => {
  return TimeConfig.findByIdAndUpdate(timeConfig._id, timeConfig, { new: true }).lean().exec();
};

export const deleteTimeConfig = (timeConfig_id: string) => {
  return TimeConfig.findByIdAndDelete(timeConfig_id).lean().exec();
};

//Relations
export const getGuildTimeConfigs = (guild_id: string, lean = true) => {
  return TimeConfig.find({ guild_ids: { $elemMatch: { $eq: guild_id } } }, null, { lean }).exec();
};

export const getWebhookTimeConfig = (webhook_id: string, lean = true) => {
  return TimeConfig.findOne({ webhook_ids: { $elemMatch: { $eq: webhook_id } } }, null, { lean }).exec();
};
