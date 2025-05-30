const mongoose = require('mongoose');

const chatSchema = new mongoose.Schema(
  {
    isGroupChat: {
      type: Boolean,
      default: false,
    },
    name: {
      type: String, // Optional for group chats
    },
    users: [
      {
        type: String, 
        required: true,
      },
    ],
  },
  { timestamps: true }
);

module.exports = mongoose.model('Chat', chatSchema);


