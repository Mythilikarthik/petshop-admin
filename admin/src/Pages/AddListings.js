import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Form, Button, Container, Row, Col, Image, Breadcrumb } from "react-bootstrap";
import Select from "react-select";

const API_BASE =
  process.env.NODE_ENV === "production"
    ? "https://petshop-admin.onrender.com"
    : "http://localhost:5000";

const AddListing = () => {
  const { state } = useLocation();
  const navigate = useNavigate();
  const { listing } = state || {};

  const [cityList, setCityList] = useState([]);
  const [categoryList, setCategoryList] = useState([]);

  const [formData, setFormData] = useState({
    shopName: listing?.shopName || "",
    email: listing?.email || "",
    phone: listing?.phone || "",
    address: listing?.address || "",
    city: listing?.city || "",
    country: listing?.country || "",
    mapUrl: listing?.mapUrl || "",
    description: listing?.description || "",
    categories: listing?.categories || [],
    photos: [],
    metaTitle: listing?.metaTitle || "",
    metaKeyword: listing?.metaKeyword || "",
    metaDescription: listing?.metaDescription || ""
  });

  const [previewUrls, setPreviewUrls] = useState([]);

  // handle normal input change
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  // handle photo selection
  const handlePhotoChange = (e) => {
    const files = Array.from(e.target.files);
    setFormData((prev) => ({
      ...prev,
      photos: files
    }));

    // image previews
    const urls = files.map((file) => URL.createObjectURL(file));
    setPreviewUrls(urls);
  };

  // fetch categories
  const getCategories = async () => {
    try {
      const response = await fetch(`${API_BASE}/api/category`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json"
        }
      });
      if (!response.ok) throw new Error("Network response was not ok");
      const data = await response.json();
      const categories = data.categories || [];
      return categories.map((cat) => cat.categoryName);
    } catch (error) {
      console.error("Error fetching categories:", error);
      return [];
    }
  };
  const getCities = async () => {
  try {
    const response = await fetch(`${API_BASE}/api/city`, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    });
    if (!response.ok) throw new Error("Network response was not ok");
    const data = await response.json();
    const cities = data.cities || [];
    // Use 'city' instead of 'cityName'
    return cities.map((c) => c.city);
  } catch (error) {
    console.error("Error fetching cities:", error);
    return [];
  }
};

 useEffect(() => {
  const fetchData = async () => {
    const categories = await getCategories();
    const cities = await getCities();
    setCategoryList(categories);
    setCityList(cities);
  };
  fetchData();
}, []);

  // handle form submit
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const formDataToSend = new FormData();
      formDataToSend.append("shopName", formData.shopName);
      formDataToSend.append("email", formData.email);
      formDataToSend.append("phone", formData.phone);
      formDataToSend.append("address", formData.address);
      formDataToSend.append("city", formData.city);
      formDataToSend.append("country", formData.country);
      formDataToSend.append("mapUrl", formData.mapUrl);
      formDataToSend.append("description", formData.description);
      formDataToSend.append("metaTitle", formData.metaTitle);
      formDataToSend.append("metaKeyword", formData.metaKeyword);
      formDataToSend.append("metaDescription", formData.metaDescription);

      console.log(formData.categories);
      // append selected categories
      formData.categories.forEach((cat) => {
        formDataToSend.append("categories[]", cat);
      });
console.log(formDataToSend.getAll("categories[]"));
      // append image files
      formData.photos.forEach((photo) => {
        formDataToSend.append("photos", photo);
      });

      const response = await fetch(`${API_BASE}/api/listing`, {
        method: "POST",
        body: formDataToSend
      });

      const result = await response.json();

      if (response.ok) {
        alert("Listing saved successfully!");
        navigate("/business-listing");
      } else {
        alert(result.error || "Failed to save listing");
      }
    } catch (error) {
      console.error("Error submitting form:", error);
      alert("Something went wrong!");
    }
  };


  return (
    <Container className="mt-4">
      <div className="pl-3 pr-3">
        <Row className="mb-3 justify-content-end align-items-center">
          <Col>
            <h2 className="main-title mb-0">Add Listing</h2>
          </Col>
          <Col xs="auto">
            <Breadcrumb className="top-breadcrumb">
              <Breadcrumb.Item href="#">Home</Breadcrumb.Item>
              <Breadcrumb.Item active>Add Listing</Breadcrumb.Item>
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
                value={(formData.categories || []).map((c) => ({
                  value: c,
                  label: c
                }))}
                onChange={(selected) =>
                  setFormData((prev) => ({
                    ...prev,
                    categories: selected.map((s) => s.value)
                  }))
                }
              />
            </Form.Group>

            {/* Basic Fields */}
            <Form.Group className="mb-3">
              <Form.Label>Shop Name</Form.Label>
              <Form.Control
                type="text"
                name="shopName"
                value={formData.shopName}
                onChange={handleChange}
                required
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Email</Form.Label>
              <Form.Control
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Phone</Form.Label>
              <Form.Control
                type="number"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                required
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Address</Form.Label>
              <Form.Control
                type="text"
                name="address"
                value={formData.address}
                onChange={handleChange}
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>City</Form.Label>
              <Form.Select
              name="city"
              value={formData.city}
              onChange={handleChange}
              required
            >
              <option value="">--Select City--</option>
              {cityList.map((element, index) => (
                <option key={index} value={element}>
                  {element}
                </option>
              ))}
            </Form.Select>
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Country</Form.Label>
              <Form.Control
                type="text"
                name="country"
                value={formData.country}
                onChange={handleChange}
              />
            </Form.Group>

            {/* Map */}
            <Form.Group className="mb-3">
              <Form.Label>Location Map URL</Form.Label>
              <Form.Control
                type="url"
                name="mapUrl"
                value={formData.mapUrl}
                onChange={handleChange}
              />
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

            {/* Description */}
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

            {/* Photos */}
            <Form.Group className="mb-4">
              <Form.Label>Upload Photos</Form.Label>
              <Form.Control
                type="file"
                name="photos"
                multiple
                accept="image/*"
                onChange={handlePhotoChange}
              />
            </Form.Group>

            {/* Preview */}
            {previewUrls.length > 0 && (
              <Row className="mb-4">
                {previewUrls.map((url, index) => (
                  <Col key={index} xs={6} md={4} lg={3} className="mb-3">
                    <Image src={url} thumbnail fluid />
                  </Col>
                ))}
              </Row>
            )}

            {/* Meta Fields */}
            <Form.Group className="mb-4">
              <Form.Label>Page Title (Meta Title)</Form.Label>
              <Form.Control
                type="text"
                name="metaTitle"
                value={formData.metaTitle}
                onChange={handleChange}
              />
            </Form.Group>

            <Form.Group className="mb-4">
              <Form.Label>Meta Keyword</Form.Label>
              <Form.Control
                type="text"
                name="metaKeyword"
                value={formData.metaKeyword}
                onChange={handleChange}
              />
            </Form.Group>

            <Form.Group className="mb-4">
              <Form.Label>Meta Description</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                name="metaDescription"
                value={formData.metaDescription}
                onChange={handleChange}
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

export default AddListing;
