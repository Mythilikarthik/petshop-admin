import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  Form,
  Button,
  Container,
  Row,
  Col,
  Image,
  Breadcrumb,
} from "react-bootstrap";

const AdManagemnent = () => {
  const { state } = useLocation();
  const navigate = useNavigate();

  const { listing } = state || {};

  const [formData, setFormData] = useState({
    category: "",
    city: "",
    position: "",
    slideInterval: 3, // seconds
    maxImage: 3, 
    banners: [], // [{ file, url, preview }]
  });

  // Temp fields for adding banner
  const [bannerFile, setBannerFile] = useState(null);
  const [bannerUrl, setBannerUrl] = useState("");

  const categoryList = ["Pet Shop", "Pet Food", "Services", "Pet Insurance"];
  const cityList = ["Erode", "Chennai", "Coimbatore", "Salem"];

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Handle temp file upload
  const handleBannerFile = (e) => {
    const file = e.target.files[0];
    if (file) {
      setBannerFile(file);
    }
  };

  // Add banner to list
  const handleAddBanner = () => {
    if (!bannerFile || !bannerUrl) {
      alert("Please select an image and enter URL");
      return;
    }

    if (formData.banners.length >= 3) {
      alert("Maximum 3 banners allowed.");
      return;
    }

    const newBanner = {
      file: bannerFile,
      url: bannerUrl,
      preview: URL.createObjectURL(bannerFile),
    };

    setFormData((prev) => ({
      ...prev,
      banners: [...prev.banners, newBanner],
    }));

    // Reset fields
    setBannerFile(null);
    setBannerUrl("");
  };

  // Remove banner
  const handleRemoveBanner = (index) => {
    setFormData((prev) => {
      const updated = [...prev.banners];
      updated.splice(index, 1);
      return { ...prev, banners: updated };
    });
  };

  // Submit
  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Final submitted data:", formData);
    alert("Ad banners saved successfully!");
    navigate("/business-listing");
  };

  return (
    <Container className="mt-4">
      <div className="pl-3 pr-3">
        <Row className="mb-3 justify-content-end align-items-center">
          <Col>
            <h2 className="main-title mb-0">Custom Ad</h2>
          </Col>
          <Col xs={"auto"}>
            <Breadcrumb className="top-breadcrumb">
              <Breadcrumb.Item href="#">Home</Breadcrumb.Item>
              <Breadcrumb.Item active>Custom Ad</Breadcrumb.Item>
            </Breadcrumb>
          </Col>
        </Row>

        <div className="form-container">
          <Form onSubmit={handleSubmit}>
            
            {/* Slide Interval */}
            <Form.Group className="mb-3">
              <Form.Label>Slide Interval (seconds)</Form.Label>
              <Form.Control
                type="number"
                name="slideInterval"
                min="1"
                value={formData.slideInterval}
                onChange={handleChange}
                required
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Max.Images</Form.Label>
              <Form.Control
                type="number"
                name="maxImage"
                min="1"
                value={formData.maxImage}
                onChange={handleChange}
                required
              />
            </Form.Group>

            <Button variant="primary" type="submit">
              Save
            </Button>
          </Form>
        </div>
      </div>
    </Container>
  );
};

export default AdManagemnent;
