import React, { useState } from 'react';
import { Button, Container, Form, Card, InputGroup, OverlayTrigger, Tooltip } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { loginUser } from "../features/authSlice";
import { FaEye, FaEyeSlash, FaHome } from "react-icons/fa";
import { GoogleLogin } from '@react-oauth/google';
import logo from "../images/logo.png";


const API_BASE =
  process.env.NODE_ENV === "production"
    ? process.env.REACT_APP_API_URL
    : "http://localhost:5000";
const HOME = process.env.NODE_ENV === "production"
    ? process.env.REACT_APP_URL
    : "http://localhost:3002";
const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [googleError, setGoogleError] = useState("");
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
      localStorage.setItem("name", result.payload.name);
      navigate("/dashboard");
    }
  };

  return (
    <Container className="d-flex justify-content-center align-items-center vh-100 flex-column" >
      <div className='logo-section' style={{"marginBottom" : "20px"}}>
        <a href={`${HOME}`} target='_self'>
          <img src={logo} alt='Vet and Pets' />
        </a>
      </div>
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
      <small className='text-muted mt-4'>Don't have an account? 
        <Link style={{"margin-left" : "0.5rem", "display" : "inline-block"}} to={`${HOME}/register`}>
          <strong>Sign Up</strong>
        </Link>
      </small>
      <hr style={{"margin" : "2rem 0", "width" : "20%", }} />

      <div className='last-section d-flex align-items-center justify-content-center gap-3'>
        <OverlayTrigger
          placement="bottom"
          overlay={<Tooltip id="home-tooltip">Go Home</Tooltip>}
        >
          <Link to={`${HOME}`} className='d-flex align-items-center justify-content-center'
            style={{"width": "36px",
            "height": "36px",
            "border-radius": "50%",
            "object-fit": "cover", "color":"#fff",
            "background" : "rgb(249 115 22 )"}}  
            
          >
            <FaHome />
          </Link>
        </OverlayTrigger> 
      <GoogleLogin
        onSuccess={async (credentialResponse) => {
          try {
            setGoogleError("");
            const res = await fetch(`${API_BASE}/api/auth/user/google`, {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                token: credentialResponse.credential,
              }),
            });

            const data = await res.json();

      console.log(data);
      if (!res.ok || !data.success) {
              setGoogleError(data.message || "Google login failed");
              return;
            }
            if (data.success) {
              //console.log(data.name);
              localStorage.setItem("isPublicAuth", "true");
              localStorage.setItem("isAuthenticated", "true");
              localStorage.setItem("token", data.token);
              localStorage.setItem("role", data.role);
              localStorage.setItem("userId", data.id);
              localStorage.setItem("name", data.name);

              navigate("/dashboard");
            }
          } catch (err) {
            console.error("Google login failed", err);
            setGoogleError(err.message);
          }
        }}
        onError={() => {
          console.log("Google Login Failed");
          setGoogleError("Google authentication was cancelled or failed");
        }}
      />
      {googleError && (
        <p className="text-danger text-center mt-2" style={{ fontSize: "14px" }}>
          {googleError}
        </p>
      )}

      </div>

    </Container>
  );
};

export default Login;
