const express = require('express');
const router = express.Router();
const FriendRequest = require('../models/FriendRequest');
const User = require('../models/User');

// Search user
router.get('/search/:query', async (req, res) => {
  const query = req.params.query;
  console.log(query);
  const users = await User.find({ name: new RegExp(query, 'i') }).limit(5);
  res.json(users);
});

// Send request
router.post('/request', async (req, res) => {
  const { from, to } = req.body;
  const exists = await FriendRequest.findOne({ from, to });
  if (exists) return res.status(400).json({ msg: 'Request already sent' });
  const fr = new FriendRequest({ from, to });
  await fr.save();
  res.json({ success: true });
});
// Get all pending requests for a user
router.get('/requests/:userId', async (req, res) => {
  try {
    const requests = await FriendRequest.find({
      to: req.params.userId,
      status: 'pending'
    }).populate('from', 'username email'); // Populate request sender info

    res.json({ requests });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Accept request
router.post('/accept', async (req, res) => {
  const { from, to } = req.body;
  await FriendRequest.findOneAndUpdate({ from, to }, { status: 'accepted' });
  res.json({ success: true });
});
router.get('/friends/:userId', async (req, res) => {
  const requests = await FriendRequest.find({
    $or: [
      { from: req.params.userId },
      { to: req.params.userId }
    ],
    status: 'accepted'
  }).populate('from to');

  const friends = requests.map(r => {
    const isMeSender = r.from._id.toString() === req.params.userId;
    return isMeSender ? r.to : r.from;
  });

  res.json({ friends });
});

// Accept friend request
router.patch('/accept/:requestId', async (req, res) => {
  try {
    const request = await FriendRequest.findById(req.params.requestId);
    if (!request) return res.status(404).json({ msg: 'Request not found' });

    request.status = 'accepted';
    await request.save();

    res.json({ success: true, message: 'Friend request accepted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
