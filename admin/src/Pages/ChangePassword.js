import React, { useState } from 'react';
import { Form, Button, Card, Container } from 'react-bootstrap';

const API_BASE = process.env.NODE_ENV === "production"
  ? "https://petshop-admin.onrender.com"
  : "http://localhost:5000";

const ChangePassword = () => {
    const id = localStorage.getItem("userId");
  const [formData, setFormData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.newPassword !== formData.confirmPassword) {
      alert("New passwords don't match!");
      return;
    }
    const res = await fetch(`${API_BASE}/api/admin/change-password/${id}`);
    const data = await res.json();
    if(data.success) {
        console.log('Password changed:', formData);
        alert('Password changed successfully!');
        
    }
  };

  return (
    <Container className="py-4">
      <Card className="p-4 shadow-sm">
        <h4 className="mb-3">Change Password</h4>
        <Form onSubmit={handleSubmit}>
          <Form.Group className="mb-3">
            <Form.Label>Current Password</Form.Label>
            <Form.Control
              type="password"
              name="currentPassword"
              value={formData.currentPassword}
              onChange={handleChange}
              placeholder="Enter your current password"
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>New Password</Form.Label>
            <Form.Control
              type="password"
              name="newPassword"
              value={formData.newPassword}
              onChange={handleChange}
              placeholder="Enter new password"
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Confirm New Password</Form.Label>
            <Form.Control
              type="password"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              placeholder="Confirm new password"
            />
          </Form.Group>

          <Button variant="primary" type="submit">Change Password</Button>
        </Form>
      </Card>
    </Container>
  );
};

export default ChangePassword;
