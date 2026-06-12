import React, { useState, useRef, useEffect } from "react";
import { Form, Button, Alert, Container, Row, Col, Image } from "react-bootstrap";
import banner from "../contact.jpg";
import { validateField } from "../utils/formValidation";

const API_BASE =
  process.env.NODE_ENV === "production"
    ? process.env.REACT_APP_API_URL
    : "http://localhost:5000";

const Contact = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    message: "",
  });
  const alertRef = useRef(null);
  const formRef = useRef(null);

  const [status, setStatus] = useState({ success: "", error: "" });
  const [loading, setLoading] = useState(false); 

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === "name" && value.length > 50) return;     // Restrict name to 50 chars
    if (name === "phone" && value.length > 10) return;    // Restrict phone to 10 digits
    if (name === "message" && value.length > 500) return;
    setFormData({ ...formData, [name]: value });
  };
  const validateForm = () => {
    // Check required fields and formats using our central helper
    const nameError = validateField("name", formData.name);
    if (nameError) return nameError;

    const emailError = validateField("email", formData.email);
    if (emailError) return emailError;

    // Phone validation (Optional field validation check if user typed anything)
    if (formData.phone) {
      const phoneError = validateField("phone", formData.phone);
      if (phoneError) return phoneError;
    }

    // Message validation check with custom length criteria
    const messageError = validateField("message", formData.message, {
      maxLength: 500,
      label: "Message"
    });
    if (messageError) return messageError;

    return null; // Passes all checks
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus({ success: "", error: "" });

    const validationError = validateForm();
    if (validationError) {
      setStatus({ error: validationError, success: "" });
      return; // Stop form submission right here
    }
setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/api/contact-admin/send`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
console.log(data);
      if (data.success) {
        setStatus({ success: data.message, error: "" });
        setFormData({ name: "", email: "", phone: "", message: "" });
      } else {
        setStatus({ error: data.message, success: "" });
      }
    } catch (err) {
      console.log(err);
      setStatus({ error: "Something went wrong!", success: "" });
    } finally {
    setLoading(false); 
  }
  };
  useEffect(() => {
      if (status.success && alertRef.current) {
        alertRef.current.scrollIntoView({ behavior: "smooth", block: "center" });
      }
    }, [status]);
    useEffect(() => {
      if (status.error && alertRef.current) {
        alertRef.current.scrollIntoView({ behavior: "smooth", block: "center" });
      }
    }, [status]);

  return (
    <div className="contact-page">
      <div className="banner">
        <Image  style={{ width: "100%", height: "450px", objectFit: "cover" }} src={banner} alt="Contact Us" />
      </div>
      <Container className="mt-5 mb-5">
        <Row className="justify-content-center">
          <Col lg={6} md={8}>
            
            <h2>Contact Us</h2>
<div ref={alertRef}>
        {status.success && <Alert variant="success">{status.success}</Alert>}
        {status.error && <Alert variant="danger">{status.error}</Alert>}
</div>
        <Form ref={formRef} onSubmit={handleSubmit}>

          <Form.Group className="mb-3">
            <Form.Label>Name</Form.Label>
            <Form.Control 
              type="text" 
              name="name" 
              value={formData.name} 
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
              type="text" 
              name="phone" 
              value={formData.phone}
              onChange={handleChange}
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Message</Form.Label>
            <Form.Control 
              as="textarea" 
              rows={4} 
              name="message"
              value={formData.message}
              onChange={handleChange}
              required
            />
          </Form.Group>

          <Button variant="primary" type="submit" disabled={loading}>
            {loading ? "Sending..." : "Send Message"}
          </Button>

        </Form>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default Contact;
