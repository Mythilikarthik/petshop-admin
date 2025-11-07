import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Form, Button, Container, Row, Col, Breadcrumb } from 'react-bootstrap';

const API_BASE =
  process.env.NODE_ENV === "production"
    ? "https://petshop-user.onrender.com"
    : "http://localhost:5000";

const SendMessage = () => {
  const { state } = useLocation();
  const navigate = useNavigate();

  const { listing } = state || {};

  const [formData, setFormData] = useState({
    sendTo: "",
    message: "",
  });

  const [users, setUsers] = useState([]); // store all users

  useEffect(() => {
    const fetchUsers = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
    alert("You must be logged in");
    return;
  }
  //console.log(localStorage.getItem("userId"));
      try {
        const res = await fetch(`${API_BASE}/api/auth/user/all`, {
          method: "GET",
          headers: { 
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`,
           },
        });
        const data = await res.json();
        if (data.success) {
          setUsers(data.users);
          console.log(data.users);
        } else {
          console.error("Failed to fetch users:", data);
        }
      } catch (err) {
        console.error("Error fetching users:", err);
      }
    };
    fetchUsers();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
  e.preventDefault();

  const token = localStorage.getItem("token");
  if (!token) {
    alert("You must be logged in to send messages.");
    return;
  }

  const payload = {
    senderId: localStorage.getItem("userId"),
    receiverId: formData.sendTo, // must store actual user _id from dropdown
    message: formData.message,
  };
  console.log(formData);
console.log(payload);
  try {
    const res = await fetch(`${API_BASE}/api/messages/send`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`,
      },
      body: JSON.stringify(payload),
    });

    const data = await res.json();

    if (data.success) {
      alert("Message sent successfully!");
      navigate("/view-message");
    } else {
      alert(data.message || "Failed to send message");
    }
  } catch (error) {
    console.error("Error sending message:", error);
    alert("Something went wrong.");
  }
};


  return (
    <Container className="mt-4">
      <div className="pl-3 pr-3">
        <Row className="mb-3 justify-content-end align-items-center">
          <Col>
            <h2 className="main-title mb-0">Send Message</h2>
            <Breadcrumb className="top-breadcrumb">
              <Breadcrumb.Item href="/">Home</Breadcrumb.Item>
              <Breadcrumb.Item active>Send Message</Breadcrumb.Item>
            </Breadcrumb>
          </Col>
        </Row>

        <div className="form-container">
          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3">
              <Form.Label>Send To</Form.Label>
              <Form.Select
                name="sendTo"
                value={formData.sendTo}
                onChange={handleChange}
                required
              >
                <option value="">-- Select User --</option>
                {users.map((user) => (
                  <option key={user._id} value={user._id}>
                    {user.name}
                  </option>
                ))}
              </Form.Select>
            </Form.Group>

            <Form.Group className="mb-4">
              <Form.Label>Message</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                name="message"
                value={formData.message}
                onChange={handleChange}
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

export default SendMessage;
