// src/pages/Playground.js
import React, { useEffect, useState, Suspense } from 'react';
import { useNavigate } from 'react-router-dom';
import { Container, Row, Col, Button, Nav } from 'react-bootstrap';
import axios from 'axios';
import CheckpointSlider from '../components/CheckpointSlider';
import GameBoard from '../components/GameBoard';
import ChatBox from '../components/ChatBox';
import { Socket } from '../socket';
import OnlineUsersDropdown from '../components/OnlineUsers';
import { useLocation } from 'react-router-dom';
import ChatBoxx from '../components/ChatBoxx';
const Loader = () => {
    return (
        <div style={{ textAlign: 'center', marginTop: '50px' }}>
            <h3>⏳ Loading...(Example of Lazy Effect)</h3>
        </div>
    );
};
const Playground = () => {
    const navigate = useNavigate();
    const userName = sessionStorage.getItem("user_name")
    const [activeTab, setActiveTab] = useState("board");
    const userId = sessionStorage.getItem("user_id");
    const roomId = sessionStorage.getItem("room_id");
    const [onlineUsers, setOnlineUsers] = useState([]);
    const location = useLocation();
    const isAdmin = location.state?.isAdmin;
    const token = localStorage.getItem('token');
    const room_id = sessionStorage.getItem("room_id");

    //*****************************************************************************LAZY EFFECT ************************** */
    // const GameBoard = React.lazy(() => import('../components/GameBoard'));
    // const [showGameBoard, setShowGameBoard] = useState(false);
    //********************************************************************************************************************** */
    useEffect(() => {
        const fetchRoomInfo = async () => {
            try {
                const res = await axios.post(
                    'http://localhost:5000/api/rooms/getroominfo', { id: room_id }, { headers: { Authorization: token } })

                console.log("Room Info:", res.data.room);
            } catch (err) {
                console.error("Room fetch failed", err);
            }
        };

        fetchRoomInfo();
        Socket.emit('join_room', { roomId, userId });
        Socket.on('online_users', (users) => {
            setOnlineUsers(users);
        });
        //*****************************************************************************LAZY EFFECT ************************** */
        // const timer = setTimeout(() => {
        //     setShowGameBoard(true);
        // }, 4000);
        //******************************************************************************************************************* */
        return () => {
            // clearTimeout(timer)
            Socket.off('online_users'); // cleanup
        };
    }, [roomId]);


    return (
        <Container fluid className="playground-wrapper">
            <Row className="top-nav py-3 px-4 bg-dark text-white d-flex justify-content-between align-items-center">
                <Col className='col-md-6'>
                    <h4>🧠 TeamClash – Room: {roomId}</h4>
                </Col>
                <Col className='col-md-3'>
                    <OnlineUsersDropdown users={onlineUsers} />
                </Col>
                <Col className="text-end">
                    <span className="me-3">Welcome, {userName} 👋</span>
                    <Button variant="outline-light" size="sm" onClick={() => navigate('/profile')}>
                        Exit Room
                    </Button>
                </Col>
            </Row>

            {/* 🔄 Horizontal Menu (rights-based) */}
            <Row className="horizontal-menu bg-light py-2 px-4 border-bottom">
                <Nav variant="tabs" activeKey={activeTab} onSelect={(selectedKey) => setActiveTab(selectedKey)}>
                    <Nav.Item>
                        <Nav.Link eventKey="board">🎮 Game Board</Nav.Link>
                    </Nav.Item>
                    <Nav.Item>
                        <Nav.Link eventKey="players">👥 Players</Nav.Link>
                    </Nav.Item>
                    <Nav.Item>
                        <Nav.Link eventKey="chat">💬 Chat</Nav.Link>
                    </Nav.Item>
                    {(isAdmin === "1") && (
                        <Nav.Item>
                            <Nav.Link eventKey="admin">🔐 Admin Panel</Nav.Link>
                        </Nav.Item>
                    )}
                </Nav>
            </Row>
            {/* 📦 Main Content Area */}
            <Row className="p-4">
                {activeTab === 'board' && (
                    <>
                        <Col md={12}>
                            <div className="border p-4 rounded shadow-sm bg-dark h-100">
                                <GameBoard />
                                {/* *****************************************************************************LAZY EFFECT **************************  */}
                                {/* <Suspense fallback={<Loader />}>
                                    {showGameBoard ? <GameBoard /> : <Loader />}
                                </Suspense> */}
                                {/* ************************************************************************************************************************** */}
                            </div>
                        </Col>
                    </> 
                )}

                {activeTab === 'players' && (
                    <Col>
                        <div className="border p-4 rounded bg-dark shadow-sm">
                            <h5>👥 Players Tab</h5>
                            <p>List of joined players, avatars, and roles.</p>
                        </div>
                    </Col>
                )}

                {activeTab === 'chat' && (
                    <Col>
                        <div className="border p-4 rounded bg-dark shadow-sm">
                            <h5>💬 Chat Room</h5>
                            <p>Real-time chat system with send/receive.</p>
                            <ChatBox roomId={roomId} userName={userName} userId={userId} />
                        </div>
                    </Col>
                )}
                {(activeTab === 'admin' && isAdmin === "1") ?
                    <Col>
                        <div className="border p-4 rounded bg-dark shadow-sm">
                            <h5>🔐 Admin Panel</h5>
                            <p>Only visible to room creator. Manage users, room name, etc.</p>
                        </div>
                    </Col> : null}
            </Row>
        </Container>
    );
};

export default Playground;
