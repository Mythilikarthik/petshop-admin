import React, { useEffect, useState } from "react";
import { Form, Button, Container, Row, Col, Alert } from "react-bootstrap";
import Select from "react-select";
import { FaEye, FaEyeSlash } from "react-icons/fa";

const API_BASE =
  process.env.NODE_ENV === "production"
    ? "https://petshop-admin.onrender.com"
    : "http://localhost:5000";
const LOGIM_URI =
  process.env.NODE_ENV === "production"
    ? "https://petshop-user.onrender.com"
    : "http://localhost:3001";

const Register = () => {
  /* ---------------- USER ---------------- */
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [form, setForm] = useState({
    name: "",
    username: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
  });

  /* ---------------- LISTING ---------------- */
  const [listing, setListing] = useState({
    shopName: "",
    city: "",
    petCategories: [],
    categories: [],
  });

  /* ---------------- DROPDOWNS ---------------- */
  const [cities, setCities] = useState([]);
  const [petCategories, setPetCategories] = useState([]);
  const [categories, setCategories] = useState([]);

  /* ---------------- UI ---------------- */
  const [alert, setAlert] = useState({ show: false, type: "", message: "" });
  const [loading, setLoading] = useState(false);

  /* ---------------- INITIAL LOAD ---------------- */
  useEffect(() => {
    loadInitialData();
  }, []);

  const loadInitialData = async () => {
    try {
      const [cityRes, petRes] = await Promise.all([
        fetch(`${API_BASE}/api/city/show`),
        fetch(`${API_BASE}/api/pet-category/show`),
      ]);

      const cityData = await cityRes.json();
      const petData = await petRes.json();

      setCities(cityData.cities || []);
      setPetCategories(petData.petCategories || []);
    } catch (err) {
      console.error("Failed loading dropdowns");
    }
  };

  /* ---------------- TYPE → CATEGORY ---------------- */
  useEffect(() => {
    if (!listing.petCategories.length) {
      setCategories([]);
      setListing((prev) => ({ ...prev, categories: [] }));
      return;
    }

    fetchCategoriesByTypes(listing.petCategories);
  }, [listing.petCategories]);

  const fetchCategoriesByTypes = async (petCategoryIds) => {
    try {
      const res = await fetch(`${API_BASE}/api/category/byPetCategories`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ petCategories: petCategoryIds }),
      });

      const data = await res.json();

      if (data.success) {
        setCategories(data.categories || []);
      } else {
        setCategories([]);
      }

      setListing((prev) => ({ ...prev, categories: [] }));
    } catch (err) {
      console.error("Category fetch failed");
      setCategories([]);
    }
  };

  /* ---------------- HANDLERS ---------------- */
  // const handleUserChange = (e) =>
  //   setForm({ ...form, [e.target.name]: e.target.value });
  const USERNAME_REGEX = /^[a-zA-Z0-9_]+$/;
  const handleUserChange = (e) => {
  const { name, value } = e.target;

  // Username validation (no space, no special chars)
  if (name === "username") {
    // Prevent spaces
    if (value.includes(" ")) return;

    // Allow only letters, numbers, underscore
    if (value && !USERNAME_REGEX.test(value)) return;
  }

  setForm({ ...form, [name]: value });
};


  const handleListingChange = (e) =>
    setListing({ ...listing, [e.target.name]: e.target.value });

  /* ---------------- VALIDATION ---------------- */
  // const validateForm = () => {
  //   if (!form.name) return "Name required";
  //   if (!form.username) return "Username required";
  //   if (!form.email) return "Email required";
  //   if (!form.phone) return "Phone required";
  //   if (!form.password) return "Password required";
  //   if (!listing.shopName) return "Shop name required";
  //   if (!listing.city) return "City required";
  //   if (!listing.petCategories.length) return "Type required";
  //   if (!listing.categories.length) return "Category required";
  //   return null;
  // };
  const validateForm = () => {
  if (!form.name) return "Name required";

  if (!form.username) return "Username required";
  if (!USERNAME_REGEX.test(form.username))
    return "Username can contain only letters, numbers, and underscore (_)";

  if (!form.email) return "Email required";
  if (!form.phone) return "Phone required";
  if (!form.password) return "Password required";
  if (!form.confirmPassword) return "Confirm your password";
  if (form.password !== form.confirmPassword)
    return "Passwords do not match";
  if (!listing.shopName) return "Shop name required";
  if (!listing.city) return "City required";
  if (!listing.petCategories.length) return "Type required";
  if (!listing.categories.length) return "Category required";

  return null;
};


  /* ---------------- SUBMIT ---------------- */
  const handleSubmit = async (e) => {
    e.preventDefault();
    const error = validateForm();
    if (error)
      return setAlert({ show: true, type: "danger", message: error });

    setLoading(true);

    try {
      /* REGISTER USER */
      const res = await fetch(`${API_BASE}/api/auth/user/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const userData = await res.json();
      if (!userData.success) throw new Error(userData.message);

      /* CREATE LISTING */
      const listingPayload = {
        shopName: listing.shopName,
        email: form.email,
        phone: form.phone,
        city: listing.city,
        categories: listing.categories,
        petCategories: listing.petCategories,
        created_by_type: "user",
        created_by_id: userData.id,
        user_id: userData.id,
      };

      await fetch(`${API_BASE}/api/listing/simple`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${userData.token}`,
        },
        body: JSON.stringify(listingPayload),
      });

      setAlert({
        show: true,
        type: "success",
        message: "Registration & listing created successfully!",
      });

      /* RESET */
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
        petCategories: [],
        categories: [],
      });

      setCategories([]);
    } catch (err) {
      setAlert({
        show: true,
        type: "danger",
        message: err.message || "Submission failed",
      });
    }

    setLoading(false);
  };

  /* ---------------- UI ---------------- */
  return (
    <div className="register">
      <Container className="py-5">
        <Row className="justify-content-center shadow-lg rounded">
          {/* LEFT */}
          <Col md={6} className="bg-color text-white d-flex align-items-center justify-content-center">
            <div className="p-5 text-center">
              <h3>Welcome to PetShop Admin</h3>
              <p>Create account & list your shop easily</p>
            </div>
          </Col>

          {/* RIGHT */}
          <Col md={6} className="p-0">
            <div className="bg-grey p-5">
              <h3 className="text-center mb-2 text-orange-500">
                Register & Create Listing
              </h3>
              <small className="d-block text-center mb-4 text-muted">Already have an account? <a href={LOGIM_URI}><b>Login</b></a></small>

              {alert.show && (
                <Alert variant={alert.type} dismissible onClose={() => setAlert({ show: false })}>
                  {alert.message}
                </Alert>
              )}

              <Form onSubmit={handleSubmit}>
                {/* USER */}
                <Form.Group className="mb-3">
                  <Form.Label>Name *</Form.Label>
                  <Form.Control name="name" value={form.name} onChange={handleUserChange} />
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>Username *</Form.Label>
                  <Form.Control name="username" value={form.username} onChange={handleUserChange} autoComplete="off" />
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>Email *</Form.Label>
                  <Form.Control type="email" name="email" value={form.email} onChange={handleUserChange} />
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>Phone *</Form.Label>
                  <Form.Control name="phone" value={form.phone} onChange={handleUserChange} />
                </Form.Group>

                {/* <Form.Group className="mb-4">
                  <Form.Label>Password *</Form.Label>
                  <Form.Control type="password" name="password" value={form.password} onChange={handleUserChange} />
                </Form.Group> */}
                <Form.Group className="mb-4">
  <Form.Label>Password *</Form.Label>

  <div className="position-relative">
    <Form.Control
      type={showPassword ? "text" : "password"}
      name="password"
      value={form.password}
      onChange={handleUserChange}
      style={{ paddingRight: "45px" }}
      autoComplete="off"
    />

    <span
      onClick={() => setShowPassword(!showPassword)}
      style={{
        position: "absolute",
        top: "50%",
        right: "12px",
        transform: "translateY(-50%)",
        cursor: "pointer",
        color: "#f97316", // orange shade
      }}
    >
      {showPassword ? <FaEyeSlash /> : <FaEye />}
    </span>
  </div>
</Form.Group>
<Form.Group className="mb-4">
  <Form.Label>Confirm Password *</Form.Label>

  <div className="position-relative">
    <Form.Control
      type={showConfirmPassword ? "text" : "password"}
      name="confirmPassword"
      value={form.confirmPassword}
      onChange={handleUserChange}
      style={{ paddingRight: "45px" }}
      autoComplete="off"
    />

    <span
      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
      style={{
        position: "absolute",
        top: "50%",
        right: "12px",
        transform: "translateY(-50%)",
        cursor: "pointer",
        color: "#f97316",
      }}
    >
      {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
    </span>
  </div>
</Form.Group>



                {/* LISTING */}
                <Form.Group className="mb-3">
                  <Form.Label>Shop Name *</Form.Label>
                  <Form.Control name="shopName" value={listing.shopName} onChange={handleListingChange} />
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>City *</Form.Label>
                  <Form.Select name="city" value={listing.city} onChange={handleListingChange}>
                    <option value="">--Select--</option>
                    {cities.map((c) => (
                      <option key={c._id} value={c._id}>{c.city}</option>
                    ))}
                  </Form.Select>
                </Form.Group>

                {/* MULTI TYPE */}
                <Form.Group className="mb-3">
                  <Form.Label>Type *</Form.Label>
                  <Select
                    isMulti
                    options={petCategories.map(pc => ({
                      value: pc._id,
                      label: pc.categoryName,
                    }))}
                    value={petCategories
                      .filter(p => listing.petCategories.includes(p._id))
                      .map(p => ({ value: p._id, label: p.categoryName }))
                    }
                    onChange={(selected) =>
                      setListing(prev => ({
                        ...prev,
                        petCategories: selected.map(s => s.value),
                      }))
                    }
                  />
                </Form.Group>

                {/* MULTI CATEGORY */}
                <Form.Group className="mb-4">
                  <Form.Label>Category *</Form.Label>
                  <Select
                    isMulti
                    isDisabled={!categories.length}
                    options={categories.map(c => ({
                      value: c._id,
                      label: c.categoryName,
                    }))}
                    value={categories
                      .filter(c => listing.categories.includes(c._id))
                      .map(c => ({ value: c._id, label: c.categoryName }))
                    }
                    onChange={(selected) =>
                      setListing(prev => ({
                        ...prev,
                        categories: selected.map(s => s.value),
                      }))
                    }
                  />
                </Form.Group>

                <div className="text-center">
                  <Button
                    type="submit"
                    className="bg-orange-500 text-white border-0 px-4"
                    disabled={loading}
                  >
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
