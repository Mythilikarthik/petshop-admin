// import React, { useState } from "react";
// import { Form, Button, Alert, Spinner } from "react-bootstrap";
// import { useAuth } from "../contexts/AuthContext";
// const API_BASE =
//   process.env.NODE_ENV === "production"
//     ? process.env.REACT_APP_API_URL
//     : "http://localhost:5000";

// const SignupForm = ({ onSuccess }) => {
//     const { login } = useAuth();
//   const [form, setForm] = useState({
//     name: "",
//     email: "",
//     password: "",
//   });

//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState("");

//   const handleChange = (e) => {
//     setForm({ ...form, [e.target.name]: e.target.value });
//   };

//   // const handleSubmit = async (e) => {
//   //   e.preventDefault();
//   //   setError("");
//   //   setLoading(true);

//   //   try {
//   //     const res = await fetch(`${API_BASE}/api/auth/register`, {
//   //       method: "POST",
//   //       headers: { "Content-Type": "application/json" },
//   //       body: JSON.stringify(form),
//   //     });

//   //     const data = await res.json();

//   //     if (!res.ok || !data.success) {
//   //       throw new Error(data.message || "Signup failed");
//   //     }

//   //     // Auto-login after signup
//   //     localStorage.setItem("token", data.token);
//   //     localStorage.setItem("user", JSON.stringify(data.user));

//   //     onSuccess?.();
//   //   } catch (err) {
//   //     setError(err.message);
//   //   } finally {
//   //     setLoading(false);
//   //   }
//   // };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setLoading(true);
//     setError("");

//     try {
//       const res = await fetch(`${API_BASE}/api/auth/site/register`, {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify(form),
//       });

//       const data = await res.json();
//       if (!data.success) throw new Error(data.message);

//       login(data.user, data.token);   // 🔥 auto-login
//       onSuccess?.();
//     } catch (err) {
//       setError(err.message);
//     } finally {
//       setLoading(false);
//     }
//   };
//   return (
//     <Form onSubmit={handleSubmit}>
//       {error && <Alert variant="danger">{error}</Alert>}

//       <Form.Group className="mb-3">
//         <Form.Label>Name</Form.Label>
//         <Form.Control
//           name="name"
//           value={form.name}
//           onChange={handleChange}
//           required
//         />
//       </Form.Group>

//       <Form.Group className="mb-3">
//         <Form.Label>Email</Form.Label>
//         <Form.Control
//           name="email"
//           type="email"
//           value={form.email}
//           onChange={handleChange}
//           required
//         />
//       </Form.Group>

//       <Form.Group className="mb-3">
//         <Form.Label>Password</Form.Label>
//         <Form.Control
//           name="password"
//           type="password"
//           value={form.password}
//           onChange={handleChange}
//           required
//         />
//       </Form.Group>

//       <Button type="submit" className="w-100" disabled={loading}>
//         {loading ? <Spinner size="sm" /> : "Create Account"}
//       </Button>
//     </Form>
//   );
// };

// export default SignupForm;

import React, { useState } from "react";
import { Form, Button, Alert, Spinner, InputGroup } from "react-bootstrap";
import { useAuth } from "../contexts/AuthContext";
import { BsEye, BsEyeSlash } from "react-icons/bs";

const API_BASE =
  process.env.NODE_ENV === "production"
    ? process.env.REACT_APP_API_URL
    : "http://localhost:5000";

const SignupForm = ({ onSuccess }) => {
  const { login } = useAuth();

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "", // ✅ NEW
  });

  const [showPassword, setShowPassword] = useState(false); // 👁 toggle
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    // ✅ VALIDATION
    if (form.password !== form.confirmPassword) {
      setError("Passwords do not match");
      setLoading(false);
      return;
    }

    try {
      const res = await fetch(`${API_BASE}/api/auth/site/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: form.name,
          email: form.email,
          password: form.password, // don't send confirmPassword
        }),
      });

      const data = await res.json();
      if (!data.success) throw new Error(data.message);

      login(data.user, data.token);
      onSuccess?.();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Form onSubmit={handleSubmit}>
      {error && <Alert variant="danger">{error}</Alert>}

      {/* NAME */}
      <Form.Group className="mb-3">
        <Form.Label>Name</Form.Label>
        <Form.Control
          name="name"
          value={form.name}
          onChange={handleChange}
          required
        />
      </Form.Group>

      {/* EMAIL */}
      <Form.Group className="mb-3">
        <Form.Label>Email</Form.Label>
        <Form.Control
          name="email"
          type="email"
          value={form.email}
          onChange={handleChange}
          required
        />
      </Form.Group>

      {/* PASSWORD */}
      <Form.Group className="mb-3">
        <Form.Label>Password</Form.Label>
        <InputGroup>
          <Form.Control
            name="password"
            type={showPassword ? "text" : "password"}
            value={form.password}
            onChange={handleChange}
            required
          />
          <Button
            variant="outline-secondary"
            onClick={() => setShowPassword(!showPassword)}
          >
            {showPassword ? <BsEyeSlash /> : <BsEye />}
          </Button>
        </InputGroup>
      </Form.Group>

      {/* CONFIRM PASSWORD */}
      <Form.Group className="mb-3">
        <Form.Label>Confirm Password</Form.Label>
        <InputGroup>
          <Form.Control
            name="confirmPassword"
            type={showConfirmPassword ? "text" : "password"}
            value={form.confirmPassword}
            onChange={handleChange}
            required
          />
          <Button
            variant="outline-secondary"
            onClick={() =>
              setShowConfirmPassword(!showConfirmPassword)
            }
          >
            {showConfirmPassword ? <BsEyeSlash /> : <BsEye />}
          </Button>
        </InputGroup>
      </Form.Group>

      <Button type="submit" className="w-100" disabled={loading}>
        {loading ? <Spinner size="sm" /> : "Create Account"}
      </Button>
    </Form>
  );
};

export default SignupForm;