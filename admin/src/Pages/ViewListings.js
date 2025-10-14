import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Container, Row, Col, Image, Button } from 'react-bootstrap';
const API_BASE =
  process.env.NODE_ENV === "production"
    ? "https://your-production-domain.com" // replace with your live server URL
    : "http://localhost:5000";

const ViewListing = () => {
  const { state } = useLocation();
  const navigate = useNavigate();
  const { listing } = state || {};
console.log(listing);
  if (!listing) {
    return <p className="text-danger mt-4 text-center">No listing data found.</p>;
  }

  return (
    <Container className="mt-4">
      <h2 className="mb-4">View Listing</h2>

      <Row className="mb-3">
        <Col md={6}><strong>Shop Name:</strong></Col>
        <Col md={6}>{listing.shopName}</Col>
      </Row>

      <Row className="mb-3">
        <Col md={6}><strong>Email:</strong></Col>
        <Col md={6}>{listing.email}</Col>
      </Row>

      <Row className="mb-3">
        <Col md={6}><strong>Phone:</strong></Col>
        <Col md={6}>{listing.phone || '—'}</Col>
      </Row>

      <Row className="mb-3">
        <Col md={6}><strong>Address:</strong></Col>
        <Col md={6}>{listing.address || '—'}</Col>
      </Row>

      <Row className="mb-3">
        <Col md={6}><strong>City:</strong></Col>
        <Col md={6}>{listing.city || '—'}</Col>
      </Row>

      <Row className="mb-3">
        <Col md={6}><strong>Country:</strong></Col>
        <Col md={6}>{listing.country || '—'}</Col>
      </Row>

      <Row className="mb-3">
        <Col md={6}><strong>Status:</strong></Col>
        <Col md={6}>{listing.status === 'approved' ? 'Approved' : 'Pending'}</Col>
      </Row>

      <Row className="mb-3">
        <Col md={6}><strong>Description:</strong></Col>
        <Col md={6}>{listing.description || '—'}</Col>
      </Row>

      {listing.mapUrl && (
        <Row className="mb-4">
          <Col>
            <strong>Map Location:</strong>
            <div className="mt-2">
              <iframe
                src={listing.mapUrl}
                width="100%"
                height="250"
                style={{ border: 0 }}
                allowFullScreen=""
                loading="lazy"
                title="Location Map"
              ></iframe>
            </div>
          </Col>
        </Row>
      )}
{console.log(listing.photos)}
       {listing.photos && listing.photos.length > 0 && (
  <div className="mb-4">
    <strong>Uploaded Photos:</strong>
    <Row className="mt-2">
      {listing.photos.map((photo, index) => (
        <Col key={index} xs={6} md={4} lg={3} className="mb-3">
          <Image
            src={`${API_BASE}${photo}`} // dynamic URL
            thumbnail
            fluid
          />
        </Col>
      ))}
    </Row>
  </div>
)}


      <Button variant="secondary" onClick={() => navigate(-1)}>
        Go Back
      </Button>
    </Container>
  );
};

export default ViewListing;
