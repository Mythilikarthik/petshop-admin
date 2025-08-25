import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Container, Row, Col, Button, Breadcrumb } from 'react-bootstrap';

const ViewListing = () => {
  const { state } = useLocation();
  const navigate = useNavigate();
  const { listing } = state || {};

  if (!listing) {
    return <p className="text-danger mt-4 text-center">No listing data found.</p>;
  }

  return (
    <Container className="mt-4">
      <Row className='mb-3 justify-content-end align-items-center'>
          <Col>
            <h2 className='main-title mb-0'>View Message</h2>
          </Col>
          <Col xs={'auto'}>
            <Breadcrumb className='top-breadcrumb'>
              <Breadcrumb.Item href="#">Home</Breadcrumb.Item>
              <Breadcrumb.Item active>View Message</Breadcrumb.Item>
            </Breadcrumb>
          </Col>
        </Row>

      <Row className="mb-3">
        <Col md={6}><strong>Shop Name:</strong></Col>
        <Col md={6}>{listing.name}</Col>
      </Row>

      <Row className="mb-3">
        <Col md={6}><strong>Message:</strong></Col>
        <Col md={6}>{listing.message}</Col>
      </Row>

      <Button variant="secondary" onClick={() => navigate(-1)}>
        Go Back
      </Button>
    </Container>
  );
};

export default ViewListing;
