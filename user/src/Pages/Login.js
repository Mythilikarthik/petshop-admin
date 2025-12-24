import React, { useState } from 'react';
import { Button, Container, Form, Card, InputGroup } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { loginUser } from "../features/authSlice";
import { FaEye, FaEyeSlash } from "react-icons/fa";

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { loading, error } = useSelector((state) => state.auth);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const result = await dispatch(loginUser({ username, password }));
    if (loginUser.fulfilled.match(result) && result.payload.success) {
      localStorage.setItem("isPublicAuth", "true");
      localStorage.setItem('isAuthenticated', 'true');
      localStorage.setItem("token", result.payload.token);
      localStorage.setItem("role", result.payload.role);
      localStorage.setItem("userId", result.payload.id);
      navigate("/dashboard");
    }
  };

  return (
    <Container className="d-flex justify-content-center align-items-center vh-100">
      <Card style={{ width: '400px' }} className="p-4 shadow">
        <h3 className="text-center mb-3">User Login</h3>

        <Form onSubmit={handleSubmit}>
          <Form.Group className="mb-3">
            <Form.Label>Username</Form.Label>
            <Form.Control
              type="text"
              placeholder="Enter username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              autoComplete="username"
              required
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Password</Form.Label>

            <InputGroup>
              <Form.Control
                type={showPassword ? "text" : "password"}
                placeholder="Enter password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete="current-password"
                required
              />
              <InputGroup.Text
                style={{ cursor: "pointer" }}
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </InputGroup.Text>
            </InputGroup>
          </Form.Group>

          <div className="text-end mb-3">
            <span
              style={{ cursor: "pointer", color: "#0d6efd", fontSize: "14px" }}
              onClick={() => navigate("/forgot-password")}
            >
              Forgot password?
            </span>
          </div>

          <Button variant="primary" type="submit" className="w-100" disabled={loading}>
            {loading ? "Logging in..." : "Login"}
          </Button>

          {error && <p className="text-danger mt-2">{error}</p>}
        </Form>
      </Card>
    </Container>
  );
};

export default Login;
