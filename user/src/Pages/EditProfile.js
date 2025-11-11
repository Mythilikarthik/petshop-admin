import React, { useState, useEffect } from 'react';
import { Form, Button, Container, Row, Col, Breadcrumb } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';


const API_BASE = process.env.NODE_ENV === "production"
  ? "https://petshop-admin.onrender.com"
  : "http://localhost:5000";

const EditProfile = () => {
  const id = localStorage.getItem("userId");
  const [formData, setFormData] = useState({ name: '', email: '', phone: '' });
  const navigate = useNavigate();

  // Fetch current profile data
  useEffect(() => {
    const fetchProfile = async () => {
      const res = await fetch(`${API_BASE}/api/auth/user/profile/${id}`);
      const data = await res.json();
      if (data.success) setFormData({
        name: data.user.name || '',
        email: data.user.email || '',
        phone: data.user.phone || ''
      });
    };
    fetchProfile();
  }, [id]);

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    const res = await fetch(`${API_BASE}/api/auth/user/profile/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData),
    });
    const data = await res.json();
    if (data.success) {
      alert("Profile updated successfully!");
      navigate("/dashboard");
    }
    else alert(data.message || "Update failed");
  };

  return (
    <Container className="mt-4">
      <div className='pl-3 pr-3'>
        <Row className='mb-3 justify-content-end align-items-center'>
          <Col>
            <h2 className='main-title mb-0'>Edit Profile</h2>
            <Breadcrumb className='top-breadcrumb'>
              <Breadcrumb.Item href="/">Home</Breadcrumb.Item>
              <Breadcrumb.Item active>Edit Profile</Breadcrumb.Item>
            </Breadcrumb>
          </Col>
        </Row>

        <div className='form-container'>
          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3">
              <Form.Label>Name</Form.Label>
              <Form.Control type="text" name="name" value={formData.name} onChange={handleChange} placeholder="Enter your name" />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Email</Form.Label>
              <Form.Control type="email" name="email" value={formData.email} onChange={handleChange} placeholder="Enter your email" />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Phone</Form.Label>
              <Form.Control type="text" name="phone" value={formData.phone} onChange={handleChange} placeholder="Enter your phone" />
            </Form.Group>

            <Button variant="primary" type="submit">Save Changes</Button>
          </Form>
        </div>
      </div>
    </Container>
  );
};

export default EditProfile;
