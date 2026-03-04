// import React, { useState, useEffect } from "react";
// import { useParams, useNavigate } from "react-router-dom";
// import { Container, Row, Col, Form, Button, Alert } from "react-bootstrap";
// import { FaEye, FaEyeSlash } from "react-icons/fa";
// const API_BASE =
//   process.env.NODE_ENV === "production"
//     ? "https://petshop-admin.onrender.com"
//     : "http://localhost:5000";

// const ClaimListing = () => {
//   const { listingId } = useParams();
//   const navigate = useNavigate();
//   const [aler, setAlert] = useState({ show: false, type: "", message: "" });
//   const [loading, setLoading] = useState(false);
// const [usernameError, setUsernameError] = useState("");
//   const [listing, setListing] = useState(null);
//   const [showPassword, setShowPassword] = useState(false);
// const [showConfirmPassword, setShowConfirmPassword] = useState(false);
// const [confirmPassword, setConfirmPassword] = useState("");
// const [passwordError, setPasswordError] = useState("");
// const [claimRole, setClaimRole] = useState("");
// const [verificationMethod, setVerificationMethod] = useState("");
// const [documents, setDocuments] = useState([]);

//   const [user, setUser] = useState({
//     name: "",
//     username: "",
//     email: "",
//     phone: "",
//     password: "",
//   });

//   useEffect(() => {
//     loadListing();
//   }, []);

//   const loadListing = async () => {
//     const res = await fetch(`${API_BASE}/api/listing/${listingId}`);
//     const data = await res.json();

//     if (data.success) {
//         if(!data.listing.isClaimed) {
//             setListing(data.listing);
//             setUser({...user, email : data.listing.email, phone : data.listing.phone})
//         } else {
//             navigate("/directory")
//         }
      
//     }
//   };

//   // const handleUserChange = (e) => {
//   //   setUser({ ...user, [e.target.name]: e.target.value });
//   // };
//   const handleUserChange = (e) => {
//   const { name, value } = e.target;

//   if (name === "username") {
//     const regex = /^[a-zA-Z0-9_]*$/; // allow typing
//     if (!regex.test(value)) {
//       setUsernameError("Username can contain only letters, numbers, and underscore");
//       return;
//     } else {
//       setUsernameError("");
//     }
//   }

//   setUser({ ...user, [name]: value });
// };


// //   const handleSubmit = async (e) => {
// //     e.preventDefault();
// //     const usernameRegex = /^[a-zA-Z0-9_]+$/;

// //   if (!usernameRegex.test(user.username)) {
// //     setAlert({
// //       show: true,
// //       type: "danger",
// //       message: "Username can contain only letters, numbers, and underscore",
// //     });
// //     return;
// //   }
// // if (user.password !== confirmPassword) {
// //   setAlert({
// //     show: true,
// //     type: "danger",
// //     message: "Password and Confirm Password do not match",
// //   });
// //   return;
// // }
// //     // 1. Register user
// //     const userRes = await fetch(`${API_BASE}/api/auth/user/register`, {
// //       method: "POST",
// //       headers: { "Content-Type": "application/json" },
// //       body: JSON.stringify(user),
// //     });

// //     const userData = await userRes.json();
// //     if (!userData.success) {
// //       alert(userData.message);
// //       return;
// //     }

// //     const token = userData.token;
// //     const userId = userData.id;

// //     // 2. Mark listing as claimed
// //     await fetch(`${API_BASE}/api/listing/claim/${listingId}`, {
// //       method: "PUT",
// //       headers: {
// //         "Content-Type": "application/json",
// //         Authorization: `Bearer ${token}`,
// //       },
// //       body: JSON.stringify({ claimedBy: userId }),
// //     });

// //     alert("Listing claimed successfully!");
// //     navigate("/directory");
// //   };

// const handleSubmit = async (e) => {
//   e.preventDefault();
//   setLoading(true);

//   try {
//     const usernameRegex = /^[a-zA-Z0-9_]+$/;

//     if (!usernameRegex.test(user.username)) {
//       setAlert({
//         show: true,
//         type: "danger",
//         message: "Username can contain only letters, numbers, and underscore",
//       });
//       setLoading(false);
//       return;
//     }

//     if (user.password !== confirmPassword) {
//       setAlert({
//         show: true,
//         type: "danger",
//         message: "Password and Confirm Password do not match",
//       });
//       setLoading(false);
//       return;
//     }

//     if (!claimRole || !verificationMethod) {
//       setAlert({
//         show: true,
//         type: "danger",
//         message: "Please select role and verification method",
//       });
//       setLoading(false);
//       return;
//     }

//     // Register
//     const userRes = await fetch(`${API_BASE}/api/auth/user/register`, {
//       method: "POST",
//       headers: { "Content-Type": "application/json" },
//       body: JSON.stringify(user),
//     });

//     const userData = await userRes.json();

//     if (!userData.success) {
//       setAlert({
//         show: true,
//         type: "danger",
//         message: userData.message,
//       });
//       setLoading(false);
//       return;
//     }

//     const { token, id: userId } = userData;

//     // Claim
//     const formData = new FormData();
//     formData.append("claimRole", claimRole);
//     formData.append("verificationMethod", verificationMethod);

//     documents?.forEach((file) => {
//       formData.append("documents", file);
//     });

//     const claimRes = await fetch(
//       `${API_BASE}/api/listing/claim/${listingId}`,
//       {
//         method: "PUT",
//         headers: { Authorization: `Bearer ${token}` },
//         body: formData,
//       }
//     );

//     const claimData = await claimRes.json();
//     console.log(claimData);
//     if (!claimData.success) {
//       setAlert({
//         show: true,
//         type: "danger",
//         message: claimData.message || "Failed to claim listing",
//       });
//       setLoading(false);
//       return;
//     }

//     if (verificationMethod === "email") {
//       navigate("/verify-otp", {
//         state: {
//           userId,
//           token,
//           email: user.email,
//         },
//       });
//     } else {
//       navigate("/directory");
//     }
//   } catch (err) {
//     setAlert({
//       show: true,
//       type: "danger",
//       message: "Something went wrong. Please try again.",
//     });
//   } finally {
//     setLoading(false);
//   }
// };



//   if (!listing) return <p>Loading...</p>;

//   return (
//     <div className="register mt-5 mb-5">
//         <Container className="mt-4">
//       <h3>Claim Your Listing</h3>

      
//       {aler.show && (
//             <Alert
//             variant={aler.type}
//             dismissible
//             onClose={() => setAlert({ show: false })}
//             >
//             {aler.message}
//             </Alert>
//         )}

//         <Form onSubmit={handleSubmit}>
//             {/* LISTING INFO */}
//             <h2>Listing Information</h2>

//             <Form.Group className="mb-3">
//             <Form.Label>Shop Name</Form.Label>
//             <Form.Control value={listing.shopName} disabled />
//             </Form.Group>

//             <Form.Group className="mb-3">
//             <Form.Label>City</Form.Label>
//             <Form.Control value={listing.city.city} disabled />
//             </Form.Group>

//             <Form.Group className="mb-3">
//             <Form.Label>Category</Form.Label>
//             <Form.Control
//                 value={listing.categories[0]?.categoryName}
//                 disabled
//             />
//             </Form.Group>

//             <Form.Group className="mb-4">
//             <Form.Label>Pet Category</Form.Label>
//             <Form.Control
//                 value={listing.petCategories[0]?.categoryName}
//                 disabled
//             />
//             </Form.Group>

//             {/* USER INFO */}
//             <h2>Your Details</h2>

//             <Form.Group className="mb-3">
//             <Form.Label>Name <span className="text-red">*</span></Form.Label>
//             <Form.Control
//                 name="name"
//                 onChange={handleUserChange}
//             />
//             </Form.Group>

//             {/* <Form.Group className="mb-3">
//             <Form.Label>Username <span className="text-red">*</span></Form.Label>
//             <Form.Control
//                 name="username"
//                 onChange={handleUserChange}
//             />
//             </Form.Group>
//              */}
//              <Form.Group className="mb-3">
//               <Form.Label>Username <span className="text-red">*</span></Form.Label>
//               <Form.Control
//                 name="username"
//                 value={user.username}
//                 onChange={handleUserChange}
//                 isInvalid={!!usernameError}
//               />
//               <Form.Control.Feedback type="invalid">
//                 {usernameError}
//               </Form.Control.Feedback>
//             </Form.Group>


//             <Form.Group className="mb-3">
//             <Form.Label>Email <span className="text-red">*</span></Form.Label>
//             <Form.Control
//                 type="email"
//                 name="email"
//                 value={listing.email}
//                 onChange={handleUserChange}
//                 disabled
//             />
//             </Form.Group>

//             <Form.Group className="mb-3">
//             <Form.Label>Phone <span className="text-red">*</span></Form.Label>
//             <Form.Control
//                 name="phone"
//                 value={listing.phone}
//                 onChange={handleUserChange}
//                 disabled
//             />
//             </Form.Group>

//             <Form.Group className="mb-3">
//               <Form.Label>Role <span className="text-danger">*</span></Form.Label>
//               <Form.Select
//                 value={claimRole}
//                 onChange={(e) => setClaimRole(e.target.value)}
//                 required
//               >
//                 <option value="">Select role</option>
//                 <option value="owner">Owner</option>
//                 <option value="manager">Manager</option>
//                 <option value="staff">Staff</option>
//               </Form.Select>
//             </Form.Group>
//             <Form.Group className="mb-3">
//               <Form.Label>Preferred Verification Method <span className="text-danger">*</span></Form.Label>

//               <Form.Check
//                 type="radio"
//                 label="Business Email Verification"
//                 name="verificationMethod"
//                 value="email"
//                 checked={verificationMethod === "email"}
//                 onChange={(e) => setVerificationMethod(e.target.value)}
//               />

//               <Form.Check
//                 type="radio"
//                 label="Document Upload (optional)"
//                 name="verificationMethod"
//                 value="document"
//                 checked={verificationMethod === "document"}
//                 onChange={(e) => setVerificationMethod(e.target.value)}
//               />
//             </Form.Group>
//             {verificationMethod === "document" && (
//               <Form.Group className="mb-4">
//                 <Form.Label>Upload Verification Documents</Form.Label>
//                 <Form.Control
//                   type="file"
//                   multiple
//                   accept="image/*,.pdf"
//                   onChange={(e) => setDocuments(Array.from(e.target.files))}
//                 />
//                 <Form.Text muted>
//                   Business license, ID, utility bill, etc.
//                 </Form.Text>
//               </Form.Group>
//             )}



//             {/* <Form.Group className="mb-4">
//             <Form.Label>Password <span className="text-red">*</span></Form.Label>
//             <Form.Control
//                 type="password"
//                 name="password"
//                 onChange={handleUserChange}
//             />
//             </Form.Group> */}
//             <Form.Group className="mb-3">
//   <Form.Label>Password <span className="text-red">*</span></Form.Label>

//   <div className="position-relative">
//     <Form.Control
//       type={showPassword ? "text" : "password"}
//       name="password"
//       onChange={handleUserChange}
//     />

//     <span
//       onClick={() => setShowPassword(!showPassword)}
//       style={{
//         position: "absolute",
//         right: "12px",
//         top: "50%",
//         transform: "translateY(-50%)",
//         cursor: "pointer",
//         color: "#666",
//       }}
//     >
//       {showPassword ? <FaEyeSlash /> : <FaEye />}
//     </span>
//   </div>
// </Form.Group>
// <Form.Group className="mb-4">
//   <Form.Label>Confirm Password <span className="text-red">*</span></Form.Label>

//   <div className="position-relative">
//     <Form.Control
//       type={showConfirmPassword ? "text" : "password"}
//       value={confirmPassword}
//       onChange={(e) => setConfirmPassword(e.target.value)}
//       isInvalid={passwordError}
//     />

//     <span
//       onClick={() => setShowConfirmPassword(!showConfirmPassword)}
//       style={{
//         position: "absolute",
//         right: "12px",
//         top: "50%",
//         transform: "translateY(-50%)",
//         cursor: "pointer",
//         color: "#666",
//       }}
//     >
//       {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
//     </span>

//     <Form.Control.Feedback type="invalid">
//       Passwords do not match
//     </Form.Control.Feedback>
//   </div>
// </Form.Group>


//             <div className="text-center">
//             <Button type="submit" variant="primary" disabled={loading}>
//                 {loading ? "Claiming..." : "Claim Listing"}
//             </Button>
//             </div>
//         </Form>    
        
//     </Container>
//     </div>
//   );
// };

// export default ClaimListing;
import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Container, Form, Button } from "react-bootstrap";
import { FaEye, FaEyeSlash } from "react-icons/fa";

const API_BASE =
  process.env.NODE_ENV === "production"
    ? "https://petshop-admin.onrender.com"
    : "http://localhost:5000";

const ClaimListing = () => {
  const { listingId } = useParams();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [listing, setListing] = useState(null);

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [confirmPassword, setConfirmPassword] = useState("");
  const [claimRole, setClaimRole] = useState("");
  const [verificationMethod, setVerificationMethod] = useState("");
  const [documents, setDocuments] = useState([]);

  const [user, setUser] = useState({
    name: "",
    username: "",
    email: "",
    phone: "",
    password: "",
  });

  // ✅ All errors in one place
  const [errors, setErrors] = useState({});

  useEffect(() => {
    loadListing();
  }, []);

  const loadListing = async () => {
    const res = await fetch(`${API_BASE}/api/listing/${listingId}`);
    const data = await res.json();

    if (data.success) {
      if (!data.listing.isClaimed) {
        setListing(data.listing);
        setUser((prev) => ({
          ...prev,
          email: data.listing.email,
          phone: data.listing.phone,
        }));
      } else {
        navigate("/directory");
      }
    }
  };

  // ✅ Handle input change + clear field error
  const handleUserChange = (e) => {
    const { name, value } = e.target;

    setUser((prev) => ({
      ...prev,
      [name]: value,
    }));

    setErrors((prev) => ({
      ...prev,
      [name]: "",
    }));
  };

  const handleSubmit = async (e) => {
  e.preventDefault();
  setLoading(true);

  const newErrors = {};
  const usernameRegex = /^[a-zA-Z0-9_]+$/;

  // 🔹 Validation
  if (!user.name.trim()) {
    newErrors.name = "Name is required";
  }

  if (!user.username.trim()) {
    newErrors.username = "Username is required";
  } else if (!usernameRegex.test(user.username)) {
    newErrors.username =
      "Username can contain only letters, numbers, and underscore";
  }

  if (!user.password) {
    newErrors.password = "Password is required";
  }

  if (!confirmPassword) {
    newErrors.confirmPassword = "Confirm Password is required";
  } else if (user.password !== confirmPassword) {
    newErrors.confirmPassword = "Passwords do not match";
  }

  if (!claimRole) {
    newErrors.role = "Please select a role";
  }

  if (!verificationMethod) {
    newErrors.verificationMethod =
      "Please select a verification method";
  }

  if (Object.keys(newErrors).length > 0) {
    setErrors(newErrors);
    setLoading(false);
    return;
  }

  try {
    // 🔥 Create FormData (User + Claim Together)
    const formData = new FormData();

    // User fields
    formData.append("name", user.name);
    formData.append("username", user.username);
    formData.append("email", user.email);
    formData.append("phone", user.phone);
    formData.append("password", user.password);

    // Claim fields
    formData.append("claimRole", claimRole);
    formData.append("verificationMethod", verificationMethod);

    // Documents (if any)
    documents?.forEach((file) => {
      formData.append("documents", file);
    });

    // 🔥 Single API call
    const res = await fetch(
      `${API_BASE}/api/listing/claim/${listingId}`,
      {
        method: "PUT",
        body: formData,
      }
    );

    const data = await res.json();

    if (!data.success) {
      setErrors({ api: data.message || "Failed to submit claim" });
      setLoading(false);
      return;
    }

    // 🔥 If email verification → go to OTP page
    if (verificationMethod === "email") {
      navigate("/verify-otp", {
        state: {
          userId: data.userId,
          token: data.token,
          email: user.email,
        },
      });
    } else {
      // Document verification
      navigate("/directory");
    }

  } catch (err) {
    setErrors({
      api: "Something went wrong. Please try again.",
    });
  } finally {
    setLoading(false);
  }
};
  // const handleSubmit = async (e) => {
  //   e.preventDefault();
  //   setLoading(true);

  //   const newErrors = {};
  //   const usernameRegex = /^[a-zA-Z0-9_]+$/;

  //   if (!user.name.trim()) {
  //     newErrors.name = "Name is required";
  //   }

  //   if (!user.username.trim()) {
  //     newErrors.username = "Username is required";
  //   } else if (!usernameRegex.test(user.username)) {
  //     newErrors.username =
  //       "Username can contain only letters, numbers, and underscore";
  //   }

  //   if (!user.password) {
  //     newErrors.password = "Password is required";
  //   }

  //   if (!confirmPassword) {
  //     newErrors.confirmPassword = "Confirm Password is required";
  //   } else if (user.password !== confirmPassword) {
  //     newErrors.confirmPassword = "Passwords do not match";
  //   }

  //   if (!claimRole) {
  //     newErrors.role = "Please select a role";
  //   }

  //   if (!verificationMethod) {
  //     newErrors.verificationMethod =
  //       "Please select a verification method";
  //   }

  //   if (Object.keys(newErrors).length > 0) {
  //     setErrors(newErrors);
  //     setLoading(false);
  //     return;
  //   }

  //   try {
  //     // Register user
  //     const userRes = await fetch(`${API_BASE}/api/auth/user/register`, {
  //       method: "POST",
  //       headers: { "Content-Type": "application/json" },
  //       body: JSON.stringify(user),
  //     });

  //     const userData = await userRes.json();

  //     if (!userData.success) {
  //       setErrors({ api: userData.message });
  //       setLoading(false);
  //       return;
  //     }

  //     const { token, id: userId } = userData;

  //     // Claim listing
  //     const formData = new FormData();
  //     formData.append("claimRole", claimRole);
  //     formData.append("verificationMethod", verificationMethod);

  //     documents?.forEach((file) => {
  //       formData.append("documents", file);
  //     });

  //     const claimRes = await fetch(
  //       `${API_BASE}/api/listing/claim/${listingId}`,
  //       {
  //         method: "PUT",
  //         headers: { Authorization: `Bearer ${token}` },
  //         body: formData,
  //       }
  //     );

  //     const claimData = await claimRes.json();

  //     if (!claimData.success) {
  //       setErrors({ api: claimData.message || "Failed to claim listing" });
  //       setLoading(false);
  //       return;
  //     }

  //     if (verificationMethod === "email") {
  //       navigate("/verify-otp", {
  //         state: {
  //           userId,
  //           token,
  //           email: user.email,
  //         },
  //       });
  //     } else {
  //       navigate("/directory");
  //     }
  //   } catch (err) {
  //     setErrors({ api: "Something went wrong. Please try again." });
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  if (!listing) return <p>Loading...</p>;

  return (
    <div className="register mt-5 mb-5">
      <Container className="mt-4">
        <h3>Claim Your Listing</h3>

        {errors.api && (
          <div className="text-danger mb-3">{errors.api}</div>
        )}

        <Form onSubmit={handleSubmit}>
          <h2>Listing Information</h2>

          <Form.Group className="mb-3">
            <Form.Label>Shop Name</Form.Label>
            <Form.Control value={listing.shopName} disabled />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>City</Form.Label>
            <Form.Control value={listing.city.city} disabled />
          </Form.Group>

          <h2>Your Details</h2>

          {/* Name */}
          <Form.Group className="mb-3">
            <Form.Label>Name *</Form.Label>
            <Form.Control
              name="name"
              value={user.name}
              onChange={handleUserChange}
              isInvalid={!!errors.name}
            />
            <Form.Control.Feedback type="invalid">
              {errors.name}
            </Form.Control.Feedback>
          </Form.Group>

          {/* Username */}
          <Form.Group className="mb-3">
            <Form.Label>Username *</Form.Label>
            <Form.Control
              name="username"
              value={user.username}
              onChange={handleUserChange}
              isInvalid={!!errors.username}
            />
            <Form.Control.Feedback type="invalid">
              {errors.username}
            </Form.Control.Feedback>
          </Form.Group>

          {/* Role */}
          <Form.Group className="mb-3">
            <Form.Label>Role *</Form.Label>
            <Form.Select
              value={claimRole}
              onChange={(e) => {
                setClaimRole(e.target.value);
                setErrors((prev) => ({ ...prev, role: "" }));
              }}
              isInvalid={!!errors.role}
            >
              <option value="">Select role</option>
              <option value="owner">Owner</option>
              <option value="manager">Manager</option>
              <option value="staff">Staff</option>
            </Form.Select>
            <Form.Control.Feedback type="invalid">
              {errors.role}
            </Form.Control.Feedback>
          </Form.Group>

          {/* Verification */}
          <Form.Group className="mb-3">
            <Form.Label>Verification Method *</Form.Label>

            <Form.Check
              type="radio"
              label="Business Email Verification"
              value="email"
              checked={verificationMethod === "email"}
              onChange={(e) => {
                setVerificationMethod(e.target.value);
                setErrors((prev) => ({
                  ...prev,
                  verificationMethod: "",
                }));
              }}
            />

            <Form.Check
              type="radio"
              label="Document Upload"
              value="document"
              checked={verificationMethod === "document"}
              onChange={(e) => {
                setVerificationMethod(e.target.value);
                setErrors((prev) => ({
                  ...prev,
                  verificationMethod: "",
                }));
              }}
            />

            {errors.verificationMethod && (
              <div className="text-danger small mt-1">
                {errors.verificationMethod}
              </div>
            )}
          </Form.Group>

          {/* Password */}
          <Form.Group className="mb-3">
            <Form.Label>Password *</Form.Label>
            <div className="position-relative">
              <Form.Control
                type={showPassword ? "text" : "password"}
                name="password"
                value={user.password}
                onChange={handleUserChange}
                isInvalid={!!errors.password}
              />
              <span
                onClick={() => setShowPassword(!showPassword)}
                style={{
                  position: "absolute",
                  right: "12px",
                  top: "50%",
                  transform: "translateY(-50%)",
                  cursor: "pointer",
                }}
              >
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </span>
              <Form.Control.Feedback type="invalid">
                {errors.password}
              </Form.Control.Feedback>
            </div>
          </Form.Group>

          {/* Confirm Password */}
          <Form.Group className="mb-4">
            <Form.Label>Confirm Password *</Form.Label>
            <div className="position-relative">
              <Form.Control
                type={showConfirmPassword ? "text" : "password"}
                value={confirmPassword}
                onChange={(e) => {
                  setConfirmPassword(e.target.value);
                  setErrors((prev) => ({
                    ...prev,
                    confirmPassword: "",
                  }));
                }}
                isInvalid={!!errors.confirmPassword}
              />
              <span
                onClick={() =>
                  setShowConfirmPassword(!showConfirmPassword)
                }
                style={{
                  position: "absolute",
                  right: "12px",
                  top: "50%",
                  transform: "translateY(-50%)",
                  cursor: "pointer",
                }}
              >
                {showConfirmPassword ? (
                  <FaEyeSlash />
                ) : (
                  <FaEye />
                )}
              </span>
              <Form.Control.Feedback type="invalid">
                {errors.confirmPassword}
              </Form.Control.Feedback>
            </div>
          </Form.Group>

          <div className="text-center">
            <Button type="submit" disabled={loading}>
              {loading ? "Claiming..." : "Claim Listing"}
            </Button>
          </div>
        </Form>
      </Container>
    </div>
  );
};

export default ClaimListing;