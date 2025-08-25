import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Form, Button, Container, Row, Col, Breadcrumb } from 'react-bootstrap';

const SendMessage = () => {
  const { state } = useLocation();
  const navigate = useNavigate();

  const { listing } = state || {};

  const [formData, setFormData] = useState({
    shopName: listing?.name || '',
    email: listing?.email || '',
    address: listing?.address || '',
    city: listing?.city || '',
    country: listing?.country || '',
    mapUrl: listing?.mapUrl || '',
    description: listing?.description || '',
    photos: [] // array of File objects
  });


  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };


  const handleSubmit = (e) => {
    e.preventDefault();

    // Simulate sending data
    console.log('Submitted data:', formData);

    // If uploading to backend:
    // const formDataToSend = new FormData();
    // formDataToSend.append('shopName', formData.shopName);
    // formDataToSend.append('email', formData.email);
    // ...
    // formData.photos.forEach((photo, index) => {
    //   formDataToSend.append(`photos[${index}]`, photo);
    // });

    alert('Changes saved successfully!');
    navigate('/business-listing');
  };
  const sendTo = ["Jhon Doe", "Jane Smith", "Michael Scott"];
  
  return (
    <Container className="mt-4">
      <div className='pl-3 pr-3'>
        <Row className='mb-3 justify-content-end align-items-center'>
          <Col>
            <h2 className='main-title mb-0'>Send Message</h2>
          </Col>
          <Col xs={'auto'}>
            <Breadcrumb className='top-breadcrumb'>
              <Breadcrumb.Item href="#">Home</Breadcrumb.Item>
              <Breadcrumb.Item active>Send Message</Breadcrumb.Item>
            </Breadcrumb>
          </Col>
        </Row>
        
        <div className='form-container'>
          <Form onSubmit={handleSubmit}>            
            <Form.Group className="mb-3">
            <Form.Label>Send To</Form.Label>
            <Form.Select
                name="sendto"
                value={formData.sendTo}
                placeholder='Send To'
                onChange={handleChange}
                required
            >
              <option value="">
                -- Send To --
              </option>
              {sendTo.map((element, index) => (
                <option key={index} value={element}>{element}</option>
              ))}
            </Form.Select>
            </Form.Group>
            
            <Form.Group className='mb-4'>
                <Form.Label>Message</Form.Label>
                <Form.Control
                    as="textarea"
                    rows={3}
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
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

export default SendMessage;
