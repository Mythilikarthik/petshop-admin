import React, { useState, useEffect } from "react";
import { Form, Button, Container, Row, Col, Alert } from "react-bootstrap";

const API_BASE =
  process.env.NODE_ENV === "production"
    ? process.env.REACT_APP_API_URL
    : "http://localhost:5000";

const Register = () => {
  // USER FIELDS
  const [form, setForm] = useState({
    name: "",
    username: "",
    email: "",
    phone: "",
    password: "",
  });

  // LISTING FIELDS
  const [listing, setListing] = useState({
    shopName: "",
    city: "",
    category: "",
    petCategory: "",
  });

  const [categories, setCategories] = useState([]);
  const [petCategories, setPetCategories] = useState([]);
  const [cities, setCities] = useState([]);

  const [alert, setAlert] = useState({ show: false, type: "", message: "" });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadSelectData();
  }, []);

  const loadSelectData = async () => {
    try {
      const catRes = await fetch(`${API_BASE}/api/category/show`);
      const petRes = await fetch(`${API_BASE}/api/pet-category/show`);
      const cityRes = await fetch(`${API_BASE}/api/city/show`);

      const [catData, petData, cityData] = await Promise.all([
        catRes.json(),
        petRes.json(),
        cityRes.json(),
      ]);
// console.log(catData, petData, cityData);
      setCategories(catData.categories || []);
      setPetCategories(petData.petCategories || []);
      setCities(cityData.cities || []);
    } catch (err) {
      console.log("Failed to load dropdown data");
    }
  };

  // For user fields
  const handleUserChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // For listing fields
  const handleListingChange = (e) => {
    setListing({ ...listing, [e.target.name]: e.target.value });
  };

  const validateForm = () => {
    if (!form.name) return "Name is required";
    if (!form.username) return "Username is required";
    if (!form.email) return "Email is required";
    if (!form.phone) return "Phone number is required";
    if (!form.password) return "Password is required";

    // Listing validations
    if (!listing.shopName) return "Shop Name is required";
    if (!listing.city) return "City is required";
    if (!listing.category) return "Category is required";
    if (!listing.petCategory) return "Pet Category is required";

    return null;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const error = validateForm();
    if (error)
      return setAlert({ show: true, type: "danger", message: error });

    setLoading(true);

    try {
      // 1️⃣ First register user
      const res = await fetch(`${API_BASE}/api/auth/user/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const data = await res.json();

      if (!data.success)
        return setAlert({ show: true, type: "danger", message: data.message });

      const userId = data.id;

      // 2️⃣ Create listing for user
      const listingPayload = {
        shopName: listing.shopName,
        email: form.email,
        phone: form.phone,
        city: listing.city,
        categories: [listing.category],
        petCategories: [listing.petCategory],
        created_by_type: "user",
        created_by_id: userId,
        user_id: userId,
      };

      await fetch(`${API_BASE}/api/listing/simple`, {
        method: "POST",
        headers: { "Content-Type": "application/json",
            Authorization: `Bearer ${data.token}`,
         },
        body: JSON.stringify(listingPayload),
      });

      setAlert({
        show: true,
        type: "success",
        message: "Registration & Listing created successfully!",
      });

      // Reset forms
      setForm({
        name: "",
        username: "",
        email: "",
        phone: "",
        password: "",
      });

      setListing({
        shopName: "",
        city: "",
        category: "",
        petCategory: "",
      });
    } catch (err) {
      setAlert({
        show: true,
        type: "danger",
        message: err.message || "Submission failed",
      });
    }

    setLoading(false);
  };

  return (
    <div className="register">
        <Container className="py-5">
      <Row className=" justify-content-center shadow-lg rounded">
        <Col md={6} className="bg-color text-center p-0 align-items-center d-flex justify-content-center">
          <div className=" d-flex flex-column justify-content-center ">

              <div className="text-white p-5">
                <h3>Welcome to PetShop Admin</h3>
                <p>Create an account and list your shop easily.</p>
              </div>
            
          </div>
        </Col>
        <Col md={6} className=" p-0">
          <div className="bg-grey p-5">
            <h3 className="text-orange-500 text-center mb-4">Register & Create Listing</h3>

          {alert.show && (
            <Alert
              variant={alert.type}
              dismissible
              onClose={() => setAlert({ show: false })}
            >
              {alert.message}
            </Alert>
          )}

          <Form onSubmit={handleSubmit}>
            {/* USER INFO */}
            {/* <h2>User Details</h2> */}
            <Form.Group className="mb-3">
              <Form.Label>Name <span className="text-red"> * </span></Form.Label>
              <Form.Control
                name="name"
                value={form.name}
                onChange={handleUserChange}
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Username <span className="text-red"> * </span></Form.Label>
              <Form.Control
                name="username"
                value={form.username}
                onChange={handleUserChange}
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Email<span className="text-red"> * </span></Form.Label>
              <Form.Control
                type="email"
                name="email"
                value={form.email}
                onChange={handleUserChange}
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Phone <span className="text-red"> * </span></Form.Label>
              <Form.Control
                name="phone"
                value={form.phone}
                onChange={handleUserChange}
              />
            </Form.Group>

            <Form.Group className="mb-4">
              <Form.Label>Password <span className="text-red"> * </span></Form.Label>
              <Form.Control
                type="password"
                name="password"
                value={form.password}
                onChange={handleUserChange}
              />
            </Form.Group>

            {/* LISTING INFO */}
            {/* <h2>Business / Listing Details</h2> */}

            <Form.Group className="mb-3">
              <Form.Label>Shop Name <span className="text-red"> * </span></Form.Label>
              <Form.Control
                name="shopName"
                value={listing.shopName}
                onChange={handleListingChange}
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>City <span className="text-red"> * </span></Form.Label>
              <Form.Select
                name="city"
                value={listing.city}
                onChange={handleListingChange}
              >
                <option value="">--</option>
                {cities.map((c) => (
                  <option key={c._id} value={c._id}>
                    {c.city}
                  </option>
                ))}
              </Form.Select>
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Type <span className="text-red"> * </span></Form.Label>
              <Form.Select
                name="petCategory"
                value={listing.petCategory}
                onChange={handleListingChange}
              >
                <option value="">--</option>
                {petCategories.map((pc) => (
                  <option key={pc._id} value={pc._id}>
                    {pc.categoryName}
                  </option>
                ))}
              </Form.Select>
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Category <span className="text-red"> * </span></Form.Label>
              <Form.Select
                name="category"
                value={listing.category}
                onChange={handleListingChange}
              >
                <option value="">--</option>
                {categories.map((cat) => (
                  <option key={cat._id} value={cat._id}>
                    {cat.categoryName}
                  </option>
                ))}
              </Form.Select>
            </Form.Group>

            

            <div className="text-center">
              <Button type="submit" variant="" className="bg-orange-500 text-white border-2 border-orange-500" disabled={loading}>
                {loading ? "Submitting..." : "Register & Create Listing"}
              </Button>
            </div>
          </Form>
          </div>
        </Col>
      </Row>
    </Container>
    </div>
  );
};

export default Register;
