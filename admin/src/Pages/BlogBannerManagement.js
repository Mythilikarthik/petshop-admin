import React, { useState, useEffect, useRef } from 'react'
import { Container, Row, Col, Breadcrumb, Form, Button } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import useUnsavedChanges from "../Hooks/useUnsavedChanges";
const API_BASE = process.env.NODE_ENV === "production"
    ? "https://petshop-admin.onrender.com"
    : "http://localhost:5000";

const BlogBannerManagement = () => {
  const fileInputRef = useRef(null);
  const [formData, setFormData] = useState({
    banner: null,
  });
      const [banner, setBanner] = useState(null);
  const [bannerPreview, setBannerPreview] = useState(null);
  const navigate = useNavigate();

  const { shouldBlockNavigation, confirmLeave, markAsSaved } = useUnsavedChanges(formData);
  const handleBannerChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
  
    const img = new window.Image(); // ✅ IMPORTANT
    img.src = URL.createObjectURL(file);
  
    img.onload = () => {
      if (img.width === 1200 && img.height === 300) {
        setBanner(file);
        setBannerPreview(img.src);
        setFormData({ banner: file });
      } else {
        alert(`${file.name} rejected ❌\nImage must be exactly 1200 × 300`);
        e.target.value = "";
      }
    };
  };
  const handleGoBack = () => {
    if (!confirmLeave()) return; // user canceled
      navigate(-1);
    };
    const handleSubmit = async (e) => {
  e.preventDefault();

  if (!banner) return alert("Please select banner");

  try {
    const formData = new FormData();
    formData.append("banner", banner);

    const res = await fetch(`${API_BASE}/api/blog-banner`, {
      method: "POST",
      body: formData,
    });

    if (!res.ok) throw new Error("Upload failed");

    markAsSaved();
    alert("Banner saved successfully");
    fileInputRef.current.value="";
  } catch (err) {
    alert("Something went wrong");
  }
};



  useEffect(() => {
  const fetchBanner = async () => {
    const res = await fetch(`${API_BASE}/api/blog-banner`);
    const data = await res.json();

    if (data.banner) {
      setBannerPreview(data.banner.banner);
    }
  };

  fetchBanner();
}, []);
const handleDelete = async () => {
  if (!window.confirm("Are you sure you want to delete this banner?")) return;

  try {
    const res = await fetch(`${API_BASE}/api/blog-banner/delete`, {
      method: "DELETE",
    });

    if (!res.ok) throw new Error("Delete failed");

    setBanner(null);
    setBannerPreview(null);
    setFormData({ banner: null });
    fileInputRef.current.value="";
    markAsSaved();
    alert("Banner deleted successfully");
    
  } catch (err) {
    alert("Failed to delete banner");
  }
};


  return (
    <Container className="mt-4">
      <div className="pl-3 pr-3">
        <Row className="mb-3 justify-content-end align-items-center">
          <Col>
            <h2 className="main-title mb-0">
              {bannerPreview ? "Edit Blog Banner" : "Add Blog Banner"}
            </h2>
            <Breadcrumb className="top-breadcrumb">
              <Breadcrumb.Item href="/">Home</Breadcrumb.Item>
              <Breadcrumb.Item active>{bannerPreview ? "Edit Blog Banner" : "Add Blog Banner"}</Breadcrumb.Item>
            </Breadcrumb>
          </Col>
          <Col xs="auto">            
            <Button variant="secondary" onClick={handleGoBack}>
              Go Back
            </Button>
          </Col>
        </Row>
        <div className="form-container">
          <Form onSubmit={handleSubmit}>            
            <Form.Group className="mb-4">
              <Form.Label>Banner Image (1200 × 300)</Form.Label>
              <Form.Control
                type="file"
                accept="image/jpeg,image/png,image/webp"
                onChange={handleBannerChange}
                ref={fileInputRef}
              />
            </Form.Group>
            {bannerPreview && (
              <img
                src={bannerPreview}
                alt="Banner Preview"
                style={{
                  width: "100%",
                  height: "300px",
                  objectFit: "contain", // ✅ NO CUT, NO SHARP
                  background: "#f5f5f5",
                  borderRadius: "8px",
                }}
              />
            )}
            <div className="d-flex gap-2">
              <Button variant="primary" type="submit">
                Save
              </Button>

              {bannerPreview && (
                <Button variant="danger" onClick={handleDelete}>
                  Delete
                </Button>
              )}
            </div>

          </Form>
        </div>
      </div>
    </Container>
  );
};

export default BlogBannerManagement