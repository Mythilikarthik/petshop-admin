import React, { useState } from "react";
import { Form, Button, Alert, Spinner } from "react-bootstrap";
import { useAuth } from "../contexts/AuthContext";
import { GoogleLogin } from "@react-oauth/google";
import { useNavigate } from "react-router-dom";


const API_BASE =
  process.env.NODE_ENV === "production"
    ? process.env.REACT_APP_API_URL
    : "http://localhost:5000";

const LoginForm = ({ onSuccess }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const { login, loginWithGoogle } = useAuth();
  const navigate = useNavigate();
  // const handleSubmit = async (e) => {
  //   e.preventDefault();
  //   setError("");
  //   setLoading(true);

  //   try {
  //     const res = await fetch(`${API_BASE}/api/auth/login`, {
  //       method: "POST",
  //       headers: { "Content-Type": "application/json" },
  //       body: JSON.stringify({ email, password }),
  //     });

  //     const data = await res.json();

  //     if (!res.ok || !data.success) {
  //       throw new Error(data.message || "Login failed");
  //     }

  //     // Save auth data
  //     localStorage.setItem("token", data.token);
  //     localStorage.setItem("user", JSON.stringify(data.user));

  //     onSuccess?.();
  //   } catch (err) {
  //     setError(err.message);
  //   } finally {
  //     setLoading(false);
  //   }
  // };
const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await fetch(`${API_BASE}/api/auth/site/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();
      if (!data.success) throw new Error(data.message);

      login(data.user, data.token);   // 🔥 important
      onSuccess?.();
      console.log(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };
  return (
    <div className="p-3">
    <Form onSubmit={handleSubmit}>
      {error && <Alert variant="danger">{error}</Alert>}

      <Form.Group className="mb-3">
        <Form.Label>Email</Form.Label>
        <Form.Control
          type="text"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
      </Form.Group>

      <Form.Group className="mb-3">
        <Form.Label>Password</Form.Label>
        <Form.Control
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
      </Form.Group>
      <div className="text-end mb-3">
        <span
          style={{ cursor: "pointer", color: "#0d6efd", fontSize: "14px" }}
          onClick={() => navigate("/forgot-password")}
        >
          Forgot password?
        </span>
      </div>

      <Button type="submit" className="w-100" disabled={loading}>
        {loading ? <Spinner size="sm" /> : "Login"}
      </Button>
    </Form>
    <hr />
    <GoogleLogin
  onSuccess={async (credentialResponse) => {
    try {
      await loginWithGoogle(credentialResponse.credential);
      onSuccess?.(); // ✅ CLOSE POPUP
    } catch (err) {
      console.error(err.message);
    }
  }}
  onError={() => console.log("Google Login Failed")}
/>


    </div>
  );
};

export default LoginForm;
