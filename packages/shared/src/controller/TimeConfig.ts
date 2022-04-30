import { TimeConfig, ITimeConfig } from '../model';

// Time Config

export const createTimeConfig = (timeConfig: ITimeConfig) => {
  return TimeConfig.create(timeConfig);
};

export const getTimeConfig = (timeConfig_id: string, lean = true) => {
  return TimeConfig.findOne({ _id: timeConfig_id }, { lean }).exec();
};

export const getTimeConfigs = (timeConfig_ids: string | string[], lean = true) => {
  return TimeConfig.find({ _id: { $in: timeConfig_ids } }, { lean }).exec();
};

export const updateTimeConfig = (timeConfig: ITimeConfig) => {
  return TimeConfig.findByIdAndUpdate(timeConfig._id, timeConfig, { new: true }).lean().exec();
};

export const deleteTimeConfig = (timeConfig_id: string) => {
  return TimeConfig.findByIdAndDelete(timeConfig_id).lean().exec();
};

//Relations
export const getGuildTimeConfigs = (guild_id: string, lean = true) => {
  return TimeConfig.find({ guild_ids: { $elemMatch: guild_id } }, { lean }).exec();
};

export const getWebhookTimeConfig = (webhook_id: string, lean = true) => {
  return TimeConfig.findOne({ webhook_ids: { $elemMatch: webhook_id } }, { lean }).exec();
};
