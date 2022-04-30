import { User, IUser } from '../model';

//User

export const createUser = (user: IUser) => {
  return User.create(user);
};

export const getUsers = (user_ids: string | string[], lean = true) => {
  const filter = typeof user_ids === 'string' ? { _id: user_ids } : { _id: { $in: user_ids } };
  return User.find(filter, { lean }).exec();
};

export const updateUser = (user: IUser) => {
  return User.findByIdAndUpdate(user._id, user, { new: true }).lean().exec();
};

export const deleteUser = (user_id: string) => {
  return User.findByIdAndDelete(user_id).lean().exec();
};

// * maybe
//User's Guilds
// export const addUserGuild = (user_id: string, guild_ids: string | string[]) => {
//   const $addToSet = typeof guild_ids === 'string' ? { guild_ids: guild_ids } : { guild_ids: { $each: guild_ids } };
//   return User.findByIdAndUpdate(user_id, { $addToSet }, { new: true }).lean().exec();
// };

// export const removeUserGuild = (user_id: string, guild_ids: string | string[]) => {
//   const $pull = typeof guild_ids === 'string' ? { guild_ids: guild_ids } : { guild_ids: { $in: guild_ids } };
//   return User.findByIdAndUpdate(user_id, { $pull }, { new: true }).lean().exec();
// };
