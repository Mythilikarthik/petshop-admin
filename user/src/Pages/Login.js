import React, { useState } from 'react';
import { Button, Container, Form, Card } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { loginUser } from "../features/authSlice";

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { loading, error } = useSelector((state) => state.auth);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const result = await dispatch(loginUser({ username, password }));

    if (loginUser.fulfilled.match(result) && result.payload.success) {
      const userData = result.payload;

      // ✅ Save data for persistence
      localStorage.setItem("user", JSON.stringify(userData));
      localStorage.setItem("token", userData.token);
      localStorage.setItem("role", userData.role);
      localStorage.setItem("userId", userData.id);

      // ✅ Redirect
      navigate("/dashboard");
    } else {
      alert(result.payload || "Login failed. Please check your credentials.");
    }
  };

  return (
    <Container className="d-flex flex-direction-column justify-content-center align-items-center vh-100">
      <h1 className='main-title'>Pet Directory</h1>
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
              required
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Password</Form.Label>
            <Form.Control 
              type="password"
              placeholder="Enter password"
              value={password}
              onChange={(e) => setPassword(e.target.value)} 
              required
            />
          </Form.Group>

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
