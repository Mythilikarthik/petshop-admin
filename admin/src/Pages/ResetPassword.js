import React, { useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { Container, Card, Form, Button, Alert } from "react-bootstrap";

const API_BASE =
  process.env.NODE_ENV === "production"
    ? "https://petshop-admin.onrender.com"
    : "http://localhost:5000";

const ResetPassword = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const token = searchParams.get("token");

  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [loading, setLoading] = useState(false);
  const [alert, setAlert] = useState(null);

  
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (password !== confirm) {
      return setAlert({ type: "danger", message: "Passwords do not match" });
    }

    setLoading(true);

    try {
      const res = await fetch(
        `${API_BASE}/api/auth/admin/reset-password`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ token, password }),
        }
      );

      const data = await res.json();
      if (!data.success) throw new Error(data.message);

      setAlert({ type: "success", message: "Password reset successfully" });

      setTimeout(() => navigate("/login"), 2000);
    } catch (err) {
      setAlert({ type: "danger", message: err.message });
    }

    setLoading(false);
  };

  return (
    <Container className="d-flex justify-content-center align-items-center vh-100">
      <Card className="p-4 shadow" style={{ width: "400px" }}>
        <h4 className="text-center mb-3">Reset Password</h4>

        {alert && <Alert variant={alert.type}>{alert.message}</Alert>}

        <Form onSubmit={handleSubmit}>
          <Form.Group className="mb-3">
            <Form.Label>New Password</Form.Label>
            <Form.Control
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Confirm Password</Form.Label>
            <Form.Control
              type="password"
              value={confirm}
              onChange={(e) => setConfirm(e.target.value)}
              required
            />
          </Form.Group>

          <Button className="w-100" type="submit" disabled={loading}>
            {loading ? "Updating..." : "Reset Password"}
          </Button>
        </Form>
      </Card>
    </Container>
  );
};

export default ResetPassword;
