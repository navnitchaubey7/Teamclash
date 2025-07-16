import React, { useEffect, useState } from 'react';
import { Form, Button, ListGroup, Row, Col, InputGroup, Container, Nav } from 'react-bootstrap';
import axios from 'axios';
import { Socket } from '../socket';
import PendingRequests from './PendingRequests';
import EmojiPicker from 'emoji-picker-react';


const ChatBoxx = () => {
  const userId = sessionStorage.getItem("user_id")
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [friends, setFriends] = useState([]);
  const [selectedFriend, setSelectedFriend] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMsg, setNewMsg] = useState('');
  const [activeTab, setActiveTab] = useState("search");
  const [showStickerPicker, setShowStickerPicker] = useState(false);
  const [stickers, setStickers] = useState([]);
  // Join personal room
  useEffect(() => {
    Socket.emit('join_user', { userId });
    Socket.on('private_message', (msg) => {
      if (msg.from === selectedFriend?._id) {
        setMessages((prev) => [...prev, msg]);
      }
    });
    return () => Socket.off('private_message');
  }, [selectedFriend]);

  useEffect(() => {
    fetch('http://localhost:5000/api/stickers')
      .then(res => res.json())
      .then(data => setStickers(data));
    fetchFriends();
  }, []);

  const fetchFriends = async () => {
    const res = await axios.get(`http://localhost:5000/api/friends/friends/${userId}`);
    setFriends(res.data.friends);
  };

  const searchUsers = async () => {
    const res = await axios.get(`http://localhost:5000/api/friends/search/${searchTerm}`);
    setSearchResults(res.data);
  };

  const sendFriendRequest = async (toId) => {
    await axios.post('http://localhost:5000/api/friends/request', { from: userId, to: toId });
    alert('Friend request sent!');
  };

  const loadMessages = async (friendId) => {
    const res = await axios.get(`http://localhost:5000/api/messages/${userId}/${friendId}`);
    setMessages(res.data);
  };

  const sendMessage = async () => {
    if (!newMsg.trim() || !selectedFriend) return;
    Socket.emit('private_message', {
      from: userId,
      to: selectedFriend._id,
      text: newMsg,
    });
    setMessages((prev) => [...prev, { from: userId, text: newMsg, createdAt: new Date() }]);
    setNewMsg('');
  };
  return (
    <Container fluid className="playground-wrapper">
      <Row className="horizontal-menu bg-light py-2 px-4 border-bottom">
        <Nav variant="tabs" activeKey={activeTab} onSelect={(selectedKey) => setActiveTab(selectedKey)}>
          <Nav.Item>
            <Nav.Link eventKey="search">Search User</Nav.Link>
          </Nav.Item>
          <Nav.Item>
            <Nav.Link eventKey="pending">Pending Friend Request</Nav.Link>
          </Nav.Item>
          <Nav.Item>
            <Nav.Link eventKey="chat">💬 Chat</Nav.Link>
          </Nav.Item>
        </Nav>
      </Row>
      {/* 📦 Main Content Area */}
      <Row className="p-4">
        {activeTab === 'search' && (
          <>
            <Col md={12}>
              <div className="border p-4 rounded shadow-sm bg-dark h-100">
                <h6>🔍 Search Users</h6>
                <InputGroup>
                  <Form.Control
                    placeholder="Search user by name"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                  <Button onClick={searchUsers}>Search</Button>
                </InputGroup>
                <ListGroup className='mt-2'>
                  {searchResults.map((user) => (
                    <ListGroup.Item key={user._id}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <span>{user.name}</span>
                        <Button size="sm" onClick={() => sendFriendRequest(user._id)}>Add</Button>
                      </div>
                    </ListGroup.Item>

                  ))}
                </ListGroup>
              </div>
            </Col>
          </>
        )}

        {activeTab === 'pending' && (
          <Col>
            <div className="border p-4 rounded bg-dark shadow-sm">
              <h5>👥 Players Tab</h5>
              <PendingRequests userId={userId} />
            </div>
          </Col>
        )}
        {(activeTab === 'chat') ?
          <div className="border p-4 rounded bg-dark shadow-sm">
            <h6>👥 Your Friends</h6>
            <Row>
              <Col className='col-md-4 '>
                <ListGroup>
                  {friends.map((friend) => (
                    <ListGroup.Item className="document-box"
                      key={friend._id}
                      active={selectedFriend?._id === friend._id}
                      onClick={() => {
                        setSelectedFriend(friend);
                        loadMessages(friend._id);
                      }}
                    >
                      {friend.name}
                    </ListGroup.Item>
                  ))}
                </ListGroup>
              </Col>
              <Col className='col-md-8'>
                <div className="chat-box-container">
                  <div className="chat-messages">
                    {messages.map((msg, idx) => (
                      <div key={idx} className={`chat-bubble ${msg.from === userId ? 'chat-me' : 'chat-other'}`}>
                        <span>{msg.text}</span>
                      </div>
                    ))}
                  </div>
                  {/* <InputGroup className='mt-2'>
                    <Form.Control
                      placeholder='Type a message...'
                      value={newMsg}
                      onChange={(e) => setNewMsg(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
                    />
                    <Button onClick={sendMessage}>Send</Button>
                  </InputGroup>
                   */}
                  <InputGroup className='mt-2'>
                    {stickers.map(sticker => (
                      <img
                        key={sticker.id}
                        src={sticker.url}
                        width={60}
                        style={{ margin: 5, cursor: 'pointer' }}
                        onClick={() => {
                          setNewMsg(prev => prev + ' ' + sticker.url);
                          setShowStickerPicker(false);
                        }}
                      />
                    ))}
                    <Form.Control
                      placeholder='Type a message...'
                      value={newMsg}
                      onChange={(e) => setNewMsg(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
                    />

                    {/* Sticker Picker Button */}
                    <Button variant="light" onClick={() => setShowStickerPicker(!showStickerPicker)}>😄</Button>

                    <Button onClick={sendMessage}>Send</Button>
                  </InputGroup>

                  {/* Sticker Picker */}
                  {showStickerPicker && (
                    <div style={{ position: 'absolute', bottom: '60px', right: '20px', zIndex: 999 }}>
                      <EmojiPicker onEmojiClick={(emojiData) => {
                        // If it's a sticker, add image tag or URL
                        const stickerUrl = emojiData.imageUrl || emojiData.emoji; // fallback for emoji
                        setNewMsg(prev => prev + ' ' + stickerUrl); // you can make this smarter
                        setShowStickerPicker(false);
                      }} />
                    </div>
                  )}
                </div>
              </Col>
            </Row>
          </div>
          : null}
      </Row>
    </Container>
  );
};

export default ChatBoxx;