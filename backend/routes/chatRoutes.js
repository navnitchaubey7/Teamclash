const express = require('express');
const router = express.Router();
const ChatMessage = require('../models/ChatMessage');
router.get('/room/:roomId', async (req, res) => {
  try {
    const messages = await ChatMessage.find({ roomId: req.params.roomId}).sort({ timestamp: 1 });
    res.json({ success: true, messages });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

module.exports = router;