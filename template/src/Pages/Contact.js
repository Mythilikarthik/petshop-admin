import React, { useState } from "react";
import { Form, Button, Alert, Container, Row, Col } from "react-bootstrap";

const API_BASE =
  process.env.NODE_ENV === "production"
    ? "https://petshop-admin.onrender.com"
    : "http://localhost:5000";

const Contact = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    message: "",
  });

  const [status, setStatus] = useState({ success: "", error: "" });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus({ success: "", error: "" });

    try {
      const res = await fetch(`${API_BASE}/api/contact-admin/send`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (data.success) {
        setStatus({ success: data.message, error: "" });
        setFormData({ name: "", email: "", phone: "", message: "" });
      } else {
        setStatus({ error: data.message, success: "" });
      }
    } catch (err) {
      setStatus({ error: "Something went wrong!", success: "" });
    }
  };

  return (
    <Container className="mt-5 mb-5">
      <Row className="justify-content-center">
        <Col lg={6} md={8}>
          
          <h2>Contact Us</h2>

      {status.success && <Alert variant="success">{status.success}</Alert>}
      {status.error && <Alert variant="danger">{status.error}</Alert>}

      <Form onSubmit={handleSubmit}>

        <Form.Group className="mb-3">
          <Form.Label>Name</Form.Label>
          <Form.Control 
            type="text" 
            name="name" 
            value={formData.name} 
            onChange={handleChange} 
            required 
          />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Email</Form.Label>
          <Form.Control 
            type="email" 
            name="email"
            value={formData.email}
            onChange={handleChange}
            required 
          />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Phone</Form.Label>
          <Form.Control 
            type="text" 
            name="phone" 
            value={formData.phone}
            onChange={handleChange}
          />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Message</Form.Label>
          <Form.Control 
            as="textarea" 
            rows={4} 
            name="message"
            value={formData.message}
            onChange={handleChange}
            required
          />
        </Form.Group>

        <Button variant="primary" type="submit">
          Send Message
        </Button>

      </Form>
        </Col>
      </Row>
    </Container>
  );
};

export default Contact;
