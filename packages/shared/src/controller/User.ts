import { User, IUser } from '../model';

//User

export const createUser = (user: IUser) => {
  return User.create(user);
};

export const getUsers = (user_ids: string | string[], lean = true) => {
  if (typeof user_ids === 'string') {
    return User.findOne({ _id: user_ids }, { lean }).exec();
  } else {
    return User.find({ _id: { $in: user_ids } }, { lean }).exec();
  }
};

export const updateUser = (user: IUser) => {
  return User.findByIdAndUpdate(user._id, user, { new: true }).lean().exec();
};

export const deleteUser = (user_id: string) => {
  return User.findByIdAndDelete(user_id).lean().exec();
};

//Relations
export const getGuildUsers = (guild_id: string, lean = true) => {
  return User.find({ guild_ids: { $elemMatch: guild_id } }, { lean }).exec();
};
