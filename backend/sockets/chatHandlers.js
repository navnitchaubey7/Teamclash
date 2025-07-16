const ChatMessage = require('../models/ChatMessage');
const Message = require('../models/Message');

const handleChatSocket = (io, socket) => {
  socket.on('join_room', ({ roomId }) => {
    socket.join(roomId);
  });

  socket.on('chat_message', async ({ roomId, userId, userName, avatar, message }) => {
    const msg = new ChatMessage({ roomId, userId, userName, avatar, message });
    await msg.save();

    io.to(roomId).emit('new_chat_message', {
      roomId, userId, userName, avatar, message, timestamp: msg.timestamp
    });
  });
};

const handleChatEvents = (io, socket) => {
  socket.on('private_message', async ({ from, to, text }) => {
    const msg = new Message({ from, to, text });
    await msg.save();

    io.to(to).emit('private_message', { from, text, createdAt: msg.createdAt });
  });

  // Join personal room
  socket.on('join_user', ({ userId }) => {
    socket.join(userId); // Join user-specific room
  });
};

module.exports = { handleChatSocket ,handleChatEvents };
