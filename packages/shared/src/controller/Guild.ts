import { Guild, IGuild } from '../model';

//Guild

export const createGuild = (guild: IGuild) => {
  return Guild.create(guild);
};

export const getGuilds = (guild_ids: string | string[], lean = true) => {
  if (typeof guild_ids === 'string') {
    return Guild.findOne({ _id: guild_ids }, { lean }).exec();
  } else {
    return Guild.find({ _id: { $in: guild_ids } }, { lean }).exec();
  }
};

export const updateGuild = (guild: IGuild) => {
  return Guild.findByIdAndUpdate(guild._id, guild, { new: true }).lean().exec();
};

export const deleteGuild = (guild_id: string) => {
  return Guild.findByIdAndDelete(guild_id).lean().exec();
};

//Relations
export const getUserGuilds = (user_id: string, lean = true) => {
  return Guild.find({ user_ids: { $elemMatch: user_id } }, { lean }).exec();
};

export const getWebhookGuild = (webhook_id: string, lean = true) => {
  return Guild.findOne({ webhook_ids: { $elemMatch: webhook_id } }, { lean }).exec();
};

export const getTimeConfigGuild = (timeConfig_id: string, lean = true) => {
  return Guild.findOne({ timeConfig_ids: { $elemMatch: timeConfig_id } }, { lean }).exec();
};

export const getReminderConfigGuild = (reminder_id: string, lean = true) => {
  return Guild.findOne({ reminder_ids: { $elemMatch: reminder_id } }, { lean }).exec();
};
