import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Form, Button, Container, Row, Col, Breadcrumb } from 'react-bootstrap';
import { useEffect } from 'react';

const API_BASE =
  process.env.NODE_ENV === "production"
    ? "https://petshop-admin.onrender.com"
    : "http://localhost:5000";
const ContactAdmin = () => {
  
  const navigate = useNavigate();

  
const [loading, setLoading] = useState(true);
const [noListing, setNoListing] = useState(false);

  const [listing, setListing] = useState({});
const [formData, setFormData] = useState({
    shopName: '',
    email: '',
    description: '',
  });
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
  e.preventDefault();

  try {
    const token = localStorage.getItem("token");
    const res = await fetch(`${API_BASE}/api/contact-admin`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`,
      },
      body: JSON.stringify(formData),
    });

    const data = await res.json();
    if (data.success) {
      alert("Your message has been sent to the admin!");
      setFormData({ description: "" });
      navigate("/contact-admin");
    } else {
      alert(data.message || "Failed to send message.");
    }
  } catch (err) {
    console.error("Error sending message:", err);
    alert("Something went wrong. Try again later.");
  }
};
// useEffect(() => {
//   const id = localStorage.getItem("userId");
//   //console.log(id);
//   const fetchListing = async () => {
//     const res = await fetch(`${API_BASE}/api/listing/user/${id}`, {
//       method: "GET",
//       headers: {
//         "Content-Type": "application/json", 
//       },
//     })
//     const data = await res.json();
//     if(data.success && data.listing) {
//       setListing(data.listing);
//      //console.log(listing);
//       setFormData((prev) => ({
//         ...prev,
//         shopName: data.listing.shopName || "",
//         email: data.listing.email || "",
//       }));
//      // console.log(formData);
//     }
//   }
// fetchListing();
// }, [])
useEffect(() => {
  const id = localStorage.getItem("userId");
  if (!id) return;

  const fetchListing = async () => {
    try {
      const res = await fetch(`${API_BASE}/api/listing/user/${id}`);
      const data = await res.json();

      if (res.status === 404) {
        setNoListing(true);
        setLoading(false);
        return;
      }

      if (data.success && data.listing) {
        setListing(data.listing);

        setFormData((prev) => ({
          ...prev,
          shopName: data.listing.shopName || "",
          email: data.listing.email || "",
        }));
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  fetchListing();
}, []);

if (loading) {
  return (
    <Container className="mt-5 text-center">
      <p>Loading...</p>
    </Container>
  );
}
if (noListing) {
  return (
    <Container className="mt-5">
      <h5>You don’t have a listing yet.</h5>
    </Container>
  );
}
if (listing?.status === "pending") {
  return (
    <Container className="mt-5">
      <div className="form-container text-center">
        <h5>Your listing is under admin approval</h5>
        <p>Please wait until the admin approves your listing.</p>
      </div>
    </Container>
  );
}


  return (
    <Container className="mt-4">
      <div className='pl-3 pr-3'>
        <Row className='mb-3 justify-content-end align-items-center'>
          <Col>
            <h2 className='main-title mb-0'>Contact Admin</h2>
          </Col>
          <Col xs={'auto'}>
            <Breadcrumb className='top-breadcrumb'>
              <Breadcrumb.Item href="#">Home</Breadcrumb.Item>
              <Breadcrumb.Item active>Contact Admin</Breadcrumb.Item>
            </Breadcrumb>
          </Col>
        </Row>

        <div className='form-container'>
          <Form onSubmit={handleSubmit}>
            

            <Form.Group className="mb-3">
              <Form.Label>Shop Name</Form.Label>
              <Form.Control
                type="text"
                name="shopName"
                value={formData.shopName}
                onChange={handleChange}
                required
                disabled
                readOnly
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
                disabled
                readOnly
              />
            </Form.Group>

            <Form.Group className='mb-4'>
              <Form.Label>Message</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                name="description"
                value={formData.description}
                onChange={handleChange}
                required
              />
            </Form.Group>

            <Button variant="primary" type="submit">
              Send
            </Button>
          </Form>
        </div>
      </div>
    </Container>
  );
};

export default ContactAdmin;
