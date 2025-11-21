import React, { useState, useEffect } from "react";
import { Form, Button, Container, Row, Col, Breadcrumb } from "react-bootstrap";
import "./Css/HomePage.css";

const API_BASE =
  process.env.NODE_ENV === "production"
    ? "https://petshop-admin.onrender.com"
    : "http://localhost:5000";

const HomePage = () => {
  const [formData, setFormData] = useState({
    bannerTitle: "",
    bannerSubtitle: "",
    loginTitle: "",
    loginDescription: "",
    newsletterTitle: "",
    newsletterDescription: "",
    metaTitle: "",
    metaDescription: "",

    // New fields
    footerDescription: "",
    footerAddress: "",
    footerLocation: "",
    footerEmail: "",
    footerContact: "",
    footerWorkingHours: "",
  });

  const [siteLogoDark, setSiteLogoDark] = useState(null);
  const [siteLogoLight, setSiteLogoLight] = useState(null);

  const [previewDark, setPreviewDark] = useState("");
  const [previewLight, setPreviewLight] = useState("");

  const [loading, setLoading] = useState(false);

  // ---------- FETCH DATA ----------
  useEffect(() => {
    fetch(`${API_BASE}/api/home-page`)
      .then((res) => res.json())
      .then((data) => {
        if (data.success && data.home) {
          setFormData({
            bannerTitle: data.home.bannerTitle || "",
            bannerSubtitle: data.home.bannerSubtitle || "",
            loginTitle: data.home.loginTitle || "",
            loginDescription: data.home.loginDescription || "",
            newsletterTitle: data.home.newsletterTitle || "",
            newsletterDescription: data.home.newsletterDescription || "",
            metaTitle: data.home.metaTitle || "",
            metaDescription: data.home.metaDescription || "",

            footerDescription: data.home.footerDescription || "",
            footerAddress: data.home.footerAddress || "",
            footerLocation: data.home.footerLocation || "",
            footerEmail: data.home.footerEmail || "",
            footerContact: data.home.footerContact || "",
            footerWorkingHours: data.home.footerWorkingHours || "",
          });

          if (data.home.siteLogoDark)
            setPreviewDark(`${data.home.siteLogoDark}`);

          if (data.home.siteLogoLight)
            setPreviewLight(`${data.home.siteLogoLight}`);
        }
      })
      .catch((err) => console.error(err));
  }, []);

  // ---------- TEXT INPUT HANDLER ----------
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // ---------- IMAGE INPUT HANDLER ----------
  const handleImageChange = (e, setter, previewSetter) => {
    const file = e.target.files[0];
    setter(file);

    if (file) {
      previewSetter(URL.createObjectURL(file));
    }
  };

  // ---------- SUBMIT FORM ----------
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const submitData = new FormData();

    Object.keys(formData).forEach((key) => {
      submitData.append(key, formData[key]);
    });

    if (siteLogoDark) submitData.append("siteLogoDark", siteLogoDark);
    if (siteLogoLight) submitData.append("siteLogoLight", siteLogoLight);

    try {
      const res = await fetch(`${API_BASE}/api/home-page`, {
        method: "POST",
        body: submitData,
      });

      const data = await res.json();
      if (data.success) alert("Homepage updated!");
    } catch (err) {
      console.error(err);
      alert("Failed to update.");
    }

    setLoading(false);
  };

  return (
    <Container className="mt-4">
      <div className="pl-3 pr-3">
        <Row className="mb-3">
          <Col>
            <h2 className="main-title mb-0">Home Page</h2>
            <Breadcrumb className="top-breadcrumb">
              <Breadcrumb.Item href="/">Home</Breadcrumb.Item>
              <Breadcrumb.Item active>Home Page</Breadcrumb.Item>
            </Breadcrumb>
          </Col>
        </Row>

        <div className="form-container">
          <Form onSubmit={handleSubmit}>

            {/* ---------------- BANNER SECTION ---------------- */}
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

            {/* ---------------- LOGIN SECTION ---------------- */}
            <h6 className="mb-3 title-bg-style">Login Section</h6>

            <Form.Group className="mb-3">
              <Form.Label>Login Title</Form.Label>
              <Form.Control
                type="text"
                name="loginTitle"
                value={formData.loginTitle}
                onChange={handleChange}
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Login Description</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                name="loginDescription"
                value={formData.loginDescription}
                onChange={handleChange}
              />
            </Form.Group>

            {/* ---------------- NEWSLETTER SECTION ---------------- */}
            <h6 className="mb-3 title-bg-style">Newsletter Section</h6>

            <Form.Group className="mb-3">
              <Form.Label>Newsletter Title</Form.Label>
              <Form.Control
                type="text"
                name="newsletterTitle"
                value={formData.newsletterTitle}
                onChange={handleChange}
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Newsletter Description</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                name="newsletterDescription"
                value={formData.newsletterDescription}
                onChange={handleChange}
              />
            </Form.Group>

            {/* ---------------- SEO SECTION ---------------- */}
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

            {/* ---------------- FOOTER SECTION ---------------- */}
            <h6 className="mb-3 title-bg-style">Footer Information</h6>

            <Form.Group className="mb-3">
              <Form.Label>Footer Description</Form.Label>
              <Form.Control
                as="textarea"
                rows={2}
                name="footerDescription"
                value={formData.footerDescription}
                onChange={handleChange}
              />
            </Form.Group>

            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Footer Address</Form.Label>
                  <Form.Control
                    type="text"
                    name="footerAddress"
                    value={formData.footerAddress}
                    onChange={handleChange}
                  />
                </Form.Group>
              </Col>

              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Footer Location</Form.Label>
                  <Form.Control
                    type="text"
                    name="footerLocation"
                    value={formData.footerLocation}
                    onChange={handleChange}
                  />
                </Form.Group>
              </Col>
            </Row>

            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Footer Email</Form.Label>
                  <Form.Control
                    type="text"
                    name="footerEmail"
                    value={formData.footerEmail}
                    onChange={handleChange}
                  />
                </Form.Group>
              </Col>

              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Footer Contact</Form.Label>
                  <Form.Control
                    type="text"
                    name="footerContact"
                    value={formData.footerContact}
                    onChange={handleChange}
                  />
                </Form.Group>
              </Col>
            </Row>

            <Form.Group className="mb-3">
              <Form.Label>Footer Working Hours</Form.Label>
              <Form.Control
                type="text"
                name="footerWorkingHours"
                value={formData.footerWorkingHours}
                onChange={handleChange}
              />
            </Form.Group>

            {/* ---------------- LOGO UPLOAD ---------------- */}
            <h6 className="mb-3 title-bg-style">Logos</h6>

            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Site Logo (Dark)</Form.Label>
                  <Form.Control
                    type="file"
                    onChange={(e) =>
                      handleImageChange(e, setSiteLogoDark, setPreviewDark)
                    }
                  />
                </Form.Group>
                {previewDark && (
                  <img
                    src={previewDark}
                    alt="Dark Logo"
                    className="img-preview"
                  />
                )}
              </Col>

              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Site Logo (Light)</Form.Label>
                  <Form.Control
                    type="file"
                    onChange={(e) =>
                      handleImageChange(e, setSiteLogoLight, setPreviewLight)
                    }
                  />
                </Form.Group>
                {previewLight && (
                  <img
                    src={previewLight}
                    alt="Light Logo"
                    className="img-preview"
                  />
                )}
              </Col>
            </Row>

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
