import React, { useState } from 'react';
import {  useLocation, useNavigate } from 'react-router-dom';
import { Form, Button, Container, Row, Col, Breadcrumb } from 'react-bootstrap';
const API_BASE =
  process.env.NODE_ENV === "production"
    ? "https://petshop-admin.onrender.com"
    : "http://localhost:5000";
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


  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');
    if (!listing?._id) {
      setError('Invalid city ID');
      setLoading(false);
      return;
    }
    try {
      const res = await fetch(`${API_BASE}/api/city/${listing._id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || 'Failed to add city');
      }

      setSuccess('City Updated successfully!');
      setFormData({
        city: '',
      });

      // Optional: redirect after success
      setTimeout(() => navigate('/city-listing'), 1500);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container className="mt-4">
      <div className='pl-3 pr-3'>
        <Row className='mb-3 justify-content-end align-items-center'>
          <Col>
            <h2 className='main-title mb-0'>Edit City</h2>
            <Breadcrumb className='top-breadcrumb'>
              <Breadcrumb.Item href="/">Home</Breadcrumb.Item>
              <Breadcrumb.Item active>Edit City</Breadcrumb.Item>
            </Breadcrumb>
          </Col>
          <Col xs={'auto'}>
            <Button variant="secondary" onClick={() => navigate(-1)}>Go Back</Button>
          </Col>
        </Row>
        <div className='form-container'>
          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3">
            <Form.Label>City Name</Form.Label>
            <Form.Control
                type="text"
                name="city"
                value={formData.city}
                onChange={handleChange}
                required
            />
            </Form.Group>         
            {error && <p className="text-danger">{error}</p>}
          {success && <p className="text-success">{success}</p>}
            <Button variant="primary" type="submit" disabled={loading}>
              {loading ? 'Saving...' : 'Save'}
            </Button>
        </Form>
        </div>
      </div>
    </Container>
  );
};

export default EditCity;
