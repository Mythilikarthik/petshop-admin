import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Form, Button, Container, Row, Col, Image, Breadcrumb } from 'react-bootstrap';

const AddListing = () => {
  const { state } = useLocation();
  const navigate = useNavigate();

  const { listing } = state || {};

  const [formData, setFormData] = useState({
    shopName: listing?.name || '',
    email: listing?.email || '',
    phone: listing?.phone || '',
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
  const categoryList = ["Pet Shop", "Pet Food", "Services", "Pet Insurance"];
  const cityList = ["Erode", "Chennai", "Coimbatore", "Salem"];
  return (
    <Container className="mt-4">
      <div className='pl-3 pr-3'>
        <Row className='mb-3 justify-content-end align-items-center'>
          <Col>
            <h2 className='main-title mb-0'>Add Listing</h2>
          </Col>
          <Col xs={'auto'}>
            <Breadcrumb className='top-breadcrumb'>
              <Breadcrumb.Item href="#">Home</Breadcrumb.Item>
              <Breadcrumb.Item active>Add Listing</Breadcrumb.Item>
            </Breadcrumb>
          </Col>
        </Row>
        
        <div className='form-container'>
          <Form onSubmit={handleSubmit}>            
            <Form.Group className="mb-3">
            <Form.Label>Category</Form.Label>
            <Form.Select
                name="category"
                value={formData.category}
                placeholder='Select Category'
                onChange={handleChange}
                required
            >
              <option value="">
                -- Select Category --
              </option>
              {categoryList.map((element, index) => (
                <option key={index} value={element}>{element}</option>
              ))}
            </Form.Select>
            </Form.Group>
            <Form.Group className="mb-3">
            <Form.Label>Shop Name</Form.Label>
            <Form.Control
                type="text"
                name="shopName"
                value={formData.shopName}
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
                  type="number"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  required
              />
              </Form.Group>

            <Form.Group className="mb-3">
            <Form.Label>Address</Form.Label>
            <Form.Control
                type="text"
                name="address"
                value={formData.address}
                onChange={handleChange}
            />
            </Form.Group>

            <Form.Group className="mb-3">
            <Form.Label>City</Form.Label>
            <Form.Select name="city" value={formData.city} onChange={handleChange} required>
              <option value="">--Select City--</option>
              {cityList.map((element, index)=> (
                <option key={index} value={element}>
                  {element}
                </option>
              ))}
            </Form.Select>
            
            </Form.Group>

            <Form.Group className="mb-3">
            <Form.Label>Country</Form.Label>
            <Form.Control
                type="text"
                name="country"
                value={formData.country}
                onChange={handleChange}
            />
            </Form.Group>

            <Form.Group className="mb-3">
            <Form.Label>Location Map URL</Form.Label>
            <Form.Control
                type="url"
                name="mapUrl"
                value={formData.mapUrl}
                onChange={handleChange}
            />
            </Form.Group>

            {formData.mapUrl && (
            <div className="mb-3">
                <iframe
                src={formData.mapUrl}
                width="100%"
                height="250"
                style={{ border: 0 }}
                allowFullScreen=""
                loading="lazy"
                title="Location Map"
                ></iframe>
            </div>
            )}

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

            <Form.Group className="mb-4">
            <Form.Label>Upload Photos</Form.Label>
            <Form.Control
                type="file"
                name="photos"
                multiple
                accept="image/*"
                onChange={handlePhotoChange}
            />
            </Form.Group>

            {/* Image Previews */}
            {previewUrls.length > 0 && (
            <Row className="mb-4">
                {previewUrls.map((url, index) => (
                <Col key={index} xs={6} md={4} lg={3} className="mb-3">
                    <Image src={url} thumbnail fluid />
                </Col>
                ))}
            </Row>
            )}
            <Form.Group className='mb-4'>
                <Form.Label>Page Title</Form.Label>
                <Form.Control type='text' name='metaName' value="" required onChange={handleChange} />
            </Form.Group>
            <Form.Group className='mb-4'>
                <Form.Label>Meta Keyword</Form.Label>
                <Form.Control type='text' name='metaWord' value="" required onChange={handleChange} />
            </Form.Group>
            <Form.Group className='mb-4'>
                <Form.Label>Meta Description</Form.Label>
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
