import React, { useState } from "react";
import { Container, Card, Form, Button, Alert } from "react-bootstrap";
import { Link } from 'react-router-dom';
import {FaHome} from 'react-icons/fa';

const API_BASE =
  process.env.NODE_ENV === "production"
    ? process.env.REACT_APP_API_URL
    : "http://localhost:5000";
const HOME = process.env.NODE_ENV === "production"
    ? "https://petshop-template.onrender.com"
    : "http://localhost:3002";
const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [alert, setAlert] = useState({ show: false, type: "", message: "" });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch(`${API_BASE}/api/auth/user/forgot-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const data = await res.json();

      if (!data.success) throw new Error(data.message);

      setAlert({
        show: true,
        type: "success",
        message: "Password reset link sent to your email",
      });
      setEmail("");
    } catch (err) {
      setAlert({
        show: true,
        type: "danger",
        message: err.message || "Failed to send reset link",
      });
    }

    setLoading(false);
  };

  return (
    <Container className="d-flex justify-content-center align-items-center vh-100">
      <Card className="p-4 shadow" style={{ width: "400px" }}>
        <h4 className="text-center mb-3">Forgot Password</h4>

        {alert.show && (
          <Alert variant={alert.type}>{alert.message}</Alert>
        )}

        <Form onSubmit={handleSubmit}>
          <Form.Group className="mb-3">
            <Form.Label>Email</Form.Label>
            <Form.Control
              type="email"
              placeholder="Enter registered email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </Form.Group>

          <Button type="submit" className="w-100" disabled={loading}>
            {loading ? "Sending..." : "Send Reset Link"}
          </Button>
        </Form>
        <div className="d-flex gap-2 align-items-center mt-4 justify-content-center">
          <small className='text-muted '> Click here to go
            <Link style={{"margin-left" : "0.5rem", "display" : "inline-block"}} to={`/`}>
              <strong>Login Page</strong>
            </Link>
          </small>
          
        </div>
      </Card>
      
    </Container>
  );
};

export default ForgotPassword;
