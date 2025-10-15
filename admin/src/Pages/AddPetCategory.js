import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Form, Button, Container, Row, Col, Breadcrumb } from 'react-bootstrap';

const API_BASE =
  process.env.NODE_ENV === "production"
    ? "https://petshop-admin.onrender.com"
    : "http://localhost:5000";

const AddPetCategory = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    categoryName: '',
    description: '',
    metaTitle: '',
    metaKeyword: '',
    metaDescription: ''
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const res = await fetch(`${API_BASE}/api/pet-category/add`, {
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
        metaDescription: ''
      });

      // Optional: redirect after success
      setTimeout(() => navigate('/pet-category-listing'), 1500);
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
          <h2 className='main-title mb-0'>Add Pet Category</h2>
        </Col>
        <Col xs={'auto'}>
          <Breadcrumb className='top-breadcrumb'>
            <Breadcrumb.Item href="#">Home</Breadcrumb.Item>
            <Breadcrumb.Item active>Add Pet Category</Breadcrumb.Item>
          </Breadcrumb>
        </Col>
      </Row>

      <div className='form-container'>
        <Form onSubmit={handleSubmit}>
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

          <Form.Group className="mb-3">
            <Form.Label>Category Name</Form.Label>
            <Form.Control type="text" name="categoryName" value={formData.categoryName} onChange={handleChange} required />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Description</Form.Label>
            <Form.Control as="textarea" rows={3} name="description" value={formData.description} onChange={handleChange} />
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

export default AddPetCategory;
