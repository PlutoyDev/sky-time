import { Guild, IGuild } from '../model';
import { Optional, OptionalBase } from './lib';

//Guild

type TGuildInput = Optional<
  IGuild,
  'created_at' | 'updated_at' | 'user_ids' | 'webhook_ids' | 'time_config_ids' | 'reminder_config_ids'
>;

export const createGuild = (guild: TGuildInput) => {
  return Guild.create(guild);
};

export const getGuild = (guild_id: string, lean = true) => {
  return Guild.findOne({ _id: guild_id }, null, { lean }).exec();
};

export const getGuilds = (guild_ids: string | string[], lean = true) => {
  return Guild.find({ _id: { $in: guild_ids } }, null, { lean }).exec();
};

export const updateGuild = (guild: IGuild) => {
  return Guild.findByIdAndUpdate(guild._id, guild, { new: true }).lean().exec();
};

export const deleteGuild = (guild_id: string) => {
  return Guild.findByIdAndDelete(guild_id).lean().exec();
};

//Patchable (Any user can edit)

type PatchableGuild = Pick<IGuild, '_id' | 'name' | 'icon'>;

export const patchGuild = (guild: PatchableGuild) => {
  return Guild.findByIdAndUpdate(guild._id, guild, { new: true }).lean().exec();
};

//Relations
export const getUserGuilds = (user_id: string, lean = true) => {
  return Guild.find({ user_ids: { $elemMatch: { $eq: user_id } } }, null, { lean }).exec();
};

export const getWebhookGuild = (webhook_id: string, lean = true) => {
  return Guild.findOne({ webhook_ids: { $elemMatch: { $eq: webhook_id } } }, null, { lean }).exec();
};

export const getTimeConfigGuild = (timeConfig_id: string, lean = true) => {
  return Guild.findOne({ timeConfig_ids: { $elemMatch: { $eq: timeConfig_id } } }, null, { lean }).exec();
};

export const getReminderConfigGuild = (reminder_id: string, lean = true) => {
  return Guild.findOne({ reminder_ids: { $elemMatch: { $eq: reminder_id } } }, null, { lean }).exec();
};
