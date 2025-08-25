import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Form, Button, Container, Row, Col, Breadcrumb } from 'react-bootstrap';

const AddListing = () => {
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

  return (
    <Container className="mt-4">
      <div className='pl-3 pr-3'>
        <Row className='mb-3 justify-content-end align-items-center'>
          <Col>
            <h2 className='main-title mb-0'>Add Category</h2>
          </Col>
          <Col xs={'auto'}>
            <Breadcrumb className='top-breadcrumb'>
              <Breadcrumb.Item href="#">Home</Breadcrumb.Item>
              <Breadcrumb.Item active>Add Category</Breadcrumb.Item>
            </Breadcrumb>
          </Col>
        </Row>
        <div className='form-container'>
          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3">
            <Form.Label>Meta Title</Form.Label>
            <Form.Control
                type="text"
                name="metaTitle"
                value={formData.categoryName}
                onChange={handleChange}
                required
            />
            </Form.Group>
            <Form.Group className="mb-3">
            <Form.Label>Meta keyword</Form.Label>
            <Form.Control
                type="text"
                name="metaKeyword"
                value={formData.categoryName}
                onChange={handleChange}
                required
            />
            </Form.Group>
            <Form.Group className="mb-3">
            <Form.Label>Meta description</Form.Label>
            <Form.Control
                type="text"
                name="metaDescription"
                value={formData.categoryName}
                onChange={handleChange}
                required
            />
            </Form.Group>
            <Form.Group className="mb-3">
            <Form.Label>Category Name</Form.Label>
            <Form.Control
                type="text"
                name="categoryName"
                value={formData.categoryName}
                onChange={handleChange}
                required
            />
            </Form.Group>
            <Form.Group className="mb-3">
            <Form.Label>Description</Form.Label>
            <Form.Control
                as="textarea"
                rows={3}
                name="description"
                value={formData.description}
                onChange={handleChange}
            />
            </Form.Group>
            <Button variant="primary" type="submit">
            Save
            </Button>
        </Form>
        </div>
      </div>
    </Container>
  );
};

export default AddListing;
