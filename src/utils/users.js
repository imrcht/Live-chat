const users = [];
const Chat = require('../models/chat.model');
const Tech = require('../models/tech.model');
const Message = require('../models/message.model');
const { nanoid } = require('nanoid');

// Join user to chat
async function userJoin(id, username, user_id, room, tech) {
  const user = { id, username, user_id, room, tech };

  if (room) {
    let chat = await Chat.findOne({ chat_room: room });

    if (!chat) {
      chat = await Chat.create({
        chat_id: nanoid(),
        chat_room: room,
        current_members: 1,
        username: username,
        socket_id: id,
      });
    } else {
      await Chat.findOneAndUpdate(
        { chat_room: room },
        { member_name: username, member_socket_id: id }
      );
    }

    console.log(chat);
  } else if (tech) {
    let techname = await Tech.findOne({ tech: tech });

    if (!techname) {
      techname = await Tech.create({
        tech_id: nanoid(),
        tech: tech,
        current_members: 1,
        username: username,
        socket_id: id,
      });
    } else {
      await Tech.findOneAndUpdate(
        { tech: tech },
        { member_name: username, member_socket_id: id }
      );
    }
  }

  users.push(user);

  return user;
}

// Get current user
function getCurrentUser(id) {
  return users.find((user) => user.id === id);
}

// User leaves chat
async function userLeave(id) {
  const index = users.findIndex((user) => user.id === id);

  // const room = users[index].room;

  // const chat = await Chat.findOne({ chat_room: room });
  // await Chat.deleteOne({ chat_room: room });
  // await Message.deleteMany({ chat_id: chat._id });

  if (index !== -1) {
    return users.splice(index, 1)[0];
  }
}

// Get room users
function getRoomUsers(room) {
  return users.filter((user) => user.room === room);
}

// Get tech users
function getTechUsers(tech) {
  return users.filter((user) => user.tech === tech);
}

// Get tech names
async function getTechNames(req, res) {
  const techNames = await Tech.find();

  return res.status(200).json({
    techNames,
  });
}

module.exports = {
  userJoin,
  getCurrentUser,
  userLeave,
  getRoomUsers,
  getTechUsers,
  getTechNames,
};
