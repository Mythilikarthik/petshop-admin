import React, { useState, useEffect } from "react";
import { Form, Button, Container, Row, Col, Breadcrumb, Image } from "react-bootstrap";
import { useLocation, useNavigate } from "react-router-dom";
import { IoIosCloseCircle } from "react-icons/io";

const API_BASE =
  process.env.NODE_ENV === "production"
    ? "https://petshop-admin.onrender.com"
    : "http://localhost:5000";

const CategoryPageForm = () => {
  const { state } = useLocation();
  const { id } = state || {};
  const isEdit = Boolean(id);

  const [categories, setCategories] = useState([]);
  const [formData, setFormData] = useState({
    category: "",
    displayName: "",
    description: "",
    image: null,
    imagePreview: "",
    services: [],
    metaTitle: "",
    metaDescription: "",
    metaKeywords: "",
  });

  const [serviceInput, setServiceInput] = useState({ title: "", description: "" });
  const navigate = useNavigate();

  // 🟩 Load categories list
  useEffect(() => {
    fetch(`${API_BASE}/api/pet-category`, {
      method: "GET",
      headers: { 'Content-Type': 'application/json' },
    })
      .then((res) => res.json())
      .then((data) => setCategories(data.petCategories || []))
      .catch((err) => console.error("Category fetch failed:", err));
  }, []);

  // 🟨 Load existing category page if editing
  useEffect(() => {
    if (isEdit) {
      fetch(`${API_BASE}/api/categorypage/${id}`)
        .then((res) => res.json())
        .then((data) => {
          if (data.success && data.page) {
            const p = data.page;
            setFormData({
              category: p.category?._id || "", // ✅ use ID here
              displayName: p.displayName || "",
              description: p.description || "",
              image: null,
              imagePreview: p.image ? `${API_BASE}${p.image}` : "",
              services: p.services || [],
              metaTitle: p.metaTitle || "",
              metaDescription: p.metaDescription || "",
              metaKeywords: p.metaKeywords || "",
            });
          }
        })
        .catch((err) => console.error("Category page fetch failed:", err));
    }
  }, [isEdit, id]);

  // 🟢 Handle inputs
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setFormData((prev) => ({
      ...prev,
      image: file,
      imagePreview: file ? URL.createObjectURL(file) : prev.imagePreview,
    }));
  };

  const addService = () => {
    if (!serviceInput.title || !serviceInput.description) return;
    setFormData((prev) => ({
      ...prev,
      services: [...prev.services, serviceInput],
    }));
    setServiceInput({ title: "", description: "" });
  };

  const removeService = (i) => {
    setFormData((prev) => ({
      ...prev,
      services: prev.services.filter((_, index) => index !== i),
    }));
  };

  // 🟠 Submit form
  const handleSubmit = async (e) => {
    e.preventDefault();

    const data = new FormData();
    data.append("category", formData.category);
    data.append("displayName", formData.displayName);
    data.append("description", formData.description);
    if (formData.image) data.append("image", formData.image);
    data.append("metaTitle", formData.metaTitle);
    data.append("metaDescription", formData.metaDescription);
    data.append("metaKeywords", formData.metaKeywords);
    data.append("services", JSON.stringify(formData.services));

    const method = isEdit ? "PATCH" : "POST";
    const url = isEdit
      ? `${API_BASE}/api/categorypage/${id}`
      : `${API_BASE}/api/categorypage`;

    const res = await fetch(url, {
      method,
      body: data,
    });

    const result = await res.json();
    if (result.success) {
      alert(`Category Page ${isEdit ? "updated" : "added"} successfully!`);
      navigate("/category-pages");
    } else {
      alert(result.message || "Failed to save.");
    }
  };

  return (
    <Container className="mt-4">
      <div className="pl-3 pr-3">
        <Row className="mb-3 justify-content-between align-items-center">
          <Col>
            <h2 className="main-title mb-0">
              {isEdit ? "Edit Category Page" : "Add Category Page"}
            </h2>
            <Breadcrumb className="top-breadcrumb">
              <Breadcrumb.Item href="/">Home</Breadcrumb.Item>
              <Breadcrumb.Item active>
                {isEdit ? "Edit Category Page" : "Add Category Page"}
              </Breadcrumb.Item>
            </Breadcrumb>
          </Col>
          <Col xs="auto">
            <Button variant="secondary" onClick={() => navigate(-1)}>
              Go Back
            </Button>
          </Col>
        </Row>

        <div className="form-container">
          <Form onSubmit={handleSubmit} encType="multipart/form-data">
            <Form.Group className="mb-3">
              <Form.Label>Category</Form.Label>
              <Form.Select
                name="category"
                value={formData.category}
                onChange={handleChange}
                disabled={isEdit} // optional: lock category after creation
              >
                <option value="">Select category</option>
                {categories.map((cat) => (
                  <option key={cat._id} value={cat._id}>
                    {cat.categoryName}
                  </option>
                ))}
              </Form.Select>
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Display Name</Form.Label>
              <Form.Control
                type="text"
                name="displayName"
                value={formData.displayName}
                onChange={handleChange}
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
              <Form.Label>Image</Form.Label>
              <Form.Control type="file" name="image" onChange={handleFileChange} />
              {formData.imagePreview && (
                <div className="mt-2">
                  <Image
                    src={formData.imagePreview}
                    alt="Preview"
                    thumbnail
                    style={{ maxWidth: "200px" }}
                  />
                </div>
              )}
            </Form.Group>

            <h6>Services</h6>
            <Row>
              <Col md={5}>
                <Form.Control
                  placeholder="Title"
                  value={serviceInput.title}
                  onChange={(e) =>
                    setServiceInput((p) => ({ ...p, title: e.target.value }))
                  }
                />
              </Col>
              <Col md={5}>
                <Form.Control
                  placeholder="Description"
                  value={serviceInput.description}
                  onChange={(e) =>
                    setServiceInput((p) => ({
                      ...p,
                      description: e.target.value,
                    }))
                  }
                />
              </Col>
              <Col md={2}>
                <Button onClick={addService}>Add</Button>
              </Col>
            </Row>

            <ul>
              {formData.services.map((s, i) => (
                <li key={i}>
                  {s.title} - {s.description}
                  <Button
                    variant="link"
                    onClick={() => removeService(i)}
                    className="text-danger"
                  >
                    <IoIosCloseCircle />
                  </Button>
                </li>
              ))}
            </ul>

            <h6>SEO Section</h6>
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
            <Form.Group className="mb-3">
              <Form.Label>Meta Keywords</Form.Label>
              <Form.Control
                type="text"
                name="metaKeywords"
                value={formData.metaKeywords}
                onChange={handleChange}
              />
            </Form.Group>

            <Button type="submit" variant="primary">
              {isEdit ? "Update" : "Save"}
            </Button>
          </Form>
        </div>
      </div>
    </Container>
  );
};

export default CategoryPageForm;
