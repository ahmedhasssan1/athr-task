const mongoose = require("mongoose");
const chat = require("./chat");

const messageSchema = new mongoose.Schema({
  chat: {
    type: mongoose.Schema.Types.ObjectId,
    ref: chat,
  },
  content: {
    type: String,
    required: true,
  },
  from: {
    type: String, // socket.id or user ID
    required: true,
  },
  to: {
    type: String, // socket.id or user ID
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const Message = mongoose.model("Message", messageSchema);
module.exports = Message;
