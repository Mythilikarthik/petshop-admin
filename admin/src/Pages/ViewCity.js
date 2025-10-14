import React, { useState } from 'react';
import {  useLocation, useNavigate } from 'react-router-dom';
import { Form, Button, Container, Row, Col, Breadcrumb } from 'react-bootstrap';

const EditCity = () => {
  const navigate = useNavigate();
  const {state} = useLocation();
  const { listing } = state || {}; 

  const [formData, setFormData] = useState({
    city: listing.city || '',
  });

  const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');


  

  

  return (
    <Container className="mt-4">
      <div className='pl-3 pr-3'>
        <Row className='mb-3 justify-content-end align-items-center'>
          <Col>
            <h2 className='main-title mb-0'>View City</h2>
          </Col>
          <Col xs={'auto'}>
            <Breadcrumb className='top-breadcrumb'>
              <Breadcrumb.Item href="#">Home</Breadcrumb.Item>
              <Breadcrumb.Item active>View City</Breadcrumb.Item>
            </Breadcrumb>
          </Col>
        </Row>
        <div className='form-container'>
          <Form >
            <Form.Group className="mb-3">
            <Form.Label>City Name</Form.Label>
            <Form.Control
                type="text"
                name="city"
                value={formData.city}
                disabled
                readOnly
                required
            />
            </Form.Group>         
            
        </Form>
        </div>
      </div>
    </Container>
  );
};

export default EditCity;
