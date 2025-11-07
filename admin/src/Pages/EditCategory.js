import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Form, Button, Container, Row, Col, Breadcrumb } from 'react-bootstrap';
import Select from 'react-select';

const API_BASE =
  process.env.NODE_ENV === "production"
    ? "https://petshop-admin.onrender.com"
    : "http://localhost:5000";

const EditCategory = () => {
  const navigate = useNavigate();
  const { state } = useLocation();
  const { listing } = state || {}; // category object passed from listing page

  const [formData, setFormData] = useState({
    categoryName: '',
    description: '',
    metaTitle: '',
    metaKeyword: '',
    metaDescription: '',
    petCategories: [],
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [petCategoryList, setPetCategoryList] = useState([]);

  // Fetch pet categories for dropdown
  useEffect(() => {
    const fetchPetCategories = async () => {
      try {
        const res = await fetch(`${API_BASE}/api/pet-category`);
        const data = await res.json();
        if (data.success) {
          setPetCategoryList(
            data.petCategories.map(c => ({
              value: c._id,
              label: c.categoryName,
            }))
          );
        }
      } catch (err) {
        console.error("Error loading pet categories:", err);
      }
    };
    fetchPetCategories();
  }, []);

  // Preload category data
  useEffect(() => {
  if (listing) {
    setFormData({
      categoryName: listing.categoryName || '',
      description: listing.description || '',
      metaTitle: listing.metaTitle || '',
      metaKeyword: listing.metaKeyword || '',
      metaDescription: listing.metaDescription || '',
      petCategories: Array.isArray(listing.petCategories)
        ? listing.petCategories.map(cat =>
            typeof cat === 'object' ? cat._id : cat
          )
        : [],
    });
  }
}, [listing]);


  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handlePetCategoryChange = (selected) => {
    setFormData(prev => ({
      ...prev,
      petCategories: selected ? selected.map(s => s.value) : [],
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    if (!listing?._id) {
      setError('Invalid category ID');
      setLoading(false);
      return;
    }

    try {
      const res = await fetch(`${API_BASE}/api/category/${listing._id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.message || 'Failed to update category');
      }

      setSuccess('Category updated successfully!');
      setTimeout(() => navigate('/category-listing'), 1500);
    } catch (err) {
      console.error("Update error:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container className="mt-4">
      <Row className="mb-3 justify-content-between align-items-center">
        <Col>
          <h2 className="main-title mb-0">Edit Category</h2>
          <Breadcrumb className="top-breadcrumb">
            <Breadcrumb.Item href="#">Home</Breadcrumb.Item>
            <Breadcrumb.Item active>Edit Category</Breadcrumb.Item>
          </Breadcrumb>
        </Col>
        <Col xs="auto">
          <Button variant="secondary" onClick={() => navigate(-1)}>
            Go Back
          </Button>
        </Col>
      </Row>

      <div className="form-container">
        <Form onSubmit={handleSubmit}>
          <Form.Group className="mb-3">
            <Form.Label>Select Pet Categories</Form.Label>
            <Select
              isMulti
              options={petCategoryList}
              value={petCategoryList.filter(opt =>
                formData.petCategories.includes(opt.value)
              )}
              onChange={handlePetCategoryChange}
              placeholder="Choose related pet categories..."
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

          <Form.Group className="mb-3">
            <Form.Label>Meta Title</Form.Label>
            <Form.Control
              type="text"
              name="metaTitle"
              value={formData.metaTitle}
              onChange={handleChange}
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Meta Keyword</Form.Label>
            <Form.Control
              type="text"
              name="metaKeyword"
              value={formData.metaKeyword}
              onChange={handleChange}
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Meta Description</Form.Label>
            <Form.Control
              as="textarea"
              rows={2}
              name="metaDescription"
              value={formData.metaDescription}
              onChange={handleChange}
            />
          </Form.Group>

          

          {error && <p className="text-danger">{error}</p>}
          {success && <p className="text-success">{success}</p>}

          <Button variant="primary" type="submit" disabled={loading}>
            {loading ? 'Saving...' : 'Save Changes'}
          </Button>
        </Form>
      </div>
    </Container>
  );
};

export default EditCategory;
