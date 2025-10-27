import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Form, Button, Container, Row, Col, Breadcrumb } from 'react-bootstrap';
import Select from 'react-select';

const API_BASE =
  process.env.NODE_ENV === "production"
    ? "https://petshop-admin.onrender.com"
    : "http://localhost:5000";

const AddCategory = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    categoryName: '',
    description: '',
    metaTitle: '',
    metaKeyword: '',
    metaDescription: '',
    petCategories: [] // <-- Added field
  });

  const [petCategoryList, setPetCategoryList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // 🐾 Fetch available pet categories
  useEffect(() => {
    const fetchPetCategories = async () => {
      try {
        const res = await fetch(`${API_BASE}/api/pet-category`);
        const data = await res.json();
        if (data.success) {
          setPetCategoryList(
            data.petCategories.map((c) => ({ value: c._id, label: c.categoryName }))
          );
        }
      } catch (err) {
        console.error("Error loading pet categories", err);
      }
    };
    fetchPetCategories();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handlePetCategoryChange = (selected) => {
    setFormData((prev) => ({
      ...prev,
      petCategories: selected.map((s) => s.value)
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const res = await fetch(`${API_BASE}/api/category/add`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || 'Failed to add category');
      }

      setSuccess('Category added successfully!');
      setFormData({
        categoryName: '',
        description: '',
        metaTitle: '',
        metaKeyword: '',
        metaDescription: '',
        petCategories: []
      });

      setTimeout(() => navigate('/category-listing'), 1500);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container className="mt-4">
      <Row className='mb-3 justify-content-end align-items-center'>
        <Col>
          <h2 className='main-title mb-0'>Add Category</h2>
          <Breadcrumb className='top-breadcrumb'>
            <Breadcrumb.Item href="#">Home</Breadcrumb.Item>
            <Breadcrumb.Item active>Add Category</Breadcrumb.Item>
          </Breadcrumb>
        </Col>
        <Col xs={'auto'}>
          <Button variant="secondary" onClick={() => navigate('/category-listing')}>Go Back</Button>
        </Col>
      </Row>

      <div className='form-container'>
        <Form onSubmit={handleSubmit}>
          <Form.Group className="mb-3">
            <Form.Label>Select Pet Categories</Form.Label>
            <Select
              isMulti
              options={petCategoryList}
              value={petCategoryList.filter(opt => formData.petCategories.includes(opt.value))}
              onChange={handlePetCategoryChange}
              placeholder="Choose related pet categories..."
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Category Name</Form.Label>
            <Form.Control type="text" name="categoryName" value={formData.categoryName} onChange={handleChange} required />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Description</Form.Label>
            <Form.Control as="textarea" rows={3} name="description" value={formData.description} onChange={handleChange} />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Meta Title</Form.Label>
            <Form.Control type="text" name="metaTitle" value={formData.metaTitle} onChange={handleChange} required />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Meta Keyword</Form.Label>
            <Form.Control type="text" name="metaKeyword" value={formData.metaKeyword} onChange={handleChange} required />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Meta Description</Form.Label>
            <Form.Control as="textarea" rows={2} name="metaDescription" value={formData.metaDescription} onChange={handleChange} required />
          </Form.Group>

          {error && <p className="text-danger">{error}</p>}
          {success && <p className="text-success">{success}</p>}

          <Button variant="primary" type="submit" disabled={loading}>
            {loading ? 'Saving...' : 'Save'}
          </Button>
        </Form>
      </div>
    </Container>
  );
};

export default AddCategory;
