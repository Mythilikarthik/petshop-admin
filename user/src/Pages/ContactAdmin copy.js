import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Form, Button, Container, Row, Col, Breadcrumb } from 'react-bootstrap';
import emailjs from '@emailjs/browser';

const ContactAdmin = () => {
  const { state } = useLocation();
  const navigate = useNavigate();

  const { listing } = state || {};

  const [formData, setFormData] = useState({
    sendTo: "Admin",
    shopName: listing?.name || '',
    email: listing?.email || '',
    description: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const templateParams = {
      from_name: formData.shopName,
      from_email: formData.email,
      message: formData.description,
      to_email: "scotwebtech2025@gmail.com",
    };

    emailjs
      .send(
        "service_7zd4kun",     // 👉 replace with your EmailJS Service ID
        "template_iayhhai",    // 👉 replace with your Template ID
        templateParams,
        "m-WXEnRKnH-x6Qanm"      // 👉 replace with your Public Key
      )
      .then(
        (response) => {
          console.log('SUCCESS!', response.status, response.text);
          alert('Message sent to Admin successfully!');
          navigate('/business-listing');
        },
        (err) => {
          console.error('FAILED...', err);
          alert('Failed to send message. Please try again.');
        }
      );
  };

  const sendTo = ["scotwebtech2025@gmail.com"];

  return (
    <Container className="mt-4">
      <div className='pl-3 pr-3'>
        <Row className='mb-3 justify-content-end align-items-center'>
          <Col>
            <h2 className='main-title mb-0'>Contact Admin</h2>
          </Col>
          <Col xs={'auto'}>
            <Breadcrumb className='top-breadcrumb'>
              <Breadcrumb.Item href="#">Home</Breadcrumb.Item>
              <Breadcrumb.Item active>Contact Admin</Breadcrumb.Item>
            </Breadcrumb>
          </Col>
        </Row>

        <div className='form-container'>
          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3">
              <Form.Label>Send To</Form.Label>
              <Form.Select
                name="sendTo"
                value={formData.sendTo}
                onChange={handleChange}
                required
              >
                <option value="">-- Send To --</option>
                {sendTo.map((element, index) => (
                  <option key={index} value={element}>{element}</option>
                ))}
              </Form.Select>
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Your Name / Shop Name</Form.Label>
              <Form.Control
                type="text"
                name="shopName"
                value={formData.shopName}
                onChange={handleChange}
                required
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Your Email</Form.Label>
              <Form.Control
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </Form.Group>

            <Form.Group className='mb-4'>
              <Form.Label>Message</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                name="description"
                value={formData.description}
                onChange={handleChange}
                required
              />
            </Form.Group>

            <Button variant="primary" type="submit">
              Send
            </Button>
          </Form>
        </div>
      </div>
    </Container>
  );
};

export default ContactAdmin;
