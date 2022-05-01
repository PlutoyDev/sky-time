import { Message, IMessage } from '../model/Message';
import { OptionalBase } from './lib';

export const createMessage = (message: OptionalBase<IMessage>) => {
  return Message.create(message);
};

export const getMessage = (message_id: string, lean = true) => {
  return Message.findOne({ _id: message_id }, null, { lean }).exec();
};

export const getMessages = (message_ids: string | string[], lean = true) => {
  return Message.find({ _id: { $in: message_ids } }, null, { lean }).exec();
};

export const updateMessage = (message: IMessage) => {
  return Message.findByIdAndUpdate(message._id, message, { new: true }).lean().exec();
};

export const deleteMessage = (message_id: string) => {
  return Message.findByIdAndDelete(message_id).lean().exec();
};

//Relations
export const getWebhookMessages = (webhook_id: string, lean = true) => {
  return Message.find({ webhook_ids: { $elemMatch: { $eq: webhook_id } } }, null, { lean }).exec();
};
