import React, { useState } from 'react';
import { Button, Container, Form, Card } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import {loginUser} from "../features/authSlice"


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
      localStorage.setItem("isPublicAuth", "true");
      localStorage.setItem('isAuthenticated', 'true');
      navigate("/dashboard"); // Redirect to dashboard
      // console.log(username)
    }
  };

  return (
    <Container className="d-flex flex-direction-column justify-content-center align-items-center vh-100">
      <h1 className='main-title'>Pet Directory</h1>
      <Card style={{ width: '400px' }} className="p-4 shadow">
        <h3 className="text-center mb-3">Login</h3>
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
            {loading ? "Loading in ..." :  "Login"}
          </Button>
          {error && <p style={{"color" : "red"}}>{error}</p>}
        </Form>
      </Card>
    </Container>
  );
};

export default Login;
