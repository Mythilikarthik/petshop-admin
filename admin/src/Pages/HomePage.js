import React, { useState, useEffect } from "react";
import { Form, Button, Container, Row, Col, Breadcrumb } from "react-bootstrap";
import "./Css/HomePage.css"

const API_BASE =
  process.env.NODE_ENV === "production"
    ? "https://petshop-admin.onrender.com"
    : "http://localhost:5000";

const HomePage = () => {
  const [formData, setFormData] = useState({
    bannerTitle: "",
    bannerSubtitle: "",
    LoginTitle: "",
    LoginDescription: "",
    NewsletterTitle: "",
    NewsletterDescription: "",
    metaTitle: "",
    metaDescription: "",
  });

  
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetch(`${API_BASE}/api/home-page`)
      .then(res => res.json())
      .then(data => {
        if (data.success && data.home) setFormData(data.home);
      })
      .catch(err => console.error(err));
  }, []);

  const handleChange = e => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  
  const handleSubmit = async e => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/api/home-page`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (data.success) alert("Homepage updated!");
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container className="mt-4">
      <div className='pl-3 pr-3'>
        <Row className="mb-3 justify-content-end align-items-center">
          <Col>
            <h2 className="main-title mb-0">
              Home Page
            </h2>
            <Breadcrumb className="top-breadcrumb">
              <Breadcrumb.Item href="/">Home</Breadcrumb.Item>
              <Breadcrumb.Item active>
                Home Page
              </Breadcrumb.Item>
            </Breadcrumb>
          </Col>
          <Col xs="auto">
            
            
          </Col>
        </Row>
        <div className="form-container">
          
            <Form onSubmit={handleSubmit}>
              <h6 className="mb-3 title-bg-style">Banner Section</h6>
        <Form.Group className="mb-3">
          <Form.Label>Banner Title</Form.Label>
          <Form.Control
            type="text"
            name="bannerTitle"
            value={formData.bannerTitle}
            onChange={handleChange}
          />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Banner Subtitle</Form.Label>
          <Form.Control
            type="text"
            name="bannerSubtitle"
            value={formData.bannerSubtitle}
            onChange={handleChange}
          />
        </Form.Group>
        
<h6 className="mb-3 title-bg-style">Login Section</h6>
        <Form.Group className="mb-3">
          <Form.Label>Title</Form.Label>
          <Form.Control
            type="text"
            name="loginTitle"
            value={formData.loginTitle}
            onChange={handleChange}
          />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Content</Form.Label>
          <Form.Control
            as="textarea"
            rows={3}
            name="loginDescription"
            value={formData.loginDescription}
            onChange={handleChange}
          />
        </Form.Group>
        <h6 className="mb-3 title-bg-style">Newsletter Section</h6>
        <Form.Group className="mb-3">
          <Form.Label>Title</Form.Label>
          <Form.Control
            type="text"
            name="newsletterTitle"
            value={formData.newsletterTitle}
            onChange={handleChange}
          />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Content</Form.Label>
          <Form.Control
            as="textarea"
            rows={3}
            name="newsletterDescription"
            value={formData.newsletterDescription}
            onChange={handleChange}
          />
        </Form.Group>

        <h6 className="mb-3 title-bg-style">SEO Information</h6>

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
          <Form.Label>Meta Description</Form.Label>
          <Form.Control
            as="textarea"
            rows={2}
            name="metaDescription"
            value={formData.metaDescription}
            onChange={handleChange}
          />
        </Form.Group>

        <Button type="submit" variant="primary" disabled={loading}>
          {loading ? "Saving..." : "Save Changes"}
        </Button>
      </Form>
        </div>
    </div>
    </Container>
    
  );
};

export default HomePage;
