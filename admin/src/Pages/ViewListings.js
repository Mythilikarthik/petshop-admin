import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Container, Row, Col, Image, Button, Spinner, Alert } from 'react-bootstrap';

const API_BASE =
  process.env.NODE_ENV === "production"
    ? "https://petshop-admin.onrender.com"
    : "http://localhost:5000";

const ViewListing = () => {
  const { state } = useLocation();
  const navigate = useNavigate();
  const { id } = state || {};

  const [listing, setListing] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!id) {
      setError("No listing ID provided.");
      setLoading(false);
      return;
    }

    const fetchListing = async () => {
      try {
        const response = await fetch(`${API_BASE}/api/listing/${id}`);
        console.log("Fetch response:", response);

        if (!response.ok) throw new Error("Failed to fetch listing details.");

        const data = await response.json();
        console.log("Fetched data:", data);

        // ✅ Your backend returns { success: true, listing: {...} }
        if (data && data.success && data.listing) {
          setListing(data.listing);
        } else {
          throw new Error("Listing not found in response.");
        }

      } catch (err) {
        console.error(err);
        setError(err.message || "Error loading listing details.");
      } finally {
        setLoading(false);
      }
    };

    fetchListing();
  }, [id]);

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center mt-5">
        <Spinner animation="border" variant="primary" />
      </div>
    );
  }

  if (error) {
    return <Alert variant="danger" className="mt-4 text-center">{error}</Alert>;
  }

  if (!listing) {
    return <p className="text-danger mt-4 text-center">No listing data found.</p>;
  }

  return (
    <Container className="mt-4">
      <h2 className="mb-4">View Listing</h2>

      <Row className="mb-3">
        <Col md={6}><strong>Category:</strong></Col>
        <Col md={6}>{Array.isArray(listing.categories) ? listing.categories.join(', ') : '—'}</Col>
      </Row>

      <Row className="mb-3">
        <Col md={6}><strong>Type:</strong></Col>
        <Col md={6}>{Array.isArray(listing.petCategories) ? listing.petCategories.join(', ') : '—'}</Col>
      </Row>

      <Row className="mb-3">
        <Col md={6}><strong>Shop Name:</strong></Col>
        <Col md={6}>{listing.shopName || '—'}</Col>
      </Row>

      <Row className="mb-3">
        <Col md={6}><strong>Email:</strong></Col>
        <Col md={6}>{listing.email || '—'}</Col>
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
        <Col md={6}><strong>Location:</strong></Col>
        <Col md={6}>{listing.mapUrl || '—'}</Col>
      </Row>

      <Row className="mb-3">
        <Col md={6}><strong>Description:</strong></Col>
        <Col md={6}>{listing.description || '—'}</Col>
      </Row>
      
      <Row className="mb-3">
        <Col md={6}><strong>Meta Title:</strong></Col>
        <Col md={6}>{listing.metaTitle || '—'}</Col>
      </Row>

      <Row className="mb-3">
        <Col md={6}><strong>Meta Keyword:</strong></Col>
        <Col md={6}>{listing.metaKeyword || '—'}</Col>
      </Row>

      <Row className="mb-3">
        <Col md={6}><strong>Meta Description:</strong></Col>
        <Col md={6}>{listing.metaDescription || '—'}</Col>
      </Row>

      <Row className="mb-3">
        <Col md={6}><strong>Status:</strong></Col>
        <Col md={6}>{listing.status === 'approved' ? 'Approved' : 'Pending'}</Col>
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

      {listing.photos && listing.photos.length > 0 && (
        <div className="mb-4">
          <strong>Uploaded Photos:</strong>
          <Row className="mt-2">
            {listing.photos.map((photo, index) => (
              <Col key={index} xs={6} md={4} lg={3} className="mb-3">
                <Image
                  src={`${API_BASE}/uploads/listings/${photo}`}
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
