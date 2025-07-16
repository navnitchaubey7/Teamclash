const express = require('express');
const router = express.Router();
const Card = require('../models/Card');
const Room = require('../models/Room'); 
const {updateDescription} = require('../controllers/cardController');

// POST /api/cards/addcard
router.post('/addcard', async (req, res) => {
  const { text, roomId, userId } = req.body;
  try {
    const room = await Room.findOne({ _id: roomId });
    const newCard = new Card({ text, roomId, checked: false, createdBy: room.createdBy });
    await newCard.save();
    res.json({ success: true, card: newCard });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});
router.patch('/update-description/:cardId', updateDescription);

// DELETE /api/cards/deletecard/:id
router.delete('/deletecard/:id', async (req, res) => {
  try {
    await Card.findByIdAndDelete(req.params.id);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});
router.put('/update/:id', async (req, res) => {
  try {
    const { status } = req.body;
    const updatedCard = await Card.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );
    res.json({ success: true, card: updatedCard });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});
router.get('/room/:roomId', async (req, res) => {
  const { roomId } = req.params;
  try {
    const room = await Room.findOne({ _id: roomId });
    if (!room) {
      return res.status(404).json({ message: 'Room not found' });
    }
    const cards = await Card.find({ roomId: roomId });
    res.status(200).json({ cards });
  } catch (err) {
    console.error('Error fetching cards:', err);
    res.status(500).json({ message: 'Server error' });
  }
});




module.exports = router;
