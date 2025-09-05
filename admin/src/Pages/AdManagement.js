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
import Select from "react-select";

const AdManagemnent = () => {
  const { state } = useLocation();
  const navigate = useNavigate();

  const { listing } = state || {};

  const [formData, setFormData] = useState({
    category: "",
    city: "",
    position: "",
    slideInterval: 3, // seconds
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
            <h2 className="main-title mb-0">Ad Management</h2>
          </Col>
          <Col xs={"auto"}>
            <Breadcrumb className="top-breadcrumb">
              <Breadcrumb.Item href="#">Home</Breadcrumb.Item>
              <Breadcrumb.Item active>Ad Management</Breadcrumb.Item>
            </Breadcrumb>
          </Col>
        </Row>

        <div className="form-container">
          <Form onSubmit={handleSubmit}>
            {/* Category */}
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

            {/* City */}
            <Form.Group className="mb-3">
              <Form.Label>City</Form.Label>
              <Form.Select
                name="city"
                value={formData.city}
                onChange={handleChange}
                required
              >
                <option value="">-- Select City --</option>
                {cityList.map((element, index) => (
                  <option key={index} value={element}>
                    {element}
                  </option>
                ))}
              </Form.Select>
            </Form.Group>

            {/* Ad Position */}
            <Form.Group className="mb-3">
              <Form.Label>Ad Position</Form.Label>
              <Form.Select
                name="position"
                value={formData.position}
                onChange={handleChange}
                required
              >
                <option value="">-- Select Position --</option>
                <option value="top">Top</option>
                <option value="middle">Middle</option>
                <option value="bottom">Bottom</option>
              </Form.Select>
            </Form.Group>

            

            {/* Banner Upload */}
            <Row className="mb-3">
              <Col md={6}>
                <Form.Group>
                  <Form.Label>Banner Image</Form.Label>
                  <Form.Control
                    type="file"
                    accept="image/*"
                    onChange={handleBannerFile}
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group>
                  <Form.Label>Banner URL</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="https://example.com"
                    value={bannerUrl}
                    onChange={(e) => setBannerUrl(e.target.value)}
                  />
                </Form.Group>
              </Col>
              
            </Row>

            
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
