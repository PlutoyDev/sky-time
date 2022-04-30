import { Guild, IGuild } from '../model';

//Guild

export const createGuild = (guild: IGuild) => {
  return Guild.create(guild);
};

export const getGuilds = (guild_ids: string | string[], lean = true) => {
  const filter = typeof guild_ids === 'string' ? { _id: guild_ids } : { _id: { $in: guild_ids } };
  return Guild.find(filter, { lean }).exec();
};

export const updateGuild = (guild: IGuild) => {
  return Guild.findByIdAndUpdate(guild._id, guild, { new: true }).lean().exec();
};

export const deleteGuild = (guild_id: string) => {
  return Guild.findByIdAndDelete(guild_id).lean().exec();
};

//* Maybe
//Guild's Users

// export const addGuildUser = (guild_id: string, user_ids: string | string[]) => {
//   const update =
//     typeof user_ids === 'string'
//       ? { $addToSet: { user_ids: user_ids } }
//       : { $addToSet: { user_ids: { $each: user_ids } } };
//   return Guild.findByIdAndUpdate(guild_id, update, { new: true }).lean().exec();
// };

// export const removeGuildUser = (guild_id: string, user_ids: string | string[]) => {
//   const update =
//     typeof user_ids === 'string' ? { $pull: { user_ids: user_ids } } : { $pull: { user_ids: { $each: user_ids } } };
//   return Guild.findByIdAndUpdate(guild_id, update, { new: true }).lean().exec();
// };

//Guild's Webhooks

// export const addGuildWebhook = (guild_id: string, webhook_ids: string | string[]) => {
//   const update =
//     typeof webhook_ids === 'string'
//       ? { $addToSet: { webhook_ids: webhook_ids } }
//       : { $addToSet: { webhook_ids: { $each: webhook_ids } } };

//   return Guild.findByIdAndUpdate(guild_id, update, { new: true }).lean().exec();
// };

// export const removeGuildWebhook = (guild_id: string, webhook_ids: string | string[]) => {
//   const update =
//     typeof webhook_ids === 'string'
//       ? { $pull: { webhook_ids: webhook_ids } }
//       : { $pull: { webhook_ids: { $each: webhook_ids } } };
//   return Guild.findByIdAndUpdate(guild_id, update, { new: true }).lean().exec();
// };
