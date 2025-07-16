// Sidebar.js
import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { hideSidebar, showCreatRoom, showEnterRoom } from '../redux/sidebarSlice';
import { Nav, Button } from 'react-bootstrap';
import { FaBars } from 'react-icons/fa'; // 👈 hamburger icon
import { toggleSidebar } from '../redux/sidebarSlice';
import { useNavigate } from 'react-router-dom';
import ChatBoxx from './ChatBoxx';
import Testing from '../pages/Testing';
import { useState } from 'react';

const Sidebar = () => {
  const isVisible = useSelector((state) => state.sidebar.isVisible);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [showChatBox, setShowChatBox] = useState(false);

  return (
    <div
      style={{
        height: '100vh',
        width: '220px',
        backgroundColor: '#343a40',
        color: 'white',
        paddingTop: '20px',
        position: 'fixed',
        left: isVisible ? 0 : '-220px',
        top: 0,
        transition: 'left 0.3s ease-in-out',
        zIndex: 1000,
      }}
    >
      <Button
        variant="outline-light"
        className="me-2"
        onClick={() => dispatch(toggleSidebar())}
      >
        <FaBars />
      </Button>
      <h4 className="text-center mb-4">🧠 TeamClash</h4>
      <Nav className="flex-column px-3">
        <Nav.Link className="text-white" onClick={() => dispatch(hideSidebar())}>🏠 Dashboard</Nav.Link>
        <Nav.Link className="text-white" onClick={() => dispatch(hideSidebar())}>📋 Tasks</Nav.Link>
        <Nav.Link className="text-white" onClick={() => dispatch(showCreatRoom())}>⚙️ Create Room</Nav.Link>
        <Nav.Link className="text-white" onClick={() => dispatch(showEnterRoom())}>🧩 Join Room</Nav.Link>
        <Nav.Link className="text-white" onClick={() => setShowChatBox(true)}>💬 Chat</Nav.Link>
        <Nav.Link className="text-white" onClick={() => dispatch(hideSidebar())}>⚙️ Settings</Nav.Link></Nav>
      {showChatBox && (
        <Testing showChatBox={showChatBox} setShowChatBox={setShowChatBox} />
      )}
    </div>
  );
};

export default Sidebar;
