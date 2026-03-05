// src/Pages/AddEditSpecializedService.js

import React, { useEffect, useState } from "react";
import { Form, Button, Container, Row, Col, Breadcrumb } from "react-bootstrap";
import { useParams, useNavigate } from "react-router-dom";
import useUnsavedChanges from "../Hooks/useUnsavedChanges";

const API_BASE =
  process.env.NODE_ENV === "production"
    ? "https://petshop-admin.onrender.com"
    : "http://localhost:5000";

export default function AddEditSpecializedService() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    serviceName: "",
    petCategory: "",
    category: "",
    description: "",
    show: true,
  });
const { resetInitialSnapshot, confirmLeave, markAsSaved } =
    useUnsavedChanges(form);
  const [petCategories, setPetCategories] = useState([]);
  const [allCategories, setAllCategories] = useState([]);
  const [filteredCategories, setFilteredCategories] = useState([]);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // ✅ Load dropdown data
  useEffect(() => {
    fetchPetCategories();
    fetchCategories();

    if (id) {
      fetch(`${API_BASE}/api/specialized-service/${id}`)
        .then(res => res.json())
        .then(data => {
          setForm({
            serviceName: data.serviceName || "",
            petCategory: data.petCategory || "",
            category: data.category || "",
            description: data.description || "",
            show: data.show ?? true,
          });
            setTimeout(() => resetInitialSnapshot(), 0);
        });
    }
  }, [id]);

  // 🐾 Fetch Pet Categories (only show = true)
  const fetchPetCategories = async () => {
    try {
      const res = await fetch(`${API_BASE}/api/pet-category/show`);
      const data = await res.json();

      if (data.success) {
        setPetCategories(data.petCategories);
      }
    } catch (err) {
      console.error(err);
    }
  };

  // 📂 Fetch All Categories
  const fetchCategories = async () => {
    try {
      const res = await fetch(`${API_BASE}/api/category/show`);
      const data = await res.json();

      if (data.success) {
        setAllCategories(data.categories);
      }
    } catch (err) {
      console.error(err);
    }
  };
  console.log("allCategory", allCategories);

  // ✅ When PetCategory changes → filter Categories
  useEffect(() => {
  if (!form.petCategory) {
    setFilteredCategories([]);
    return;
  }

  const filtered = allCategories.filter(cat =>
    cat.show === true &&
    Array.isArray(cat.petCategories) &&
    cat.petCategories.some(petId => String(petId._id) === String(form.petCategory))
  );

  setFilteredCategories(filtered);

  // reset category if not valid
  if (!filtered.some(c => String(c._id) === String(form.category))) {
    setForm(prev => ({
      ...prev,
      category: filtered.length === 1 ? filtered[0]._id : ""
    }));
  }

}, [form.petCategory, allCategories]);

  const handleChange = (e) => {
  const { name, value, type, checked } = e.target;

  if (name === "petCategory") {
    // reset category immediately when petCategory changes
    setForm(prev => ({
      ...prev,
      petCategory: value,
      category: ""
    }));
  } else {
    setForm(prev => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  }
};

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");

    try {
      const url = id
        ? `${API_BASE}/api/specialized-service/${id}`
        : `${API_BASE}/api/specialized-service`;

      const method = id ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Something went wrong");
      }
      markAsSaved();
      setSuccess("Saved successfully!");
      setTimeout(() => navigate("/specialized-services-listing"), 1200);

    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container className="mt-4">
      <Row className="mb-3 justify-content-between align-items-center">
        <Col>
          <h2>{id ? "Edit" : "Add"} Specialized Service</h2>
          <Breadcrumb>
            <Breadcrumb.Item onClick={() => navigate("/")}>
              Home
            </Breadcrumb.Item>
            <Breadcrumb.Item active>
              {id ? "Edit Service" : "Add Service"}
            </Breadcrumb.Item>
          </Breadcrumb>
        </Col>
        <Col xs="auto">
          <Button variant="secondary" onClick={() => {
            if(!(confirmLeave)) return
            navigate("/specialized-services-listing")
          }}>
            Go Back
          </Button>
        </Col>
      </Row>
{console.log("petcategories", petCategories)}
{console.log("categories" , filteredCategories)}
      <div className="form-container">
        <Form onSubmit={handleSubmit}>

          {/* Pet Category First */}
          <Form.Group className="mb-3">
            <Form.Label>Select Pet Category</Form.Label>
            <Form.Select
              name="petCategory"
              value={form.petCategory}
              onChange={handleChange}
              required
            >
              <option value="">Select Pet Category</option>
              {petCategories.map(pet => (
                <option key={pet._id} value={pet._id}>
                  {pet.categoryName}
                </option>
              ))}
            </Form.Select>
          </Form.Group>

          {/* Filtered Category */}
          <Form.Group className="mb-3">
            <Form.Label>Select Category</Form.Label>
            <Form.Select
              name="category"
              value={form.category}
              onChange={handleChange}
              required
              disabled={!form.petCategory}
            >
              <option value="">Select Category</option>
              {filteredCategories.map(cat => (
                <option key={cat._id} value={cat._id}>
                  {cat.categoryName}
                </option>
              ))}
            </Form.Select>
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Service Name</Form.Label>
            <Form.Control
              type="text"
              name="serviceName"
              value={form.serviceName}
              onChange={handleChange}
              required
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Description</Form.Label>
            <Form.Control
              as="textarea"
              rows={3}
              name="description"
              value={form.description}
              onChange={handleChange}
            />
          </Form.Group>

          <Form.Check
            type="checkbox"
            label="Show"
            name="show"
            checked={form.show}
            onChange={handleChange}
            className="mb-3"
          />

          {error && <p className="text-danger">{error}</p>}
          {success && <p className="text-success">{success}</p>}

          <Button type="submit" disabled={loading}>
            {loading ? "Saving..." : id ? "Update Service" : "Create Service"}
          </Button>

        </Form>
      </div>
    </Container>
  );
}