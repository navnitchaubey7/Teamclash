import React, { useState } from 'react';
import axios from 'axios';
import { Row, Col, Container, Button, Form } from 'react-bootstrap';
import '../mcss/Home.css';
import $ from "jquery";
import { useNavigate } from 'react-router-dom';
import { useTransition } from 'react';


function LoginPage() {
  const navigate = useNavigate();
  const [scrMode, setScrMode] = useState("");
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState("");
  const [otp, setOtp] = useState("");
  const [showForgetPassbox, setShowForgetPassbox] = useState(false);
  const [showOldNewPass, setShowOldNewPass] = useState(false);
  const [newPass, setNewPass] = useState("");
  const [renteredNewpass, setRenteredNewpass] = useState("");

  const handleSubmit = async (e) => {
    const obj = {
      email: email,
      password: password
    }
    try {
      const res = await axios.post('http://localhost:5000/api/auth/login', obj);
      
      alert("Login Success ✅");
      navigate("/profile");
      sessionStorage.setItem("user_id", res.data.user.user_id);
      sessionStorage.setItem("user_name", res.data.user.name);
      localStorage.setItem("token", res.data.token);
    } catch (err) {
      alert(err.response?.data?.message || 'Login failed ❌');
    }
  };
  const handleforgetPassword = () => {
    setScrMode("forget-password");
  }
  const handleBackButton = (previousmode) => {
    setScrMode(previousmode);
  }
  const handleForgetSubmit = async () => {
    const obj = {
      email: email
    }
    try {
      const res = await axios.post('http://localhost:5000/api/auth/forgetpassotp', obj);
      alert("Password Reset Successfully ✅");
      setShowForgetPassbox(true);
    } catch (err) {
      alert(err.response?.data?.message || 'Reset password failed ❌');
    }
  }
  const handleVerifyOTP = async () => {
    const obj = {
      email: email,
      password: otp
    }
    try {
      const res = await axios.post('http://localhost:5000/api/auth/verifyotp', obj);
      console.log(res.data.token)
      if (res.data.token === "") {
        setShowOldNewPass(false);
      } else {
        setShowOldNewPass(true);
        alert("OTP Verified. ✅");
      }
    } catch (err) {
      alert(err.response?.data?.message || 'Reset password failed ❌');
    }
  }
  const handleFinalsave = async () => {
    if (newPass !== renteredNewpass) {
      alert("dono field same daal bkl");
    } else {
      const obj = {
        email: email,
        password: newPass
      }
      try {
        const res = await axios.post('http://localhost:5000/api/auth/updatepassfinal', obj);
        alert("Password Reset Successfully. ✅");
        setShowOldNewPass(true);
        setShowForgetPassbox(true);
        setScrMode("");
      } catch (err) {
        alert(err.response?.data?.message || 'Reset password failed ❌');
      }
    }
  }
  const handleGoogleLogin = () => {
    window.location.href = "http://localhost:5000/api/auth/google";
  };
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
              <button className="btn btn-danger" onClick={handleGoogleLogin}>
                Sign in with Google
              </button>


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
                <input name="email" type="email" placeholder="Email" onChange={(e) => setEmail(e.target.value)} value={email}
                  required className="form-control"
                />
              </Col>
            </Row>
            {showForgetPassbox &&
              <Row className="justify-content-center mb-3">
                <Col md={6}>
                  <input name="otp" type="otp" placeholder="OTP" onChange={(e) => setOtp(e.target.value)} value={otp}
                    required className="form-control"
                  />
                </Col>
              </Row>}
            {showOldNewPass && <>
              <Row className="justify-content-center mb-3">
                <Col md={6}>
                  <input name="newpass" type="text" placeholder="New password" onChange={(e) => setNewPass(e.target.value)} value={newPass}
                    required className="form-control"
                  />
                </Col>
              </Row>
              <Row className="justify-content-center mb-3">
                <Col md={6}>
                  <input name="reenterpass" type="text" placeholder="Re enter password" onChange={(e) => setRenteredNewpass(e.target.value)} value={renteredNewpass}
                    required className="form-control"
                  />
                </Col>
              </Row>
            </>}
            <Row md={6} className="justify-content-center text-center">
              <button onClick={() => handleBackButton("")} className="btn btn-primary me-3">Back</button>
              {!showForgetPassbox &&
                <Button className='btn btn-primary' size='sm' onClick={() => handleForgetSubmit()}>Submit</Button>}
              {showForgetPassbox && !showOldNewPass &&
                <Button className='btn btn-primary' size='sm' onClick={() => handleVerifyOTP()}>Submit</Button>}
              {showOldNewPass &&
                <Button className='btn btn-primary' size='sm' onClick={() => handleFinalsave()}>Change password</Button>}
            </Row>
          </div>}

      </Container>

    </div>
  );
}

export default LoginPage;
