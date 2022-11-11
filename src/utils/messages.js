const moment = require('moment');
const { nanoid } = require('nanoid');
const Chat = require('../models/chat.model');
const Message = require('../models/message.model');

function formatMessage(username, text) {
  return {
    username,
    text,
    time: moment().format('h:mm a'),
  };
}

async function addMessage(room, username, text) {
  const chat = await Chat.findOne({ chat_room: room });

  const message = await Message.create({
    message_id: nanoid(),
    chat_id: chat._id,
    from_username: username,
    body: text,
  });

  chat.messages.push(message._id);
  await chat.save();

  return message;
}

async function getMessages(room) {
  const chat = await Chat.findOne({ chat_room: room }).populate('messages');

  // const messages = chat.messages.map((message) => {
  //   return {message.body};
  // });

  return chat.messages;
}

module.exports = {
  formatMessage,
  addMessage,
  getMessages,
};
