import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Form, Button, Container, Row, Col, Image } from 'react-bootstrap';
import Select from "react-select";

const API_BASE =
  process.env.NODE_ENV === "production"
    ? "https://petshop-admin.onrender.com"
    : "http://localhost:5000";

const EditListing = () => {
  const { state } = useLocation();
  const navigate = useNavigate();
  const { listing } = state || {};

  const [categoryList, setCategoryList] = useState([]);
  const [formData, setFormData] = useState({
    shopName: listing?.shopName || '',
    email: listing?.email || '',
    phone: listing?.phone || '',
    address: listing?.address || '',
    city: listing?.city || '',
    country: listing?.country || '',
    mapUrl: listing?.mapUrl || '',
    description: listing?.description || '',
    categories: listing?.categories || [],
    photos: [],
    existingPhotos: listing?.photos || [],
    metaTitle: listing?.metaTitle || '',
    metaKeyword: listing?.metaKeyword || '',
    metaDescription: listing?.metaDescription || '',
    status: listing?.status === 'approved' // boolean: true = approved, false = pending
  });

  const [previewUrls, setPreviewUrls] = useState([]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await fetch(`${API_BASE}/api/category`);
        const data = await res.json();
        if (data.success) setCategoryList(data.categories.map(c => c.categoryName));
      } catch (err) {
        console.error("Error fetching categories:", err);
      }
    };
    fetchCategories();
  }, []);

  if (!listing) {
    return <p className="text-danger mt-4 text-center">No listing data found.</p>;
  }

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleCategoryChange = (selected) => {
    setFormData(prev => ({
      ...prev,
      categories: selected ? selected.map(s => s.value) : []
    }));
  };

  const handlePhotoChange = (e) => {
    const files = Array.from(e.target.files);
    setFormData(prev => ({
      ...prev,
      photos: files
    }));
    const urls = files.map(file => URL.createObjectURL(file));
    setPreviewUrls(urls);
  };

  const handleStatusToggle = () => {
    setFormData(prev => ({
      ...prev,
      status: !prev.status
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const formDataToSend = new FormData();
      formDataToSend.append('shopName', formData.shopName);
      formDataToSend.append('email', formData.email);
      formDataToSend.append('phone', formData.phone);
      formDataToSend.append('address', formData.address);
      formDataToSend.append('city', formData.city);
      formDataToSend.append('country', formData.country);
      formDataToSend.append('mapUrl', formData.mapUrl);
      formDataToSend.append('description', formData.description);
      formDataToSend.append('metaTitle', formData.metaTitle);
      formDataToSend.append('metaKeyword', formData.metaKeyword);
      formDataToSend.append('metaDescription', formData.metaDescription);
      formDataToSend.append('status', formData.status ? 'approved' : 'pending');

      // Append categories
      formData.categories.forEach(cat => formDataToSend.append('categories[]', cat));

      // Append new photos
      formData.photos.forEach(photo => formDataToSend.append('photos', photo));

      // Append existing photos
      formData.existingPhotos.forEach(photo => formDataToSend.append('existingPhotos[]', photo));

      const res = await fetch(`${API_BASE}/api/listing/${listing._id}`, {
        method: 'PUT',
        body: formDataToSend
      });

      const result = await res.json();
      if (res.ok && result.success) {
        alert("Listing updated successfully!");
        navigate("/business-listing");
      } else {
        alert(result.message || "Failed to update listing");
      }
    } catch (err) {
      console.error(err);
      alert("Error updating listing");
    }
  };

  return (
    <Container className="mt-4">
      <div className='pl-3 pr-3'>
        <h2 className="mb-4">Edit Listing</h2>
        <Form onSubmit={handleSubmit}>
          {/* Status Toggle */}
          <Form.Group className="mb-3">
            <Form.Check
              type="switch"
              id="status-switch"
              label={formData.status ? "Approved" : "Pending"}
              checked={formData.status}
              onChange={handleStatusToggle}
            />
          </Form.Group>

          {/* Categories */}
          <Form.Group className="mb-3">
            <Form.Label>Category</Form.Label>
            <Select
              isMulti
              options={categoryList.map(c => ({ value: c, label: c }))}
              value={(formData.categories || []).map(c => ({ value: c, label: c }))}
              onChange={handleCategoryChange}
            />
          </Form.Group>
          {/* Status */}
          {/* <Form.Group className="mb-3">
            <Form.Label>Status</Form.Label>
            <Form.Select name="status" value={formData.status} onChange={handleChange}>
              <option value="approved">Approved</option>
              <option value="pending">Pending</option>
            </Form.Select>
          </Form.Group> */}

          

          {/* Basic Fields */}
          <Form.Group className="mb-3">
            <Form.Label>Shop Name</Form.Label>
            <Form.Control type="text" name="shopName" value={formData.shopName} onChange={handleChange} required />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Email</Form.Label>
            <Form.Control type="email" name="email" value={formData.email} onChange={handleChange} required />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Phone</Form.Label>
            <Form.Control type="number" name="phone" value={formData.phone} onChange={handleChange} required />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Address</Form.Label>
            <Form.Control type="text" name="address" value={formData.address} onChange={handleChange} />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>City</Form.Label>
            <Form.Control type="text" name="city" value={formData.city} onChange={handleChange} />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Country</Form.Label>
            <Form.Control type="text" name="country" value={formData.country} onChange={handleChange} />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Location Map URL</Form.Label>
            <Form.Control type="url" name="mapUrl" value={formData.mapUrl} onChange={handleChange} />
          </Form.Group>

          {formData.mapUrl && (
            <div className="mb-3">
              <iframe
                src={formData.mapUrl}
                width="100%"
                height="250"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                title="Location Map"
              ></iframe>
            </div>
          )}

          <Form.Group className="mb-3">
            <Form.Label>Description</Form.Label>
            <Form.Control as="textarea" rows={3} name="description" value={formData.description} onChange={handleChange} />
          </Form.Group>

          {/* Photos */}
          <Form.Group className="mb-4">
            <Form.Label>Upload New Photos</Form.Label>
            <Form.Control type="file" name="photos" multiple accept="image/*" onChange={handlePhotoChange} />
          </Form.Group>

          {/* Existing Photo Previews */}
          {formData.existingPhotos.length > 0 && (
            <Row className="mb-3">
              {formData.existingPhotos.map((url, idx) => (
                <Col key={idx} xs={6} md={4} lg={3} className="mb-2">
                  <Image src={`${API_BASE}${url}`} thumbnail fluid />
                </Col>
              ))}
            </Row>
          )}

          {/* New Photo Previews */}
          {previewUrls.length > 0 && (
            <Row className="mb-3">
              {previewUrls.map((url, idx) => (
                <Col key={idx} xs={6} md={4} lg={3} className="mb-2">
                  <Image src={url} thumbnail fluid />
                </Col>
              ))}
            </Row>
          )}

          <Button variant="primary" type="submit">
            Save Changes
          </Button>
        </Form>
      </div>
    </Container>
  );
};

export default EditListing;
