import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Container, Row, Col, Form, Button, Alert } from "react-bootstrap";
import { FaEye, FaEyeSlash } from "react-icons/fa";
const API_BASE =
  process.env.NODE_ENV === "production"
    ? "https://petshop-admin.onrender.com"
    : "http://localhost:5000";

const ClaimListing = () => {
  const { listingId } = useParams();
  const navigate = useNavigate();
  const [aler, setAlert] = useState({ show: false, type: "", message: "" });
  const [loading, setLoading] = useState(false);
const [usernameError, setUsernameError] = useState("");
  const [listing, setListing] = useState(null);
  const [showPassword, setShowPassword] = useState(false);
const [showConfirmPassword, setShowConfirmPassword] = useState(false);
const [confirmPassword, setConfirmPassword] = useState("");
const [passwordError, setPasswordError] = useState("");
  const [user, setUser] = useState({
    name: "",
    username: "",
    email: "",
    phone: "",
    password: "",
  });

  useEffect(() => {
    loadListing();
  }, []);

  const loadListing = async () => {
    const res = await fetch(`${API_BASE}/api/listing/${listingId}`);
    const data = await res.json();

    if (data.success) {
        if(!data.listing.isClaimed) {
            setListing(data.listing);
            setUser({...user, email : data.listing.email, phone : data.listing.phone})
        } else {
            navigate("/directory")
        }
      
    }
  };

  // const handleUserChange = (e) => {
  //   setUser({ ...user, [e.target.name]: e.target.value });
  // };
  const handleUserChange = (e) => {
  const { name, value } = e.target;

  if (name === "username") {
    const regex = /^[a-zA-Z0-9_]*$/; // allow typing
    if (!regex.test(value)) {
      setUsernameError("Username can contain only letters, numbers, and underscore");
      return;
    } else {
      setUsernameError("");
    }
  }

  setUser({ ...user, [name]: value });
};


  const handleSubmit = async (e) => {
    e.preventDefault();
    const usernameRegex = /^[a-zA-Z0-9_]+$/;

  if (!usernameRegex.test(user.username)) {
    setAlert({
      show: true,
      type: "danger",
      message: "Username can contain only letters, numbers, and underscore",
    });
    return;
  }
if (user.password !== confirmPassword) {
  setAlert({
    show: true,
    type: "danger",
    message: "Password and Confirm Password do not match",
  });
  return;
}
    // 1. Register user
    const userRes = await fetch(`${API_BASE}/api/auth/user/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(user),
    });

    const userData = await userRes.json();
    if (!userData.success) {
      alert(userData.message);
      return;
    }

    const token = userData.token;
    const userId = userData.id;

    // 2. Mark listing as claimed
    await fetch(`${API_BASE}/api/listing/claim/${listingId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ claimedBy: userId }),
    });

    alert("Listing claimed successfully!");
    navigate("/thank-you");
  };

  if (!listing) return <p>Loading...</p>;

  return (
    <div className="register mt-5 mb-5">
        <Container className="mt-4">
      <h3>Claim Your Listing</h3>

      
      {aler.show && (
            <Alert
            variant={aler.type}
            dismissible
            onClose={() => setAlert({ show: false })}
            >
            {aler.message}
            </Alert>
        )}

        <Form onSubmit={handleSubmit}>
            {/* LISTING INFO */}
            <h2>Listing Information</h2>

            <Form.Group className="mb-3">
            <Form.Label>Shop Name</Form.Label>
            <Form.Control value={listing.shopName} disabled />
            </Form.Group>

            <Form.Group className="mb-3">
            <Form.Label>City</Form.Label>
            <Form.Control value={listing.city.city} disabled />
            </Form.Group>

            <Form.Group className="mb-3">
            <Form.Label>Category</Form.Label>
            <Form.Control
                value={listing.categories[0]?.categoryName}
                disabled
            />
            </Form.Group>

            <Form.Group className="mb-4">
            <Form.Label>Pet Category</Form.Label>
            <Form.Control
                value={listing.petCategories[0]?.categoryName}
                disabled
            />
            </Form.Group>

            {/* USER INFO */}
            <h2>Your Details</h2>

            <Form.Group className="mb-3">
            <Form.Label>Name <span className="text-red">*</span></Form.Label>
            <Form.Control
                name="name"
                onChange={handleUserChange}
            />
            </Form.Group>

            {/* <Form.Group className="mb-3">
            <Form.Label>Username <span className="text-red">*</span></Form.Label>
            <Form.Control
                name="username"
                onChange={handleUserChange}
            />
            </Form.Group>
             */}
             <Form.Group className="mb-3">
              <Form.Label>Username <span className="text-red">*</span></Form.Label>
              <Form.Control
                name="username"
                value={user.username}
                onChange={handleUserChange}
                isInvalid={!!usernameError}
              />
              <Form.Control.Feedback type="invalid">
                {usernameError}
              </Form.Control.Feedback>
            </Form.Group>


            <Form.Group className="mb-3">
            <Form.Label>Email <span className="text-red">*</span></Form.Label>
            <Form.Control
                type="email"
                name="email"
                value={listing.email}
                onChange={handleUserChange}
                disabled
            />
            </Form.Group>

            <Form.Group className="mb-3">
            <Form.Label>Phone <span className="text-red">*</span></Form.Label>
            <Form.Control
                name="phone"
                value={listing.phone}
                onChange={handleUserChange}
                disabled
            />
            </Form.Group>

            {/* <Form.Group className="mb-4">
            <Form.Label>Password <span className="text-red">*</span></Form.Label>
            <Form.Control
                type="password"
                name="password"
                onChange={handleUserChange}
            />
            </Form.Group> */}
            <Form.Group className="mb-3">
  <Form.Label>Password <span className="text-red">*</span></Form.Label>

  <div className="position-relative">
    <Form.Control
      type={showPassword ? "text" : "password"}
      name="password"
      onChange={handleUserChange}
    />

    <span
      onClick={() => setShowPassword(!showPassword)}
      style={{
        position: "absolute",
        right: "12px",
        top: "50%",
        transform: "translateY(-50%)",
        cursor: "pointer",
        color: "#666",
      }}
    >
      {showPassword ? <FaEyeSlash /> : <FaEye />}
    </span>
  </div>
</Form.Group>
<Form.Group className="mb-4">
  <Form.Label>Confirm Password <span className="text-red">*</span></Form.Label>

  <div className="position-relative">
    <Form.Control
      type={showConfirmPassword ? "text" : "password"}
      value={confirmPassword}
      onChange={(e) => setConfirmPassword(e.target.value)}
      isInvalid={passwordError}
    />

    <span
      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
      style={{
        position: "absolute",
        right: "12px",
        top: "50%",
        transform: "translateY(-50%)",
        cursor: "pointer",
        color: "#666",
      }}
    >
      {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
    </span>

    <Form.Control.Feedback type="invalid">
      Passwords do not match
    </Form.Control.Feedback>
  </div>
</Form.Group>


            <div className="text-center">
            <Button type="submit" variant="primary" disabled={loading}>
                {loading ? "Claiming..." : "Claim Listing"}
            </Button>
            </div>
        </Form>    
        
    </Container>
    </div>
  );
};

export default ClaimListing;
