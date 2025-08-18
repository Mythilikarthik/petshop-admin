import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Form, Button, Container, Row, Col, Image } from 'react-bootstrap';

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

  const [previewUrls, setPreviewUrls] = useState([]);


  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handlePhotoChange = (e) => {
    const files = Array.from(e.target.files);
    setFormData(prev => ({
      ...prev,
      photos: files
    }));

    // Preview selected images
    const urls = files.map(file => URL.createObjectURL(file));
    setPreviewUrls(urls);
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
        <h2 className="mb-4">Add Category</h2>
        <Form onSubmit={handleSubmit}>
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

            

            <Button variant="primary" type="submit">
            Save
            </Button>
        </Form>
      </div>
    </Container>
  );
};

export default AddListing;
