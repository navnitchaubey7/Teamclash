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
                        <h1 className="home_header"><strong>Welcome to the Battle </strong></h1>
                    </Row>
                    <Row className="justify-content-end">
                        <Button className="show_login_button" onClick={handleShowLogin}>Login</Button>&nbsp;
                        <Button className="show_login_button" onClick={handleShowRegister}>Register</Button>
                    </Row>

                    <Row>&nbsp;</Row>
                    <Row>&nbsp;</Row>
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
