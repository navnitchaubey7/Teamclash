import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Navbar, Nav, Container, Button } from 'react-bootstrap';
import axios from 'axios';
import { FaBars } from 'react-icons/fa'; // 👈 hamburger icon
import { useDispatch } from 'react-redux';
import { toggleSidebar } from '../redux/sidebarSlice';

const TopNavbar = () => {
  const navigate = useNavigate();
  const [error, setError] = useState("");
  const [userName, setUserName] = useState("User");
    const dispatch = useDispatch();

  useEffect(() => {
    const fetchProfile = async () => {
      const token = localStorage.getItem("token");

      if (!token) {
        setError("Token missing. Please login.");
        return;
      }

      try {
        const res = await axios.get("http://localhost:5000/api/auth/navbar", {
          headers: {
            Authorization: token,
          },
        });
        setUserName(res.data.user.name);
      } catch (err) {
        console.error(err);
        setError("Access denied. Invalid token.");
      }
    };

    fetchProfile();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    sessionStorage.clear();
    navigate('/');
  };

  return (
    <Navbar bg="dark" variant="dark" className="px-3">
      <Container fluid>
        <Button
          variant="outline-light"
          className="me-2"
          onClick={() => dispatch(toggleSidebar())}
        >
          <FaBars />
        </Button>

        <Navbar.Brand href="/profile">TeamClash 🧠</Navbar.Brand>

        <Navbar.Collapse className="justify-content-end">
          <Nav>
            <Nav.Item className="text-white me-3 mt-2">
              Welcome, {userName} 👋
            </Nav.Item>
            <Button variant="outline-light" onClick={handleLogout}>
              Logout
            </Button>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default TopNavbar;
