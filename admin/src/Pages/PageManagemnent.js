import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Form, Button, Container, Row, Col, Breadcrumb } from 'react-bootstrap';
import Select from "react-select";
import ParaEditor from '../Layout/ParaEditor';

const PageManagement = () => {
  const { state } = useLocation();
  const navigate = useNavigate();
  const { listing } = state || {};

  const [formData, setFormData] = useState({
    shopName: listing?.name || '',
    email: listing?.email || '',
    address: listing?.address || '',
    city: listing?.city || '',
    country: listing?.country || '',
    mapUrl: listing?.mapUrl || '',
    description: listing?.description || '',
    para: listing?.para || '',        
    paraWordCount: 0,                 
    photos: []
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (formData.paraWordCount < 100 || formData.paraWordCount > 400) {
      alert("One Para Content must be between 100 and 400 words.");
      return;
    }
    console.log('Submitted data:', formData);
    alert('Changes saved successfully!');
    navigate('/business-listing');
  };

  const pageList = ["Pet Shop", "Pet Food", "Services", "Pet Insurance"];
  const categoryList = ["Pet Shop", "Pet Food", "Services", "Pet Insurance"];
  const cityList = ["Erode", "Chennai", "Coimbatore", "Salem"];

  return (
    <Container className="mt-4">
      <div className='pl-3 pr-3'>
        <Row className='mb-3 justify-content-end align-items-center'>
          <Col>
            <h2 className='main-title mb-0'>Page Management</h2>
          </Col>
          <Col xs={'auto'}>
            <Breadcrumb className='top-breadcrumb'>
              <Breadcrumb.Item href="#">Home</Breadcrumb.Item>
              <Breadcrumb.Item active>Page Management</Breadcrumb.Item>
            </Breadcrumb>
          </Col>
        </Row>
        
        <div className='form-container'>
          <Form onSubmit={handleSubmit}>
            
            {/* Page Dropdown */}
            <Form.Group className="mb-3">
              <Form.Label>Page</Form.Label>
              <Form.Select
                name="page"
                value={formData.page || ""}
                onChange={handleChange}
                required
              >
                <option value="">-- Select Page --</option>
                {pageList.map((element, index) => (
                  <option key={index} value={element}>{element}</option>
                ))}
              </Form.Select>
            </Form.Group>

            {/* Category Multi-select */}
            <Form.Group className="mb-3">
              <Form.Label>Category</Form.Label>
              <Select
                isMulti
                options={categoryList.map((c) => ({ value: c, label: c }))}
                value={(formData.categories || []).map((c) => ({ value: c, label: c }))}
                onChange={(selected) =>
                  setFormData((prev) => ({
                    ...prev,
                    categories: selected.map((s) => s.value),
                  }))
                }
              />
            </Form.Group>

            {/* City Dropdown */}
            <Form.Group className="mb-3">
              <Form.Label>City</Form.Label>
              <Form.Select 
                name="city" 
                value={formData.city} 
                onChange={handleChange} 
                required
              >
                <option value="">--Select City--</option>
                {cityList.map((element, index)=> (
                  <option key={index} value={element}>{element}</option>
                ))}
              </Form.Select>
            </Form.Group>

            {/* Page Title */}
            <Form.Group className='mb-4'>
              <Form.Label>Page Title</Form.Label>
              <Form.Control 
                type='text' 
                name='metaName' 
                value={formData.metaName || ""} 
                required 
                onChange={handleChange} 
              />
            </Form.Group>

            {/* Meta Keyword */}
            <Form.Group className='mb-4'>
              <Form.Label>Meta Keyword</Form.Label>
              <Form.Control 
                type='text' 
                name='metaWord' 
                value={formData.metaWord || ""} 
                required 
                onChange={handleChange} 
              />
            </Form.Group>

            {/* Meta Description */}
            <Form.Group className='mb-4'>
              <Form.Label>Meta Description</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                name="description"
                value={formData.description}
                onChange={handleChange}
              />
            </Form.Group>

            {/* One Para Content with Editor */}
            <Form.Group className='mb-4'>
              <Form.Label>One Para Content</Form.Label>
              <ParaEditor
                value={formData.para}
                onChange={(html, wordCount) =>
                  setFormData((prev) => ({
                    ...prev,
                    para: html,
                    paraWordCount: wordCount
                  }))
                }
              />
              <div style={{ fontSize: "14px", marginTop: "5px" }}>
                Word count:{" "}
                <strong
                  style={{
                    color:
                      !formData.paraWordCount ||
                      formData.paraWordCount < 100 ||
                      formData.paraWordCount > 400
                        ? "red"
                        : "green",
                  }}
                >
                  {formData.paraWordCount || 0}
                </strong>{" "}
                / 400
              </div>
            </Form.Group>

            <Button
              variant="primary"
              type="submit"
              disabled={
                !formData.paraWordCount ||
                formData.paraWordCount < 100 ||
                formData.paraWordCount > 400
              }
            >
              Save
            </Button>
          </Form>
        </div>
      </div>
    </Container>
  );
};

export default PageManagement;
