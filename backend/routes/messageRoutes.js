const express = require('express');
const router = express.Router();
const Message = require('../models/Message');

// Get chat between 2 users
router.get('/:user1/:user2', async (req, res) => {
  const { user1, user2 } = req.params;
  const messages = await Message.find({
    $or: [
      { from: user1, to: user2 },
      { from: user2, to: user1 }
    ]
  }).sort({ createdAt: 1 });
  res.json(messages);
});

module.exports = router;
