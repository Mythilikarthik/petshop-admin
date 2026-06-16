// import React, { useEffect, useState } from "react";
// import { Form, Button, Container, Row, Col, Alert } from "react-bootstrap";
// import Select from "react-select";
// import { FaEye, FaEyeSlash } from "react-icons/fa";

// const API_BASE =
//   process.env.NODE_ENV === "production"
//     ? process.env.REACT_APP_API_URL
//     : "http://localhost:5000";
// const LOGIM_URI =
//   process.env.NODE_ENV === "production"
//     ? process.env.REACT_APP_USER_API_URL
//     : "http://localhost:3001";

// const Register = () => {
//   /* ---------------- USER ---------------- */
//   const [showPassword, setShowPassword] = useState(false);
//   const [showConfirmPassword, setShowConfirmPassword] = useState(false);
//   const [form, setForm] = useState({
//     name: "",
//     username: "",
//     email: "",
//     phone: "",
//     password: "",
//     confirmPassword: "",
//   });

//   /* ---------------- LISTING ---------------- */
//   const [listing, setListing] = useState({
//     shopName: "",
//     city: "",
//     petCategories: [],
//     categories: [],
//   });

//   /* ---------------- DROPDOWNS ---------------- */
//   const [cities, setCities] = useState([]);
//   const [petCategories, setPetCategories] = useState([]);
//   const [categories, setCategories] = useState([]);

//   /* ---------------- UI ---------------- */
//   const [alert, setAlert] = useState({ show: false, type: "", message: "" });
//   const [loading, setLoading] = useState(false);

//   /* ---------------- INITIAL LOAD ---------------- */
//   useEffect(() => {
//     loadInitialData();
//   }, []);

//   const loadInitialData = async () => {
//     try {
//       const [cityRes, petRes] = await Promise.all([
//         fetch(`${API_BASE}/api/city/show`),
//         fetch(`${API_BASE}/api/pet-category/show`),
//       ]);

//       const cityData = await cityRes.json();
//       const petData = await petRes.json();

//       setCities(cityData.cities || []);
//       setPetCategories(petData.petCategories || []);
//     } catch (err) {
//       console.error("Failed loading dropdowns");
//     }
//   };

//   /* ---------------- TYPE → CATEGORY ---------------- */
//   useEffect(() => {
//     if (!listing.petCategories.length) {
//       setCategories([]);
//       setListing((prev) => ({ ...prev, categories: [] }));
//       return;
//     }

//     fetchCategoriesByTypes(listing.petCategories);
//   }, [listing.petCategories]);

//   const fetchCategoriesByTypes = async (petCategoryIds) => {
//     try {
//       const res = await fetch(`${API_BASE}/api/category/byPetCategories`, {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({ petCategories: petCategoryIds }),
//       });

//       const data = await res.json();

//       if (data.success) {
//         setCategories(data.categories || []);
//       } else {
//         setCategories([]);
//       }

//       setListing((prev) => ({ ...prev, categories: [] }));
//     } catch (err) {
//       console.error("Category fetch failed");
//       setCategories([]);
//     }
//   };

//   /* ---------------- HANDLERS ---------------- */
//   // const handleUserChange = (e) =>
//   //   setForm({ ...form, [e.target.name]: e.target.value });
//   const USERNAME_REGEX = /^[a-zA-Z0-9_]+$/;
//   const handleUserChange = (e) => {
//   const { name, value } = e.target;

//   // Username validation (no space, no special chars)
//   if (name === "username") {
//     // Prevent spaces
//     if (value.includes(" ")) return;

//     // Allow only letters, numbers, underscore
//     if (value && !USERNAME_REGEX.test(value)) return;
//   }

//   setForm({ ...form, [name]: value });
// };


//   const handleListingChange = (e) =>
//     setListing({ ...listing, [e.target.name]: e.target.value });

//   /* ---------------- VALIDATION ---------------- */
//   // const validateForm = () => {
//   //   if (!form.name) return "Name required";
//   //   if (!form.username) return "Username required";
//   //   if (!form.email) return "Email required";
//   //   if (!form.phone) return "Phone required";
//   //   if (!form.password) return "Password required";
//   //   if (!listing.shopName) return "Shop name required";
//   //   if (!listing.city) return "City required";
//   //   if (!listing.petCategories.length) return "Type required";
//   //   if (!listing.categories.length) return "Category required";
//   //   return null;
//   // };
//   const validateForm = () => {
//   if (!form.name) return "Name required";

//   if (!form.username) return "Username required";
//   if (!USERNAME_REGEX.test(form.username))
//     return "Username can contain only letters, numbers, and underscore (_)";

//   if (!form.email) return "Email required";
//   if (!form.phone) return "Phone required";
//   if (!form.password) return "Password required";
//   if (!form.confirmPassword) return "Confirm your password";
//   if (form.password !== form.confirmPassword)
//     return "Passwords do not match";
//   if (!listing.shopName) return "Shop name required";
//   if (!listing.city) return "City required";
//   if (!listing.petCategories.length) return "Type required";
//   if (!listing.categories.length) return "Category required";

//   return null;
// };


//   /* ---------------- SUBMIT ---------------- */
//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     const error = validateForm();
//     if (error)
//       return setAlert({ show: true, type: "danger", message: error });

//     setLoading(true);

//     try {
//       /* REGISTER USER */
//       const res = await fetch(`${API_BASE}/api/auth/user/register`, {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify(form),
//       });

//       const userData = await res.json();
//       if (!userData.success) throw new Error(userData.message);

//       /* CREATE LISTING */
//       const listingPayload = {
//         shopName: listing.shopName,
//         email: form.email,
//         phone: form.phone,
//         city: listing.city,
//         categories: listing.categories,
//         petCategories: listing.petCategories,
//         created_by_type: "user",
//         created_by_id: userData.id,
//         user_id: userData.id,
//       };

//       await fetch(`${API_BASE}/api/listing/simple`, {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//           Authorization: `Bearer ${userData.token}`,
//         },
//         body: JSON.stringify(listingPayload),
//       });

//       setAlert({
//         show: true,
//         type: "success",
//         message: "Registration & listing created successfully!",
//       });

//       /* RESET */
//       setForm({
//         name: "",
//         username: "",
//         email: "",
//         phone: "",
//         password: "",
//       });

//       setListing({
//         shopName: "",
//         city: "",
//         petCategories: [],
//         categories: [],
//       });

//       setCategories([]);
//     } catch (err) {
//       setAlert({
//         show: true,
//         type: "danger",
//         message: err.message || "Submission failed",
//       });
//     }

//     setLoading(false);
//   };

//   /* ---------------- UI ---------------- */
//   return (
//     <div className="register">
//       <Container className="py-5">
//         <Row className="justify-content-center shadow-lg rounded">
//           {/* LEFT */}
//           <Col md={6} className="bg-color text-white d-flex align-items-center justify-content-center">
//             <div className="p-5 text-center">
//               <h3>Welcome to PetShop Admin</h3>
//               <p>Create account & list your shop easily</p>
//             </div>
//           </Col>

//           {/* RIGHT */}
//           <Col md={6} className="p-0">
//             <div className="bg-grey p-5">
//               <h3 className="text-center mb-2 text-orange-500">
//                 Register & Create Listing
//               </h3>
//               <small className="d-block text-center mb-4 text-muted">Already have an account? <a href={LOGIM_URI}><b>Login</b></a></small>

//               {alert.show && (
//                 <Alert variant={alert.type} dismissible onClose={() => setAlert({ show: false })}>
//                   {alert.message}
//                 </Alert>
//               )}

//               <Form onSubmit={handleSubmit}>
//                 {/* USER */}
//                 <Form.Group className="mb-3">
//                   <Form.Label>Name *</Form.Label>
//                   <Form.Control name="name" value={form.name} onChange={handleUserChange} />
//                 </Form.Group>

//                 <Form.Group className="mb-3">
//                   <Form.Label>Username *</Form.Label>
//                   <Form.Control name="username" value={form.username} onChange={handleUserChange} autoComplete="off" />
//                 </Form.Group>

//                 <Form.Group className="mb-3">
//                   <Form.Label>Email *</Form.Label>
//                   <Form.Control type="email" name="email" value={form.email} onChange={handleUserChange} />
//                 </Form.Group>

//                 <Form.Group className="mb-3">
//                   <Form.Label>Phone *</Form.Label>
//                   <Form.Control name="phone" value={form.phone} onChange={handleUserChange} />
//                 </Form.Group>

//                 {/* <Form.Group className="mb-4">
//                   <Form.Label>Password *</Form.Label>
//                   <Form.Control type="password" name="password" value={form.password} onChange={handleUserChange} />
//                 </Form.Group> */}
//                 <Form.Group className="mb-4">
//   <Form.Label>Password *</Form.Label>

//   <div className="position-relative">
//     <Form.Control
//       type={showPassword ? "text" : "password"}
//       name="password"
//       value={form.password}
//       onChange={handleUserChange}
//       style={{ paddingRight: "45px" }}
//       autoComplete="off"
//     />

//     <span
//       onClick={() => setShowPassword(!showPassword)}
//       style={{
//         position: "absolute",
//         top: "50%",
//         right: "12px",
//         transform: "translateY(-50%)",
//         cursor: "pointer",
//         color: "#f97316", // orange shade
//       }}
//     >
//       {showPassword ? <FaEyeSlash /> : <FaEye />}
//     </span>
//   </div>
// </Form.Group>
// <Form.Group className="mb-4">
//   <Form.Label>Confirm Password *</Form.Label>

//   <div className="position-relative">
//     <Form.Control
//       type={showConfirmPassword ? "text" : "password"}
//       name="confirmPassword"
//       value={form.confirmPassword}
//       onChange={handleUserChange}
//       style={{ paddingRight: "45px" }}
//       autoComplete="off"
//     />

//     <span
//       onClick={() => setShowConfirmPassword(!showConfirmPassword)}
//       style={{
//         position: "absolute",
//         top: "50%",
//         right: "12px",
//         transform: "translateY(-50%)",
//         cursor: "pointer",
//         color: "#f97316",
//       }}
//     >
//       {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
//     </span>
//   </div>
// </Form.Group>



//                 {/* LISTING */}
//                 <Form.Group className="mb-3">
//                   <Form.Label>Shop Name *</Form.Label>
//                   <Form.Control name="shopName" value={listing.shopName} onChange={handleListingChange} />
//                 </Form.Group>

//                 <Form.Group className="mb-3">
//                   <Form.Label>City *</Form.Label>
//                   <Form.Select name="city" value={listing.city} onChange={handleListingChange}>
//                     <option value="">--Select--</option>
//                     {cities.map((c) => (
//                       <option key={c._id} value={c._id}>{c.city}</option>
//                     ))}
//                   </Form.Select>
//                 </Form.Group>

//                 {/* MULTI TYPE */}
//                 <Form.Group className="mb-3">
//                   <Form.Label>Type *</Form.Label>
//                   <Select
//                     isMulti
//                     options={petCategories.map(pc => ({
//                       value: pc._id,
//                       label: pc.categoryName,
//                     }))}
//                     value={petCategories
//                       .filter(p => listing.petCategories.includes(p._id))
//                       .map(p => ({ value: p._id, label: p.categoryName }))
//                     }
//                     onChange={(selected) =>
//                       setListing(prev => ({
//                         ...prev,
//                         petCategories: selected.map(s => s.value),
//                       }))
//                     }
//                   />
//                 </Form.Group>

//                 {/* MULTI CATEGORY */}
//                 <Form.Group className="mb-4">
//                   <Form.Label>Category *</Form.Label>
//                   <Select
//                     isMulti
//                     isDisabled={!categories.length}
//                     options={categories.map(c => ({
//                       value: c._id,
//                       label: c.categoryName,
//                     }))}
//                     value={categories
//                       .filter(c => listing.categories.includes(c._id))
//                       .map(c => ({ value: c._id, label: c.categoryName }))
//                     }
//                     onChange={(selected) =>
//                       setListing(prev => ({
//                         ...prev,
//                         categories: selected.map(s => s.value),
//                       }))
//                     }
//                   />
//                 </Form.Group>

//                 <div className="text-center">
//                   <Button
//                     type="submit"
//                     className="bg-orange-500 text-white border-0 px-4"
//                     disabled={loading}
//                   >
//                     {loading ? "Submitting..." : "Register & Create Listing"}
//                   </Button>
//                 </div>
//               </Form>
//             </div>
//           </Col>
//         </Row>
//       </Container>
//     </div>
//   );
// };

// export default Register;
import React, { useEffect, useState } from "react";
import { Form, Button, Container, Row, Col, Alert } from "react-bootstrap";
import Select from "react-select";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { useRef } from "react";
import { validateField, USERNAME_REGEX } from "../utils/formValidation";

const API_BASE =
  process.env.NODE_ENV === "production"
    ? process.env.REACT_APP_API_URL
    : "http://localhost:5000";

const LOGIN_URI =
  process.env.NODE_ENV === "production"
    ? process.env.REACT_APP_USER_API_URL
    : "http://localhost:3001";

const Register = () => {
const navigate= useNavigate();

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PHONE_REGEX = /^[6-9]\d{9}$/;
const alertRef = useRef(null);
  const formRef = useRef(null);
  /* ---------------- USER ---------------- */
  const [form, setForm] = useState({
    name: "",
    username: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
  });

  /* ---------------- EXTRA (NEW) ---------------- */
  const [role, setRole] = useState("");
  const [verificationMethod, setVerificationMethod] = useState("");
  const [documents, setDocuments] = useState([]);

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
  const [services, setServices] = useState([]);
  const [selectedServices, setSelectedServices] = useState([]);

  /* ---------------- UI ---------------- */
  const [alert, setAlert] = useState({ show: false, type: "", message: "" });
  const [loading, setLoading] = useState(false);

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const USERNAME_REGEX = /^[a-zA-Z0-9_]+$/;
  useEffect(() => {
    if (alert.show && alertRef.current) {
      alertRef.current.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  }, [alert]);
  useEffect(() => {
  if (!listing.categories.length) {
    setServices([]);
    setSelectedServices([]);
    return;
  }

  fetch(`${API_BASE}/api/specialized-service/byCategories`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      categories: listing.categories,
    }),
  })
    .then((res) => res.json())
    .then((data) => {
      if (data.success) {
        setServices(data.services || []);
      } else {
        setServices([]);
      }
      setSelectedServices([]);
    })
    .catch(() => setServices([]));
}, [listing.categories]);
console.log("services", services);

  /* ---------------- LOAD ---------------- */
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
      console.error(err);
    }
  };

  /* ---------------- CATEGORY FILTER ---------------- */
  useEffect(() => {
    if (!listing.petCategories.length) {
      setCategories([]);
      return;
    }

    fetch(`${API_BASE}/api/category/byPetCategories`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ petCategories: listing.petCategories }),
    })
      .then((res) => res.json())
      .then((data) => setCategories(data.categories || []))
      .catch(() => setCategories([]));
  }, [listing.petCategories]);

  /* ---------------- HANDLERS ---------------- */
  // const handleUserChange = (e) => {
  //   const { name, value } = e.target;

  //   if (name === "username") {
  //     if (value.includes(" ")) return;
  //     if (value && !USERNAME_REGEX.test(value)) return;
  //   }

  //   setForm({ ...form, [name]: value });
  // };
  const handleUserChange = (e) => {
  let { name, value } = e.target;

  if (name === "username") {
    // ✅ remove all spaces automatically
    value = value.replace(/\s/g, "");

    // ✅ allow only letters, numbers, underscore
    if (value && !USERNAME_REGEX.test(value)) return;
  }
if (name === "username" && value.length > 20) return;
  setForm({ ...form, [name]: value });
};

  const handleListingChange = (e) =>
    setListing({ ...listing, [e.target.name]: e.target.value });

  /* ---------------- VALIDATION ---------------- */
  // const validateForm = () => {
  //   if (!form.name) return "Name required";
  //   if (!form.username) return "Username required";
  //   if (!USERNAME_REGEX.test(form.username))
  //     return "Invalid username";

  //   if (!form.email) return "Email required";
  //   if (!form.phone) return "Phone required";
  //   if (!form.password) return "Password required";
  //   if (form.password !== form.confirmPassword)
  //     return "Passwords do not match";

  //   if (!listing.shopName) return "Shop name required";
  //   if (!listing.city) return "City required";
  //   if (!listing.petCategories.length) return "Type required";
  //   if (!listing.categories.length) return "Category required";

  //   if (!role) return "Role required";
  //   if (!verificationMethod) return "Verification method required";

  //   return null;
  // };

  const validateForm = () => {
  const fieldsToValidate = ["name", "username", "email", "phone", "password"];
  
  for (let field of fieldsToValidate) {
    const errorMsg = validateField(field, form[field], {maxLength: 50});
    if (errorMsg) return errorMsg;
  }

  // Validate confirmation password matching rule
  const confirmError = validateField("confirmPassword", form.confirmPassword, {
    passwordMatch: form.password
  });
  if (confirmError) return confirmError;
  if (!form.name) return "Name required";

  if (!form.username) return "Username required";
  if (!USERNAME_REGEX.test(form.username))
    return "Invalid username";

  if (!form.email) return "Email required";

  // ✅ EMAIL VALIDATION
  if (!EMAIL_REGEX.test(form.email))
    return "Enter valid email address";

  if (!form.phone) return "Phone required";

if (!PHONE_REGEX.test(form.phone))
  return "Enter valid 10-digit phone number";

  if (!form.password) return "Password required";

  if (!form.confirmPassword)
    return "Confirm your password";

  if (form.password !== form.confirmPassword)
    return "Passwords do not match";

  if (!listing.shopName) return "Shop name required";
  if (!listing.city) return "City required";
  if (!listing.petCategories.length) return "Type required";
  if (!listing.categories.length) return "Category required";

  if (!role) return "Role required";
  if (!verificationMethod) return "Verification method required";

  return null;
};

  /* ---------------- SUBMIT ---------------- */
  const handleSubmit = async (e) => {
    e.preventDefault();

    const error = validateForm();
    if (error) {
      setAlert({ show: true, type: "danger", message: error });
      return;
    }

    setLoading(true);

    try {
      // 🔥 Use FormData (important for file upload)
      const formData = new FormData();

      // user
      Object.keys(form).forEach((key) =>
        formData.append(key, form[key])
      );

      // listing
      formData.append("shopName", listing.shopName);
      formData.append("city", listing.city);
      formData.append("petCategories", JSON.stringify(listing.petCategories));
      formData.append("categories", JSON.stringify(listing.categories));
      formData.append(
  "specializedServices",
  JSON.stringify(selectedServices)
);

      // new fields
      formData.append("role", role);
      formData.append("verificationMethod", verificationMethod);

      documents.forEach((file) => {
        formData.append("documents", file);
      });

      const res = await fetch(`${API_BASE}/api/auth/user/register-with-listing`, {
        method: "POST",
        body: formData,
      });

      const data = await res.json();

      if (!data.success) throw new Error(data.message);

      // ✅ redirect based on verification
      if (verificationMethod === "email") {
  navigate("/verify-otp", {
    state: {
      userId: data.userId,
      token: data.token,
      email: form.email,
      phone: form.phone,
    },
  });
} else {
        setAlert({
          show: true,
          type: "success",
          message: "Registered successfully!",
        });
        setForm({ name: "", username: "", email: "", phone: "", password: "", confirmPassword: "" });
        setListing({ shopName: "", city: "", petCategories: [], categories: [] });
        setRole("");
        setVerificationMethod("");
        setDocuments([]);
        setSelectedServices([]);
        setCategories([]);
        setServices([]);
        
        if (formRef.current) formRef.current.reset();
      }

    } catch (err) {
      setAlert({
        show: true,
        type: "danger",
        message: err.message,
      });
    }

    setLoading(false);
  };
  const petCategoryOptions = [
  { value: "ALL", label: "All Types" }, // 👈 important
  ...petCategories.map(p => ({
    value: p._id,
    label: p.categoryName,
  }))
];

  /* ---------------- UI ---------------- */
  return (
    <div className="register">
      <Container className="py-5">
        <Row className="shadow-lg rounded">
          
          {/* LEFT */}
          <Col md={6} className="bg-color text-white d-flex align-items-center justify-content-center">
             <div className="p-5 text-center">
               <h3>Welcome to VetandPets Admin</h3>
               <p>Create account & list your shop easily</p>
             </div>
           </Col>

          {/* RIGHT */}
          <Col md={6} className="p-4">
            <h3 className="text-center mb-2 text-orange-500">
                 Register & Create Listing
               </h3>
               <small className="d-block text-center mb-4 text-muted">Already have an account? <a href={LOGIN_URI}><b>Login</b></a></small>

          <div ref={alertRef}>
            {alert.show && (
              <Alert variant={alert.type}>
                {alert.message}
              </Alert>
            )}
          </div>
            <Form ref={formRef} onSubmit={handleSubmit}>

              {/* USER */}
              <Form.Control className="mb-2" placeholder="Name" name="name" onChange={handleUserChange} />
              <Form.Control className="mb-2" placeholder="Username" name="username" onChange={handleUserChange}  value={form.username} />
              <Form.Control className="mb-2" placeholder="Email" name="email" onChange={handleUserChange} />
              <Form.Control className="mb-2" placeholder="Phone" name="phone" onChange={handleUserChange} />

              {/* PASSWORD */}
              {/* <Form.Control className="mb-2" type="password" placeholder="Password" name="password" onChange={handleUserChange} />
              <Form.Control className="mb-3" type="password" placeholder="Confirm Password" name="confirmPassword" onChange={handleUserChange} /> */}
              <Form.Group className="mb-2 position-relative">
  <Form.Control
    type={showPassword ? "text" : "password"}
    placeholder="Password"
    name="password"
    value={form.password}
    onChange={handleUserChange}
    style={{ paddingRight: "45px" }}
  />

  <span
    onClick={() => setShowPassword(!showPassword)}
    style={{
      position: "absolute",
      top: "50%",
      right: "12px",
      transform: "translateY(-50%)",
      cursor: "pointer",
      color: "#f97316",
    }}
  >
    {showPassword ? <FaEyeSlash /> : <FaEye />}
  </span>
</Form.Group>
<Form.Group className="mb-3 position-relative">
  <Form.Control
    type={showConfirmPassword ? "text" : "password"}
    placeholder="Confirm Password"
    name="confirmPassword"
    value={form.confirmPassword}
    onChange={handleUserChange}
    style={{ paddingRight: "45px" }}
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
</Form.Group>

              {/* ROLE */}
              <Form.Select className="mb-3" onChange={(e) => setRole(e.target.value)}>
                <option value="">Select Role</option>
                <option value="owner">Owner</option>
                <option value="manager">Manager</option>
                <option value="staff">Staff</option>
              </Form.Select>

              {/* VERIFICATION */}
              <Form.Check
                id="verify-email" 
                type="radio"
                label="Email Verification"
                value="email"
                checked={verificationMethod === "email"}
                onChange={(e) => setVerificationMethod(e.target.value)}
              />
              <Form.Check
                id="verify-document" 
                type="radio"
                label="Document Upload"
                value="document"
                checked={verificationMethod === "document"}
                onChange={(e) => setVerificationMethod(e.target.value)}
              />

              {/* FILE */}
              {verificationMethod === "document" && (
                <Form.Control
                  type="file"
                  multiple
                  className="mt-2"
                  onChange={(e) =>
                    setDocuments(Array.from(e.target.files))
                  }
                />
              )}

              {/* SHOP */}
              <Form.Control className="mt-3 mb-2" placeholder="Shop Name" name="shopName" onChange={handleListingChange} />

              {/* CITY */}
              <Form.Select className="mb-3" name="city" onChange={handleListingChange}>
                <option value="">Select City</option>
                {cities.map((c) => (
                  <option key={c._id} value={c._id}>{c.city}</option>
                ))}
              </Form.Select>

              {/* PET CATEGORY */}
              {/* <Select
                isMulti
                options={petCategories.map(p => ({
                  value: p._id,
                  label: p.categoryName,
                }))}
                onChange={(selected) =>
                  setListing(prev => ({
                    ...prev,
                    petCategories: selected.map(s => s.value),
                  }))
                }
                placeholder="Select Type"
              /> */}
              <Select
                isMulti
                options={petCategoryOptions}
                onChange={(selected) => {
                  const values = selected.map(s => s.value);

                  // ✅ If "ALL" selected
                  if (values.includes("ALL")) {
                    const allIds = petCategories.map(p => p._id);

                    setListing(prev => ({
                      ...prev,
                      petCategories: allIds,
                    }));
                  } else {
                    setListing(prev => ({
                      ...prev,
                      petCategories: values,
                    }));
                  }
                }}
                value={
  listing.petCategories.length === petCategories.length
    ? [{ value: "ALL", label: "All Types" }]
    : petCategories
        .filter(p => listing.petCategories.includes(p._id))
        .map(p => ({
          value: p._id,
          label: p.categoryName,
        }))
}
                placeholder="Select Type"
              />

              {/* CATEGORY */}
              <Select
                isMulti
                className="mt-3"
                options={categories.map(c => ({
                  value: c._id,
                  label: c.categoryName,
                }))}
                value={categories
                  .filter(c => listing.categories.includes(c._id))
                  .map(c => ({ value: c._id, label: c.categoryName }))
                }
                onChange={(selected) =>
                {
                  setListing(prev => ({
                    ...prev,
                    categories: selected.map(s => s.value),
                  }))
                  
                }
                }
                placeholder="Select Category"
              />
              <Select
  isMulti
  className="mt-3"
  isDisabled={!services.length}
  options={services.map((s) => ({
    value: s._id,
    label: s.serviceName,
  }))}
  value={services
    .filter(s => selectedServices.includes(s._id))
    .map(s => ({ value: s._id, label: s.serviceName }))
  }
  onChange={(selected) =>
    setSelectedServices(selected.map((s) => s.value))
  }
  placeholder="Select Specialized Services"
/>

              {/* <Button className="mt-4 w-100" type="submit" disabled={loading}>
                {loading ? "Submitting..." : "Register"}
              </Button> */}
                  <Button
                     type="submit"
                     className="mt-4 w-100 bg-orange-500 text-white border-0 px-4"
                     disabled={loading}
                   >
                     {loading ? "Submitting..." : "Register & Create Listing"}
                   </Button>
            </Form>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default Register;