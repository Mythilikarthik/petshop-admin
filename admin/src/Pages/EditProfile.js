import React, { useState } from 'react';
import { Form, Button,  Container, Row, Col, Breadcrumb } from 'react-bootstrap';

const EditProfile = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Profile updated:', formData);
    alert('Profile updated successfully!');
  };

  return (
    <Container className="mt-4">
        <div className='pl-3 pr-3'>
            <Row className='mb-3 justify-content-end align-items-center'>
            <Col>
                <h2 className='main-title mb-0'>Edit Proile</h2>
                <Breadcrumb className='top-breadcrumb'>
                <Breadcrumb.Item href="/">Home</Breadcrumb.Item>
                <Breadcrumb.Item active>Edit Proile</Breadcrumb.Item>
                </Breadcrumb>
            </Col>
            </Row>
            <div className='form-container'>
        <Form onSubmit={handleSubmit}>
          <Form.Group className="mb-3">
            <Form.Label>Name</Form.Label>
            <Form.Control
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Enter your name"
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Email</Form.Label>
            <Form.Control
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Enter your email"
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Phone</Form.Label>
            <Form.Control
              type="text"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              placeholder="Enter your phone"
            />
          </Form.Group>

          <Button variant="primary" type="submit">Save Changes</Button>
        </Form>
      </div>
      </div>
    </Container>
  );
};

export default EditProfile;
