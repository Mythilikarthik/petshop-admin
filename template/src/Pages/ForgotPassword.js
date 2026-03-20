import React, { useState } from "react";
import { Container, Card, Form, Button, Alert } from "react-bootstrap";

const API_BASE =
  process.env.NODE_ENV === "production"
    ? process.env.REACT_APP_API_URL
    : "http://localhost:5000";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [alert, setAlert] = useState({ show: false, type: "", message: "" });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch(`${API_BASE}/api/auth/site/user/forgot-password`, {
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
    <Container className="d-flex justify-content-center align-items-center mt-5 mb-5">
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
      </Card>
    </Container>
  );
};

export default ForgotPassword;
