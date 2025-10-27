import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Form, Button, Container, Row, Col, Image, Breadcrumb } from 'react-bootstrap';
import Select from "react-select";

const API_BASE =
  process.env.NODE_ENV === "production"
    ? "https://petshop-admin.onrender.com"
    : "http://localhost:5000";

const EditListing = () => {
  const { state } = useLocation();
  const navigate = useNavigate();
  const { id } = state || {};

  const [loading, setLoading] = useState(true);
  const [listing, setListing] = useState(null);
  const [categoryList, setCategoryList] = useState([]);
  const [petCategoryList, setPetCategoryList] = useState([]);
  const [previewUrls, setPreviewUrls] = useState([]);
  const [newKeyword, setNewKeyword] = useState("");
  const [cityList, setCityList] = useState([]);
  const [formData, setFormData] = useState({
    shopName: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    country: '',
    mapUrl: '',
    description: '',
    categories: [],
    petCategories: [],
    photos: [],
    existingPhotos: [],
    metaTitle: '',
    metaKeyword: '',
    metaDescription: '',
    status: false,
  });

  // ✅ Fetch categories and pet categories
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

    const fetchPetCategories = async () => {
      try {
        const res = await fetch(`${API_BASE}/api/pet-category`);
        const data = await res.json();
        if (data.success) setPetCategoryList(data.petCategories.map(c => c.categoryName));
      } catch (err) {
        console.error("Error fetching pet categories:", err);
      }
    };
    const fetchCityList = async () => {
      try {
        const res = await fetch(`${API_BASE}/api/city`, {
          method: 'GET',
          headers: { 'Content-Type': 'application/json' },
        }); 
        const data = await res.json();
        if (data.success) {
          setCityList(data.cities.map(c => c.city));
        }
      } catch (err) {
        console.error("Error fetching cities:", err);
      }
    };

    fetchCategories();
    fetchPetCategories();
    fetchCityList();
  }, []);

  // ✅ Fetch listing by ID
  useEffect(() => {
    if (!id) return;

    const fetchListing = async () => {
      try {
        const res = await fetch(`${API_BASE}/api/listing/${id}`);
        const data = await res.json();

        if (res.ok && data.success) {
          setListing(data.listing);

          setFormData({
            shopName: data.listing.shopName || '',
            email: data.listing.email || '',
            phone: data.listing.phone || '',
            address: data.listing.address || '',
            city: data.listing.city || '',
            country: data.listing.country || '',
            mapUrl: data.listing.mapUrl || '',
            description: data.listing.description || '',
            categories: data.listing.categories || [],
            petCategories: data.listing.petCategories || [],
            photos: [],
            existingPhotos: data.listing.photos || [],
            metaTitle: data.listing.metaTitle || '',
            metaKeyword: data.listing.metaKeyword
              ? (
                  Array.isArray(data.listing.metaKeyword)
                    ? data.listing.metaKeyword.flatMap(k => k.split(',').map(x => x.trim()))
                    : data.listing.metaKeyword.split(',').map(k => k.trim())
                )
              : [],
            metaDescription: data.listing.metaDescription || '',
            status: data.listing.status === 'approved'
          });
        } else {
          alert('Failed to fetch listing');
          navigate('/business-listing');
        }
      } catch (err) {
        console.error('Error fetching listing:', err);
        alert('Error fetching listing');
        navigate('/business-listing');
      } finally {
        setLoading(false);
      }
    };

    fetchListing();
  }, [id, navigate]);

  if (!id) {
    return <p className="text-danger text-center mt-4">No listing ID provided.</p>;
  }

  if (loading) {
    return <p className="text-center mt-4">Loading listing details...</p>;
  }

  if (!listing) {
    return <p className="text-danger text-center mt-4">Listing not found.</p>;
  }

  // ✅ Handlers
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

  const handlePetCategoryChange = (selected) => {
    setFormData(prev => ({
      ...prev,
      petCategories: selected ? selected.map(s => s.value) : []
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

  // ✅ Keyword Handlers
  const handleAddKeyword = (e) => {
    e.preventDefault();
    if (newKeyword.trim() && !formData.metaKeyword.includes(newKeyword.trim())) {
      setFormData(prev => ({
        ...prev,
        metaKeyword: [...prev.metaKeyword, newKeyword.trim()]
      }));
      setNewKeyword("");
    }
  };

  const handleRemoveKeyword = (keyword) => {
    setFormData(prev => ({
      ...prev,
      metaKeyword: prev.metaKeyword.filter(k => k !== keyword)
    }));
  };

  // ✅ Submit
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
      formDataToSend.append('metaKeyword', formData.metaKeyword.join(','));
      formDataToSend.append('metaDescription', formData.metaDescription);
      formDataToSend.append('status', formData.status ? 'approved' : 'pending');

      formData.categories.forEach(cat => formDataToSend.append('categories[]', cat));
      formData.petCategories.forEach(cat => formDataToSend.append('petCategories[]', cat));

      formData.photos.forEach(photo => formDataToSend.append('photos', photo));
      formData.existingPhotos.forEach(photo => formDataToSend.append('existingPhotos[]', photo));

      const res = await fetch(`${API_BASE}/api/listing/${id}`, {
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

  // ✅ Render form
  return (
    <Container className="mt-4">
      <div className='pl-3 pr-3'>
        <Row className="mb-3 justify-content-end align-items-center">
          <Col>
            <h2 className="main-title mb-0">Edit Listing</h2>
            <Breadcrumb className="top-breadcrumb">
              <Breadcrumb.Item href="/">Home</Breadcrumb.Item>
              <Breadcrumb.Item active>Edit Listing</Breadcrumb.Item>
            </Breadcrumb>
          </Col>
          <Col xs="auto">
            <Button variant="secondary" onClick={() => navigate(-1)}>
              Go Back
            </Button>
          </Col>
        </Row>

        <div className='form-container'>
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

            {/* Category Select */}
            <Form.Group className="mb-3">
              <Form.Label>Category <span className="text-danger">*</span></Form.Label>
              <Select
                isMulti
                options={categoryList.map(c => ({ value: c, label: c }))}
                value={(formData.categories || []).map(c => ({ value: c, label: c }))}
                onChange={handleCategoryChange}
              />
            </Form.Group>

            {/* Pet Type Select */}
            <Form.Group className="mb-3">
              <Form.Label>Type <span className="text-danger">*</span></Form.Label>
              <Select
                isMulti
                options={petCategoryList.map(c => ({ value: c, label: c }))}
                value={(formData.petCategories || []).map(c => ({ value: c, label: c }))}
                onChange={handlePetCategoryChange}
              />
            </Form.Group>

            {/* Basic Fields */}
            <Form.Group className="mb-3">
              <Form.Label>Shop Name <span className="text-danger">*</span></Form.Label>
              <Form.Control type="text" name="shopName" value={formData.shopName} onChange={handleChange} required />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Email <span className="text-danger">*</span></Form.Label>
              <Form.Control type="email" name="email" value={formData.email} onChange={handleChange} required />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Phone <span className="text-danger">*</span></Form.Label>
              <Form.Control type="number" name="phone" value={formData.phone} onChange={handleChange} required />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Address</Form.Label>
              <Form.Control type="text" name="address" value={formData.address} onChange={handleChange} />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>City</Form.Label>
              <Form.Control as="select" name="city" value={formData.city} onChange={handleChange}>
                <option value="">--Select City--</option>
                {cityList.map((city, index) => (
                  <option key={index} value={city}>{city}</option>
                ))}
              </Form.Control>
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
                {formData.existingPhotos.map((url, idx) => {
                  const imageUrl = url.startsWith("http")
                    ? url
                    : `${API_BASE}/uploads/listings/${url}`;
                  return (
                    <Col key={idx} xs={6} md={4} lg={3} className="mb-2">
                      <Image src={imageUrl} thumbnail fluid />
                    </Col>
                  );
                })}
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

            {/* Meta Fields */}
            <Form.Group className="mb-3">
              <Form.Label>Meta Title</Form.Label>
              <Form.Control type="text" name="metaTitle" value={formData.metaTitle} onChange={handleChange} />
            </Form.Group>

            {/* ✅ Keyword Tags */}
            <Form.Group className="mb-3">
              <Form.Label>Meta Keywords</Form.Label>

              <div className="d-flex flex-wrap gap-2 mb-2">
                {console.log("Current keywords:", formData.metaKeyword)}
                {formData.metaKeyword.map((keyword, idx) => (
                  <span key={idx} className="badge bg-secondary d-flex align-items-center">
                    {keyword}
                    <Button
                      variant="link"
                      size="sm"
                      className="text-white ms-1 p-0"
                      onClick={() => handleRemoveKeyword(keyword)}
                      style={{ lineHeight: "1" }}
                    >
                      ✕
                    </Button>
                  </span>
                ))}
              </div>

              <div className="d-flex">
                <Form.Control
                  type="text"
                  placeholder="Type a keyword and press Add"
                  value={newKeyword}
                  onChange={(e) => setNewKeyword(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleAddKeyword(e)}
                />
                <Button variant="outline-primary" onClick={handleAddKeyword} className="ms-2">
                  Add
                </Button>
              </div>
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Meta Description</Form.Label>
              <Form.Control as="textarea" rows={3} name="metaDescription" value={formData.metaDescription} onChange={handleChange} />
            </Form.Group>

            <Button variant="primary" type="submit">
              Save Changes
            </Button>
          </Form>
        </div>
      </div>
    </Container>
  );
};

export default EditListing;
