const mongoose = require('mongoose');

const chatMessageSchema = new mongoose.Schema({
  roomId: String,
  userId: String,
  userName: String,
  avatar: String,
  message: String,
  timestamp: { type: Date, default: Date.now }
});

module.exports = mongoose.model('ChatMessage', chatMessageSchema);
