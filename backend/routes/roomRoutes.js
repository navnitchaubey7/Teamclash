const express = require('express');
const router = express.Router();
const verifyToken = require('../middlewares/verifyToken');
const { createRoom , joinRoom ,getRoomInfo } = require('../controllers/roomController');

router.post('/create', verifyToken, createRoom);
router.post('/join', verifyToken, joinRoom);
router.post('/getroominfo', verifyToken, getRoomInfo);

module.exports = router;
