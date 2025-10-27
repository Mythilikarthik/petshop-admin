import React from 'react';
import {  useLocation, useNavigate } from 'react-router-dom';
import { Form, Container, Row, Col, Breadcrumb, Button } from 'react-bootstrap';

const ViewCity = () => {
  const {state} = useLocation();
  const { listing } = state || {}; 
  const navigate = useNavigate();
  
const formData = listing.city || '';

  if (!listing) {
    return <p className="text-danger mt-4 text-center">No city data found.</p>;
  }


  

  

  return (
    <Container className="mt-4">
      <div className='pl-3 pr-3'>
        <Row className='mb-3 justify-content-end align-items-center'>
          <Col>
            <h2 className='main-title mb-0'>View City</h2>
            <Breadcrumb className='top-breadcrumb'>
              <Breadcrumb.Item href="/">Home</Breadcrumb.Item>
              <Breadcrumb.Item active>View City</Breadcrumb.Item>
            </Breadcrumb>
          </Col>
          <Col xs={'auto'}>
            <Button variant="secondary" onClick={() => navigate(-1)}>Go Back</Button>
          </Col>
        </Row>
        <div className='form-container'>
          <Form >
            <Form.Group className="mb-3">
            <Form.Label>City Name</Form.Label>
            <Form.Control
                type="text"
                name="city"
                value={formData}
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

export default ViewCity;
