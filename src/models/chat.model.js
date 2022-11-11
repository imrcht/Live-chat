const mongoose = require('mongoose');

const chatSchema = new mongoose.Schema(
  {
    chat_id: String,
    chat_room: String,
    user_email: String,
    username: String,
    socket_id: String,
    team_email: String,
    member_email: String,
    member_name: String,
    member_socket_id: String,
    team_id: String,
    messages: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Message',
      },
    ],
  },
  {
    timestamps: true,
  }
);

const Chat = mongoose.model('Chat', chatSchema);
module.exports = Chat;
