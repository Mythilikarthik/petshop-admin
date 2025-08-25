import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Form, Button, Container, Row, Col,  Breadcrumb } from 'react-bootstrap';

const PageManagement = () => {
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
  const pageList = ["Pet Shop", "Pet Food", "Services", "Pet Insurance"];
  return (
    <Container className="mt-4">
      <div className='pl-3 pr-3'>
        <Row className='mb-3 justify-content-end align-items-center'>
          <Col>
            <h2 className='main-title mb-0'>Page Managemnent</h2>
          </Col>
          <Col xs={'auto'}>
            <Breadcrumb className='top-breadcrumb'>
              <Breadcrumb.Item href="#">Home</Breadcrumb.Item>
              <Breadcrumb.Item active>Page Managemnent</Breadcrumb.Item>
            </Breadcrumb>
          </Col>
        </Row>
        
        <div className='form-container'>
          <Form onSubmit={handleSubmit}>            
            <Form.Group className="mb-3">
                <Form.Label>Page</Form.Label>
                <Form.Select
                    name="page"
                    value={formData.page}
                    placeholder='Select Page'
                    onChange={handleChange}
                    required
                >
                    <option value="">
                    -- Select Page --
                    </option>
                    {pageList.map((element, index) => (
                    <option key={index} value={element}>{element}</option>
                    ))}
                </Form.Select>
            </Form.Group>
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
            <Form.Group className='mb-4'>
                <Form.Label>One Para Content</Form.Label>
                <Form.Control
                    as="textarea"
                    rows={3}
                    name="para"
                    value={formData.para}
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

export default PageManagement;
