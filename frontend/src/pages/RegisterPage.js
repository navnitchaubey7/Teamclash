import React, { useState } from 'react';
import axios from 'axios';
import { Container, Row, Col } from 'react-bootstrap';
import '../mcss/Home.css';
import $ from 'jquery';
import * as Common from "../components/Common";

function RegisterPage() {
  const [form, setForm] = useState({ name: '', email: '', password: '' });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    $(".loader").show();
    e.preventDefault();
    try {
      const res = await axios.post(Common.apiregisteruser, form);
      alert("Registration Success ✅");
    } catch (err) {
      alert(err.response?.data?.message || 'Registration failed ❌');
    }
    $(".loader").hide();
  };

  return (
    <div>
      <Container>
        <div className="login-box">
          <Row className="justify-content-center mb-3">
            <Col md={6} className="text-center">
              <h2>Register</h2>
            </Col>
          </Row>

          <form onSubmit={handleSubmit}>
            <Row className="justify-content-center mb-3">
              <Col md={6}>
                <input
                  name="name"
                  type="text"
                  placeholder="Name"
                  onChange={handleChange}
                  required
                  className="form-control"
                />
              </Col>
            </Row>

            <Row className="justify-content-center mb-3">
              <Col md={6}>
                <input
                  name="email"
                  type="email"
                  placeholder="Email"
                  onChange={handleChange}
                  required
                  className="form-control"
                />
              </Col>
            </Row>

            <Row className="justify-content-center mb-3">
              <Col md={6}>
                <input
                  name="password"
                  type="password"
                  placeholder="Password"
                  onChange={handleChange}
                  required
                  className="form-control"
                />
              </Col>
            </Row>

            <Row md={6} className="justify-content-center">
              <button type="submit" className="btn btn-success">Register</button>
            </Row>
          </form>
        </div>
      </Container>
    </div>
  );
}

export default RegisterPage;
