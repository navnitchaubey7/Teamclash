import React, { useState } from 'react';
import axios from 'axios';
import { Row, Col, Container, Button, Form } from 'react-bootstrap';
import '../mcss/Home.css';
import $ from "jquery";
import { useNavigate } from 'react-router-dom';
import * as Common from "../components/Common";

function LoginPage() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: '', password: '' });
  const [scrMode, setScrMode] = useState("");
  const [forgetEmail, setForgetEmail] = useState("");
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState("");

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    const obj = {
      email: email,
      password: password
    }
    $(".loader").show();
    try {
      const res = await axios.post(Common.apiLoginPath, obj);
      alert("Login Success ✅");
      navigate("/profile");
      localStorage.setItem("token", res.data.token);
    } catch (err) {
      alert(err.response?.data?.message || 'Login failed ❌');
    }
    $(".loader").hide();
  };
  const handleforgetPassword = () => {
    setScrMode("forget-password");
  }
  const handleBackButton = (previousmode) => {
    setScrMode(previousmode);
  }
  const handleForgetSubmit = () => {

  }

  return (
    <div>
      <Container>
        {scrMode === "" ?
          <div className="login-box">
            <Row className="justify-content-center mb-3">
              <Col md={6} className="text-center">
                <h2>Login</h2>
              </Col>
            </Row>
            <Row className="justify-content-center mb-3">
              <Col md={6}>
                <input name="email" type="email" placeholder="Email" onChange={(e) => setEmail(e.target.value)} value={email}
                  required className="form-control"
                />
              </Col>
            </Row>

            <Row className="justify-content-center mb-3">
              <Col md={6}>
                <input
                  name="password"
                  type="password"
                  placeholder="Password"
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="form-control"
                />
              </Col>
            </Row>
            <Row md={6} className="justify-content-center text-center">
              <button onClick={() => handleSubmit()} className="btn btn-primary me-3">Login</button>
              <Button className='btn btn-primary' size='sm' onClick={() => handleforgetPassword()}>Forget Password</Button>
            </Row>
          </div>
          : null}
        {scrMode === "forget-password" &&
          <div className="login-box">
            <Row className="justify-content-center mb-3">
              <Col md={6} className="text-center">
                <h2>Login</h2>
              </Col>
            </Row>
            <Row className="justify-content-center mb-3">
              <Col md={6}>
                <input name="f_email" type="email" placeholder="Enter your registered email" onChange={handleChange} required className="form-control" />
              </Col>
            </Row>
            <Row md={6} className="justify-content-center text-center">
              <button onClick={() => handleBackButton("")} className="btn btn-primary me-3">Back</button>
              <Button className='btn btn-primary' size='sm' onClick={() => handleForgetSubmit()}>Submit</Button>
            </Row>
          </div>}
      </Container>

    </div>
  );
}

export default LoginPage;



/*
import React from 'react';
import { Nav } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';

const Sidebar = ({ isVisible }) => {
  const navigate = useNavigate();

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
      <h4 className="text-center mb-4">🧠 TeamClash</h4>

      <Nav className="flex-column px-3">
        <Nav.Link onClick={() => navigate('/dashboard')} className="text-white">🏠 Dashboard</Nav.Link>
        <Nav.Link onClick={() => navigate('/tasks')} className="text-white">📋 Tasks</Nav.Link>
        <Nav.Link onClick={() => navigate('/create-room')} className="text-white">⚙️ Create Room</Nav.Link>
        <Nav.Link onClick={() => navigate('/join-room')} className="text-white">🧩 Join Room</Nav.Link>
        <Nav.Link onClick={() => navigate('/chat')} className="text-white">💬 Chat</Nav.Link>
        <Nav.Link onClick={() => navigate('/settings')} className="text-white">⚙️ Settings</Nav.Link>
      </Nav>
    </div>
  );
};

export default Sidebar;
*/



{/* <div
  style={{
    position: 'fixed',
    top: '60px',
    right: '20px',
    width: '20vw',
    height: '9vh',
    minWidth: '200px',
    borderRadius: '12px',
    overflow: 'hidden',
    boxShadow: '0 4px 12px rgba(199, 42, 42, 0.2)',
    zIndex: 9999,
  }}
>
  <div
    style={{
      position: 'absolute',
      top: 0,
      left: 0,
      width: '100%',
      height: '100%',
      backgroundImage: `url('/img/battleground.jpg')`,
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      filter: 'blur(6px) brightness(60%)',
      zIndex: 1,
    }}
  />

  <div
    style={{
      position: 'relative',
      zIndex: 2,
      padding: '10px',
      color: '#fff',
    }}
  >
    <CheckpointSlider totalSteps={8} currentStep={step} />
  </div>
</div> */}


//***********************************************************************************************CHATBOX  */
// return (
//   <Row>
//     <Col md={4}>
//       <h6>🔍 Search Users</h6>
//       <InputGroup>
//         <Form.Control
//           placeholder="Search user by name"
//           value={searchTerm}
//           onChange={(e) => setSearchTerm(e.target.value)}
//         />
//         <Button onClick={searchUsers}>Search</Button>
//       </InputGroup>
//       <PendingRequests userId={userId} />
//       <ListGroup className='mt-2'>
//         {searchResults.map((user) => (
//           <ListGroup.Item key={user._id}>
//             {user.username} <Button size='sm' onClick={() => sendFriendRequest(user._id)}>➕ Add</Button>
//           </ListGroup.Item>
//         ))}
//       </ListGroup>

//       <h6 className='mt-4'>👥 Your Friends</h6>
//       <ListGroup>
//         {friends.map((friend) => (
//           <ListGroup.Item
//             key={friend._id}
//             active={selectedFriend?._id === friend._id}
//             onClick={() => {
//               setSelectedFriend(friend);
//               loadMessages(friend._id);
//             }}
//           >
//             {friend.name}
//           </ListGroup.Item>
//         ))}
//       </ListGroup>
//     </Col>

//     <Col md={8}>
//       <div className='chat-window bg-light p-3 rounded' style={{ height: '400px', overflowY: 'scroll' }}>
//         {messages.map((msg, idx) => (
//           <div key={idx} className={`mb-2 ${msg.from === userId ? 'text-end' : 'text-start'}`}>
//             <span className='px-2 py-1 rounded bg-secondary text-white'>{msg.text}</span>
//           </div>
//         ))}
//       </div>
//       <InputGroup className='mt-2'>
//         <Form.Control
//           placeholder='Type a message...'
//           value={newMsg}
//           onChange={(e) => setNewMsg(e.target.value)}
//           onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
//         />
//         <Button onClick={sendMessage}>Send</Button>
//       </InputGroup>
//     </Col>
//   </Row>
// );
