// src/pages/CreateRoom.js
import React, { useState } from 'react';
import axios from 'axios';
import { Badge, Button, Col, Container, Form, Modal, Row, Tab, Table, Tabs } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';

const CreateRoom = () => {
  const navigate = useNavigate();
  const [roomName, setRoomName] = useState("");
  const [roomPassword, setRoomPassword] = useState("");
  const handleCreateRoom = async () => {
    try {
      const token = localStorage.getItem("token");

      const res = await axios.post(
        "http://localhost:5000/api/rooms/create",
        {
          roomName,
          roomPassword,
        },
        {
          headers: { Authorization: token },
        }
      );

      alert(res.data.message);
      if(res.data.status==="1"){
        sessionStorage.setItem("roomname", roomName);
        sessionStorage.setItem("room_id", res.data.room._id);
        sessionStorage.setItem("room_created_by", res.data.room.createdby);
        navigate(`/playground`, { state: { isAdmin: res.data.room.is_room_admin } });
      }
      
    } catch (err) {
      console.error(err);
      alert("Failed to create room.");
    }
  };

  return (
    <Container className="content-inside">
      <h2 style={{ backgroundColor: "yellow" }}>Create a New Room</h2>

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
        placeholder="Room Password (optional)"
        value={roomPassword}
        onChange={(e) => setRoomPassword(e.target.value)}
      />
      <button className="btn btn-primary my-2" onClick={handleCreateRoom}>Create Room</button>
    </Container>
  );
};

export default CreateRoom;
