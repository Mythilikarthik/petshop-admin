import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { Form, Button, Container, Row, Col, Breadcrumb } from 'react-bootstrap';
import Select from "react-select";
import ParaEditor from '../Layout/ParaEditor';
import useUnsavedChanges from '../Hooks/useUnsavedChanges';
const API_BASE = process.env.NODE_ENV === "production" ?
"https://petshop-admin.onrender.com" :
"http://localhost:5000"

const PageManagement = () => {
  // const {id} = useParams();
  const { state } = useLocation();
  const navigate = useNavigate();
  const { listing, id } = state || {};
  const isEdit = !!id; 

  const [formData, setFormData] = useState({
    page: listing?.page || '',
    category: listing?.category || '',
    city: listing?.city || '',
    pageTitle: listing?.pageTitle || '',
    metaKeyword: listing?.metaKeyword || '',
    metaDescription: listing?.metaDescription || '',
    content: listing?.content || '',        
    paraWordCount: 0,                 
    photos: []
  });
  const [categoryList, setCategoryList] = useState([]);
  const [cityList, setCityList] = useState([]);
  const {shouldBlockNavigation, markAsSaved, confirmLeave, resetInitialSnapshot} = useUnsavedChanges(formData);
  const [loading, setLoading] = useState(true)

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
  e.preventDefault();
  if (formData.paraWordCount < 0 || formData.paraWordCount > 400) {
    alert("One Para Content must be between 0 and 400 words.");
    return;
  }

  try {
    const method = isEdit ? "PATCH" : "POST";
    const url = isEdit
      ? `${API_BASE}/api/custom-page/${id}`
      : `${API_BASE}/api/custom-page`;

    const req = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData),
    });

    const data = await req.json();
    console.log(data);

    if (data.success) {
      alert("Changes saved successfully!");
      markAsSaved();
      navigate("/custom-pages");
    } else {
      alert(data.message || "Failed to save changes.");
    }
  } catch (err) {
    console.error("Error: ", err);
  }
};

  

//   const pageList = ["Pet Shop", "Pet Food", "Services", "Pet Insurance"];
//   const categoryList = ["Pet Shop", "Pet Food", "Services", "Pet Insurance"];
//   const cityList = ["Erode", "Chennai", "Coimbatore", "Salem"];
const fetchCategories = async () => {
    try {
        const res = await fetch(`${API_BASE}/api/category`);
        const data = await res.json();
        if(data.success  && Array.isArray(data.categories)) {
            setCategoryList(data.categories.map(c => c.categoryName));
        }
    } catch(err) {
        console.error("Error: " , err);

    }        
}
const fetchCities = async () => {
    try{
        const res = await fetch(`${API_BASE}/api/city`);
        const data = await res.json();
        if(data.success && Array.isArray(data.cities)) {
            setCityList(data.cities.map(c => c.city));
        }
    } catch(err) {
        console.error("Error:", err);
    }
}
useEffect(()=> {
    fetchCategories();
    fetchCities();
}, [])
useEffect(() => {
  if (isEdit) {
    const fetchPageData = async () => {
      try {
        const res = await fetch(`${API_BASE}/api/custom-page/${id}`);
        const data = await res.json();
        

        if (data.success && data.page) {
          const content = data.page.content || '';
          const wordCount = content
            ? content.replace(/<[^>]+>/g, '') 
                    .split(/\s+/)
                    .filter(Boolean).length
            : 0;
          setFormData({
            page: data.page.page || '',
            category: data.page.category || [],
            city: data.page.city || '',
            pageTitle: data.page.pageTitle || '',
            metaKeyword: data.page.metaKeyword || '',
            metaDescription: data.page.metaDescription || '',
            content: data.page.content || '',
            paraWordCount: wordCount || 0,
            photos: data.page.photos || []
          });          
        } else {
          alert("Failed to load page data");
        }
      } catch (err) {
        console.error("Error loading page:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchPageData();
  }
}, [id, isEdit]);
useEffect(() => {
  if (!loading) {
    resetInitialSnapshot();
  }
}, [loading]);

const handleGoBack = () => {
  if (!confirmLeave()) return;
  navigate(-1);
}

  return (
    <Container className="mt-4">
      <div className='pl-3 pr-3'>
        <Row className="mb-3 justify-content-end align-items-center">
          <Col>
            <h2 className="main-title mb-0">
              {isEdit ? "Edit Page" : "New Page"}
            </h2>
            <Breadcrumb className="top-breadcrumb">
              <Breadcrumb.Item href="/">Home</Breadcrumb.Item>
              <Breadcrumb.Item active>
                {isEdit ? "Edit Page" : "New Page"}
              </Breadcrumb.Item>
            </Breadcrumb>
          </Col>
          <Col xs="auto">
            
            <Button variant="secondary" onClick={handleGoBack}>
                    Go Back
                  </Button>
          </Col>
        </Row>
        
        <div className='form-container'>
          <Form onSubmit={handleSubmit}>
            
            {/* Page Dropdown */}
            {/* <Form.Group className="mb-3">
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
            </Form.Group> */}
            <Form.Group className="mb-3">
              <Form.Label>Page</Form.Label>
              <Form.Control 
                type='text' 
                name='page' 
                value={formData.page || ""} 
                required 
                onChange={handleChange} 
              />
            </Form.Group>

            {/* Category Multi-select */}
            <Form.Group className="mb-3">
              <Form.Label>Category <span className='text-muted'>[Optional]</span></Form.Label>
              <Select
                isMulti
                options={categoryList.map((c) => ({ value: c, label: c }))}
                name='category'
                value={(formData.category || []).map((c) => ({ value: c, label: c }))}
                onChange={(selected) =>
                  setFormData((prev) => ({
                    ...prev,
                    category: selected.map((s) => s.value),
                  }))
                }
              />
            </Form.Group>

            {/* City Dropdown */}
            <Form.Group className="mb-3">
              <Form.Label>City <span className='text-muted'>[Optional]</span></Form.Label>
              <Form.Select 
                name="city" 
                value={formData.city} 
                onChange={handleChange} 
                
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
                name='pageTitle' 
                value={formData.pageTitle || ""} 
                required 
                onChange={handleChange} 
              />
            </Form.Group>

            {/* Meta Keyword */}
            <Form.Group className='mb-4'>
              <Form.Label>Meta Keyword</Form.Label>
              <Form.Control 
                type='text' 
                name='metaKeyword' 
                value={formData.metaKeyword || ""} 
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
                name="metaDescription"
                value={formData.metaDescription}
                onChange={handleChange}
              />
            </Form.Group>

            {/* One Para Content with Editor */}
            <Form.Group className='mb-4'>
              <Form.Label>One Para Content</Form.Label>
              <ParaEditor
                value={formData.content}
                onChange={(html, wordCount) =>
                  setFormData((prev) => ({
                    ...prev,
                    content: html,
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
