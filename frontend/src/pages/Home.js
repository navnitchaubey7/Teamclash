import React from 'react';
import { useState } from 'react';
import { Badge, Button, Col, Container, Form, Modal, Row, Tab, Table, Tabs } from 'react-bootstrap';
import '../mcss/Home.css';
import LoginPage from './LoginPage';
import RegisterPage from './RegisterPage'
import Footer from '../components/Footer';

const Home = () => {
    const [showLogin, setShowLogin] = useState(false);
    const [showRegister, setShowRegister] = useState(false);
    const handleShowLogin = () => {
        setShowRegister(false);
        setShowLogin(!showLogin)
    }
    const handleShowRegister = () => {
        setShowLogin(false);
        setShowRegister(!showRegister)
    }
    return (
        <>
            <div className="bg-wrapper">
                <Container className="content-inside">
                    <Row>
                        <h2 className="home_header display-5 fw-bold text-center">
                            Welcome to Teamclash
                        </h2>
                        <p className="lead text-center tagline">Plan. Chat. Execute.</p>

                    </Row>
                    <Row className="justify-content-end">
                        <Button className="show_login_button" onClick={handleShowLogin}>Login</Button>&nbsp;
                        <Button className="show_login_button" onClick={handleShowRegister}>Register</Button>
                    </Row>
                    {(!showLogin && !showRegister) ?
                        <Row className="justify-content-center mt-4">
                            <Col className="col-md-4 col-8">
                                <div
                                    style={{
                                        background: "linear-gradient(135deg, #e3f2fd, #ffffff)",
                                        padding: "20px",
                                        borderRadius: "12px",
                                        boxShadow: "0 4px 8px rgba(0,0,0,0.1)",
                                        textAlign: "center",
                                        fontFamily: "Arial, sans-serif",
                                    }}
                                >
                                    <h2 style={{ color: "#1565c0", fontWeight: "bold", marginBottom: "15px" }}>
                                        For Testing
                                    </h2>
                                    <p style={{ fontSize: "16px", color: "#333", margin: "5px 0" }}>
                                        <strong>Login Email:</strong> admin@gmail.com
                                    </p>
                                    <p style={{ fontSize: "16px", color: "#333", margin: "5px 0" }}>
                                        <strong>Login Password:</strong> 1234
                                    </p>
                                    <hr />
                                    <p style={{ fontSize: "15px", fontWeight: "bold", color: "#2e7d32" }}>
                                        JOIN ROOM ID & PASS
                                    </p>
                                    <p style={{ fontSize: "14px", color: "#777", marginBottom: "10px" }}>
                                        COPY & PASTE EXACTLY (CASE SENSITIVE)
                                    </p>
                                    <p style={{ fontSize: "16px", color: "#333", margin: "5px 0" }}>
                                        <strong>Room ID:</strong> NewRoom
                                    </p>
                                    <p style={{ fontSize: "16px", color: "#333", margin: "5px 0" }}>
                                        <strong>Room Password:</strong> 1234
                                    </p>
                                </div>
                            </Col>
                        </Row>
                        : null}
                    <Row>&nbsp;</Row>
                    {showLogin && <Row className='login_header'><LoginPage /></Row>}

                    {showRegister && <div className='register_header' ><RegisterPage /></div>}
                </Container>
                <Footer />
            </div>

        </>
    );
};

export default Home;
