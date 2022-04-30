import { Message, IMessage } from '../model/Message';

export const createMessage = (message: IMessage) => {
  return Message.create(message);
};

export const getMessages = (message_ids: string | string[], lean = true) => {
  if (typeof message_ids === 'string') {
    return Message.findOne({ _id: message_ids }, { lean }).exec();
  } else {
    return Message.find({ _id: { $in: message_ids } }, { lean }).exec();
  }
};

export const updateMessage = (message: IMessage) => {
  return Message.findByIdAndUpdate(message._id, message, { new: true }).lean().exec();
};

export const deleteMessage = (message_id: string) => {
  return Message.findByIdAndDelete(message_id).lean().exec();
};

//Relations
export const getWebhookMessages = (webhook_id: string, lean = true) => {
  return Message.find({ webhook_ids: { $elemMatch: webhook_id } }, { lean }).exec();
};
