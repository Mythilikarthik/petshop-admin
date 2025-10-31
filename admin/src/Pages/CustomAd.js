import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Form,
  Button,
  Container,
  Row,
  Col,
  Breadcrumb,
  Spinner,
} from "react-bootstrap";

const API_BASE =
  process.env.NODE_ENV === "production"
    ? "https://petshop-admin.onrender.com"
    : "http://localhost:5000";

const AdManagement = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    slideInterval: 3,
    maxImages: 3,
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // ✅ Fetch existing Ad settings
  const fetchAdSettings = async () => {
    try {
      const res = await fetch(`${API_BASE}/api/ad/settings`);
      const data = await res.json();
      if (data.success && data.setting) {
        setFormData({
          slideInterval: data.setting.slideInterval || 3,
          maxImages: data.setting.maxImages || 3,
        });
      }
    } catch (err) {
      console.error("Error fetching ad settings:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAdSettings();
  }, []);

  // ✅ Handle input change
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // ✅ Save settings to backend
  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const res = await fetch(`${API_BASE}/api/ad/settings`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (data.success) {
        alert("Ad settings saved successfully!");
        navigate("/ad-listing"); // redirect to ad listing page after save
      } else {
        alert(data.message || "Failed to save settings");
      }
    } catch (err) {
      console.error("Error saving settings:", err);
      alert("Server error while saving settings.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <Container className="mt-5 text-center">
        <Spinner animation="border" /> <p>Loading Ad Settings...</p>
      </Container>
    );
  }

  return (
    <Container className="mt-4">
      <div className="pl-3 pr-3">
        {/* Header */}
        <Row className="mb-3 justify-content-between align-items-center">
          <Col>
            <h2 className="main-title mb-0">
              Custom Ad
            </h2>
            <Breadcrumb className="top-breadcrumb">
              <Breadcrumb.Item href="/">Home</Breadcrumb.Item>
              <Breadcrumb.Item active>
                Custom Ad
              </Breadcrumb.Item>
            </Breadcrumb>
          </Col>
          <Col xs="auto">
            {/* <Button variant="secondary" onClick={() => navigate(-1)}>
              Go Back
            </Button> */}
          </Col>
        </Row>

        {/* Form */}
        <div className="form-container border rounded p-4 shadow-sm bg-white">
          <Form onSubmit={handleSubmit}>
            <Row>
              <Col md={6}>
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
              </Col>

              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Max Images to Slide</Form.Label>
                  <Form.Control
                    type="number"
                    name="maxImages"
                    min="1"
                    value={formData.maxImages}
                    onChange={handleChange}
                    required
                  />
                </Form.Group>
              </Col>
            </Row>

            <div className="text-end">
              <Button variant="primary" type="submit" disabled={saving}>
                {saving ? "Saving..." : "Save Settings"}
              </Button>
            </div>
          </Form>
        </div>
      </div>
    </Container>
  );
};

export default AdManagement;
