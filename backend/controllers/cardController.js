// In controllers/cardController.js
const Card = require('../models/Card');

const updateDescription = async (req, res) => {
  try {
    const card = await Card.findById(req.params.cardId);
    if (!card) return res.status(404).json({ error: "Card not found" });

    card.description = req.body.description || '';
    await card.save();

    res.json({ success: true, card });
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
};

module.exports = { updateDescription };
