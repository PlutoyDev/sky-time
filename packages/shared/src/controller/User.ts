import { User, IUser } from '../model';
import { OptionalBase } from './lib';

//User

export const createUser = (user: OptionalBase<IUser>) => {
  return User.create(user);
};

export const getUser = (user_id: string, lean = true) => {
  return User.findOne({ _id: user_id }, null, { lean }).exec();
};

export const getUsers = (user_ids: string[], lean = true) => {
  return User.find({ _id: { $in: user_ids } }, null, { lean }).exec();
};

export const updateUser = (user: IUser) => {
  return User.findByIdAndUpdate(user._id, user, { new: true }).lean().exec();
};

export const deleteUser = (user_id: string) => {
  return User.findByIdAndDelete(user_id).lean().exec();
};

//Relations
export const getGuildUsers = (guild_id: string, lean = true) => {
  return User.find({ guild_ids: { $elemMatch: { $eq: guild_id } } }, null, { lean }).exec();
};
