// const Card = require('../models/Card');
// const Room = require('../models/Room');

// const handleCardCheck = (io, socket) => {
//   socket.on('card_checked', async ({ cardId, checked, roomId, userId }) => {
//     try {
//       const card = await Card.findById(cardId);
//       card.checked = checked;
//       await card.save();

//       const room = await Room.findById(roomId);
//       const player = room.players.find(p => p.userId === userId);
//       if (player) {
//         player.points += checked ? 10 : -10;
//         await room.save();
//       }

//       io.to(roomId).emit('card_check_updated', { cardId, checked, userId, points: player.points });
//     } catch (err) {
//       console.error('Error updating card check:', err);
//     }
//   });

//   socket.on('join_room', ({ roomId, userId }) => {
//     socket.join(roomId);
//     io.to(roomId).emit('online_status', { userId, online: true });
//   });

//   socket.on('disconnect', () => {
//   });
// };

// const handleCardEvents = (io, socket) => {
//   socket.on('card_added', ({ roomId, card }) => {
//     io.emit('card_added', { card });
//   });

//   // 🗑️ Card deleted
//   socket.on('card_deleted', ({ roomId, cardId }) => {
//     io.to(roomId).emit('card_deleted', { cardId });
//   });
// };

// module.exports = { handleCardCheck, handleCardEvents };

const Card = require('../models/Card');
const Room = require('../models/Room');
const User = require('../models/User')

// 🧠 Store online users per room
let onlineUsers = {}; // { roomId: { userId: true, ... }, ... }

const handleCardCheck = (io, socket) => {
  // ✅ Checkbox Toggle Logic
  socket.on('card_checked', async ({ cardId, checked, roomId, userId }) => {
    try {
      const card = await Card.findById(cardId);
      card.checked = checked;
      await card.save();

      const room = await Room.findById(roomId);
      const player = room.players.find(p => p.userId === userId);
      if (player) {
        player.points += checked ? 10 : -10;
        await room.save();
      }

      io.to(roomId).emit('card_check_updated', {
        cardId,
        checked,
        userId,
        points: player?.points || 0
      });
    } catch (err) {
      console.error('❌ Error updating card check:', err);
    }
  });
  socket.on('join_room', async ({ roomId, userId }) => {
    if (!roomId || !userId) return;

    socket.join(roomId);
    // socket.roomId = roomId;
    // socket.userId = userId;
    const user = await User.findById(userId).select('name'); // mongoose
    if (!user) return;
    if (!onlineUsers[roomId]) onlineUsers[roomId] = {};
    onlineUsers[roomId][userId] = user.name;

    const userList = Object.entries(onlineUsers[roomId]).map(([id, name]) => ({
      userId: id,
      name,
    }));

    io.to(roomId).emit('online_users', userList);
  });
  socket.on('disconnect', () => {
    const { roomId, userId } = socket;
    if (roomId && onlineUsers[roomId]) {
      delete onlineUsers[roomId][userId];

      const userList = Object.entries(onlineUsers[roomId]).map(([id, name]) => ({
        userId: id,
        name,
      }));

      io.to(roomId).emit('online_users', userList);
    }
  });


};

const handleCardEvents = (io, socket) => {
  // ✅ Broadcast when card added
  socket.on('card_added', ({ roomId, card }) => {
    io.to(roomId).emit('card_added', { card });
  });

  // ✅ Broadcast when card deleted
  socket.on('card_deleted', ({ roomId, cardId }) => {
    io.to(roomId).emit('card_deleted', { cardId });
  });
};

module.exports = {
  handleCardCheck,
  handleCardEvents
};
