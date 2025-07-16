// src/pages/JoinRoom.js
import React, { useState } from 'react';
import axios from 'axios';
import { Badge, Button, Col, Container, Form, Modal, Row, Tab, Table, Tabs } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';

const JoinRoom = () => {
  const navigate = useNavigate();
  const [roomName, setRoomName] = useState('');
  const [roomPassword, setRoomPassword] = useState('');

  const handleJoinRoom = async () => {
    if (!roomName || !roomPassword) {
      alert("Room name and password are required.");
      return;
    }

    try {
      const token = localStorage.getItem('token');

      const res = await axios.post('http://localhost:5000/api/rooms/join', { roomName, roomPassword, userId: sessionStorage.getItem("user_id") }, { headers: { Authorization: token } });
      alert(res.data.message);
      sessionStorage.setItem("roomname", roomName);
      sessionStorage.setItem("room_id", res.data.room._id);
      sessionStorage.setItem("room_created_by", res.data.room.createdby);
      navigate(`/playground`, { state: { isAdmin: res.data.room.is_room_admin } });

    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || 'Failed to join room.');
    }
  };

  return (
    <Container className="content-inside">
      <h2>🔐 Join Room (Password Required)</h2>
      <input
        type="text"
        className="form-control my-2"
        placeholder="Room Name"
        value={roomName}
        onChange={(e) => setRoomName(e.target.value)}
      />
      <input
        type="password"
        className="form-control my-2"
        placeholder="Room Password"
        value={roomPassword}
        onChange={(e) => setRoomPassword(e.target.value)}
      />
      <button className="btn btn-success mt-2" onClick={handleJoinRoom}>
        Join Room
      </button>
    </Container>
  );
};

export default JoinRoom;
