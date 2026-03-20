import React, { useState } from 'react';
import { Form, Button, Col, Container, Breadcrumb, Row } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { FaEye, FaEyeSlash } from "react-icons/fa";


const API_BASE = process.env.NODE_ENV === "production"
  ? process.env.REACT_APP_API_URL
  : "http://localhost:5000";

const ChangePassword = () => {
  const id = localStorage.getItem("userId");
  const [formData, setFormData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  const navigate = useNavigate();

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.newPassword !== formData.confirmPassword) {
      alert("New passwords don't match!");
      return;
    }

    const res = await fetch(`${API_BASE}/api/auth/user/change-password/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        currentPassword: formData.currentPassword,
        newPassword: formData.newPassword,
      }),
    });

    const data = await res.json();
    if (data.success) {
      alert("Password changed successfully!");
      navigate("/dashboard");
    }
    else alert(data.message || "Error changing password");
  };
  const [showPassword, setShowPassword] = useState({
    current: false,
    new: false,
    confirm: false,
  });
const togglePassword = (field) => {
  setShowPassword(prev => ({
    ...prev,
    [field]: !prev[field]
  }));
};


  return (
    <Container className="mt-4">
      <div className='pl-3 pr-3'>
        <Row className='mb-3 justify-content-end align-items-center'>
          <Col>
            <h2 className='main-title mb-0'>Change Password</h2>
            <Breadcrumb className='top-breadcrumb'>
              <Breadcrumb.Item href="/">Home</Breadcrumb.Item>
              <Breadcrumb.Item active>Change Password</Breadcrumb.Item>
            </Breadcrumb>
          </Col>
        </Row>

        <div className='form-container'>
        <Form onSubmit={handleSubmit}>
          {/* <Form.Group className="mb-3">
            <Form.Label>Current Password</Form.Label>
            <Form.Control type="password" name="currentPassword" value={formData.currentPassword} onChange={handleChange} placeholder="Enter your current password" />
          </Form.Group> */}
          <Form.Group className="mb-3">
            <Form.Label>Current Password</Form.Label>
            <div className="position-relative">
              <Form.Control
                type={showPassword.current ? "text" : "password"}
                name="currentPassword"
                value={formData.currentPassword}
                onChange={handleChange}
                placeholder="Enter your current password"
              />
              <span
                onClick={() => togglePassword("current")}
                style={{
                  position: "absolute",
                  right: "15px",
                  top: "50%",
                  transform: "translateY(-50%)",
                  cursor: "pointer"
                }}
              >
                {showPassword.current ? <FaEyeSlash /> : <FaEye />}
              </span>
            </div>
          </Form.Group>

{/* 
          <Form.Group className="mb-3">
            <Form.Label>New Password</Form.Label>
            <Form.Control type="password" name="newPassword" value={formData.newPassword} onChange={handleChange} placeholder="Enter new password" />
          </Form.Group> */}
          <Form.Group className="mb-3">
  <Form.Label>New Password</Form.Label>
  <div className="position-relative">
    <Form.Control
      type={showPassword.new ? "text" : "password"}
      name="newPassword"
      value={formData.newPassword}
      onChange={handleChange}
      placeholder="Enter new password"
    />
    <span
      onClick={() => togglePassword("new")}
      style={{
        position: "absolute",
        right: "15px",
        top: "50%",
        transform: "translateY(-50%)",
        cursor: "pointer"
      }}
    >
      {showPassword.new ? <FaEyeSlash /> : <FaEye />}
    </span>
  </div>
</Form.Group>


          {/* <Form.Group className="mb-3">
            <Form.Label>Confirm New Password</Form.Label>
            <Form.Control type="password" name="confirmPassword" value={formData.confirmPassword} onChange={handleChange} placeholder="Confirm new password" />
          </Form.Group> */}
          <Form.Group className="mb-3">
  <Form.Label>Confirm New Password</Form.Label>
  <div className="position-relative">
    <Form.Control
      type={showPassword.confirm ? "text" : "password"}
      name="confirmPassword"
      value={formData.confirmPassword}
      onChange={handleChange}
      placeholder="Confirm new password"
    />
    <span
      onClick={() => togglePassword("confirm")}
      style={{
        position: "absolute",
        right: "15px",
        top: "50%",
        transform: "translateY(-50%)",
        cursor: "pointer"
      }}
    >
      {showPassword.confirm ? <FaEyeSlash /> : <FaEye />}
    </span>
  </div>
</Form.Group>


          <Button variant="primary" type="submit">Change Password</Button>
        </Form>
      </div>
    </div>
    </Container>
  );
};

export default ChangePassword;
