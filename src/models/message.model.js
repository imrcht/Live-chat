const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema(
  {
    message_id: String,
    chat_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Chat',
    },
    from: String,
    from_username: String,
    body: String,
  },
  {
    timestamps: true,
  }
);

const Message = mongoose.model('Message', messageSchema);
module.exports = Message;
