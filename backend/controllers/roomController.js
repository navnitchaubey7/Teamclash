const Room = require('../models/Room');

exports.createRoom = async (req, res) => {
  const { roomName, roomPassword } = req.body;
  const userId = req.user.userId;

  try {
    const newRoom = new Room({
      roomName,
      roomPassword,
      createdBy: userId,
      is_room_admin: "1",
    });

    await newRoom.save();
    const room = await Room.findOne({ roomName });
    res.status(201).json({
      message: "Room created successfully!", status: "1", room: {
        _id: room._id,
        roomName: room.roomName,
        createdby: room.createdBy,
        is_room_admin: room.createdBy === userId ? "1" : "0"
      }
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error creating room.", status: "0" });
  }
};

exports.joinRoom = async (req, res) => {
  const { roomName, roomPassword, userId } = req.body;

  // ✅ Check if both fields are filled
  if (!roomName || !roomPassword) {
    return res.status(400).json({ message: 'Room name and password are required.' });
  }

  try {
    const room = await Room.findOne({ roomName });

    if (!room) {
      return res.status(404).json({ message: 'Room not found.' });
    }

    if (room.roomPassword !== roomPassword) {
      return res.status(401).json({ message: 'Incorrect room password.' });
    }

    //Send room._id in response
    res.status(200).json({
      message: 'Successfully joined the room!',
      room: {
        _id: room._id,
        roomName: room.roomName,
        createdby: room.createdBy,
        is_room_admin: room.createdBy === userId ? "1" : "0"
      }
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error while joining room.' });
  }
};
exports.getRoomInfo = async (req, res) => {
  const { id, roomPassword } = req.body;

  try {
    const room = await Room.findOne({ _id: id });

    if (!room) {
      return res.status(404).json({ message: 'Room not found' });
    }
    res.status(200).json({ room });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error while fetching room' });
  }
};
