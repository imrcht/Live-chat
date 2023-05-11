const Chat = require('../models/chat.model');
const Tech = require('../models/tech.model');
const Message = require('../models/message.model');
const { nanoid } = require('nanoid');

async function incrementChannelMembers({ room, tech }) {
  if (room) {
    const chatRoom = await Chat.findOne({ chat_room: room });

    chatRoom.current_members += 1;
    await chatRoom.save();
  } else if (tech) {
    const techRoom = await Tech.findOne({ tech: tech });

    techRoom.current_members += 1;
    await techRoom.save();
  }

  return { data: 'Success', error: '' };
}

async function decrementChannelMembers({ room, tech }) {
  if (room) {
    const chatRoom = await Chat.findOne({ chat_room: room });

    chatRoom.current_members -= 1;
    await chatRoom.save();
  } else if (tech) {
    const techRoom = await Tech.findOne({ tech: tech });

    techRoom.current_members -= 1;
    await techRoom.save();
  }

  return { data: 'Success', error: '' };
}

module.exports = { incrementChannelMembers, decrementChannelMembers };
