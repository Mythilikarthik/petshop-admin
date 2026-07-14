import React, { useState, useEffect } from "react";
import { Container, Nav, Navbar, Modal, NavDropdown  } from "react-bootstrap";
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import "./Css/Header.css";
import { GoogleLogin } from "@react-oauth/google";
import { useAuth } from "../contexts/AuthContext";
import { FaUser } from "react-icons/fa";
import { HeadProvider, Meta, Title } from "react-head";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import AuthGateModal from "../hooks/AuthGateModel";


const LOGIM_URI =
  process.env.NODE_ENV === "production"
    ? process.env.REACT_APP_USER_API_URL
    : "http://localhost:3001";
const API_BASE =
  process.env.NODE_ENV === "production"
    ? process.env.REACT_APP_API_URL
    : "http://localhost:5000";


const Header = ({ home }) => {
  const navigate = useNavigate();
  const [expanded, setExpanded] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showSetPassword, setShowSetPassword] = useState(false);
const [showChangePassword, setShowChangePassword] = useState(false);
const [showAuth, setShowAuth] = useState(false);
const [authMode, setAuthMode] = useState("login");
const openSetPassword = () => setShowSetPassword(true);
const openChangePassword = () => setShowChangePassword(true);

  const { user, loginWithGoogle, logout } = useAuth();

  /* =========================
   SET PASSWORD MODAL
========================= */

 const SetPasswordModal = ({ show, onClose }) => {
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async () => {
    // if (!password || password.length < 6) {
    //   alert("Password must be at least 6 characters");
    //   return;
    // }

    const token = localStorage.getItem("token");

    if (!token) {
      alert("Session expired. Please login again.");
      return;
    }

    try {
      setLoading(true);

      const res = await fetch(
        `${API_BASE}/api/auth/site/user/set-password`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ password }),
        }
      );

      const data = await res.json();

      if (data.success) {
        alert("Password set successfully");

        // Update local user info (optional)
        const updatedUser = { ...user, hasPassword: true };
        localStorage.setItem("user", JSON.stringify(updatedUser));

        setPassword("");
        onClose();
      } else {
        alert(data.message || "Failed to set password");
      }
    } catch (error) {
      console.error(error);
      alert("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal show={show} onHide={onClose} centered>
      <Modal.Header closeButton>
        <Modal.Title>Set Password</Modal.Title>
      </Modal.Header>

      <Modal.Body>
        {/* <input
          type="password"
          className="form-control"
          placeholder="Enter new password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        /> */}
        <div className="position-relative">
  <input
    type={showPassword ? "text" : "password"}
    className="form-control pe-5"
    placeholder="Enter new password"
    value={password}
    onChange={(e) => setPassword(e.target.value)}
  />

  <span
    onClick={() => setShowPassword(!showPassword)}
    style={{
      position: "absolute",
      right: "15px",
      top: "50%",
      transform: "translateY(-50%)",
      cursor: "pointer",
    }}
  >
    {showPassword ? <FaEyeSlash /> : <FaEye />}
  </span>
</div>

        <button
          className="btn btn-primary w-100 mt-3"
          onClick={handleSubmit}
          disabled={loading}
        >
          {loading ? "Saving..." : "Save Password"}
        </button>
      </Modal.Body>
    </Modal>
  );
};

/* =========================
   CHANGE PASSWORD MODAL
========================= */

 const ChangePasswordModal = ({ show, onClose }) => {
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [showOldPassword, setShowOldPassword] = useState(false);
const [showNewPassword, setShowNewPassword] = useState(false);

  const handleSubmit = async () => {
    if (!oldPassword || !newPassword) {
      alert("All fields are required");
      return;
    }

    // if (newPassword.length < 6) {
    //   alert("New password must be at least 6 characters");
    //   return;
    // }

    const token = localStorage.getItem("token");

    if (!token) {
      alert("Session expired. Please login again.");
      return;
    }

    try {
      setLoading(true);

      const res = await fetch(
        `${API_BASE}/api/auth/site/user/change-password`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ oldPassword, newPassword }),
        }
      );

      const data = await res.json();

      if (data.success) {
        alert("Password changed successfully");
        setOldPassword("");
        setNewPassword("");
        onClose();
      } else {
        alert(data.message || "Failed to change password");
      }
    } catch (error) {
      console.error(error);
      alert("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal show={show} onHide={onClose} centered>
      <Modal.Header closeButton>
        <Modal.Title>Change Password</Modal.Title>
      </Modal.Header>

      <Modal.Body>
        {/* <input
          type="password"
          className="form-control mb-2"
          placeholder="Old password"
          value={oldPassword}
          onChange={(e) => setOldPassword(e.target.value)}
        />

        <input
          type="password"
          className="form-control"
          placeholder="New password"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
        /> */}
        <div className="position-relative mb-2">
  <input
    type={showOldPassword ? "text" : "password"}
    className="form-control pe-5"
    placeholder="Old password"
    value={oldPassword}
    onChange={(e) => setOldPassword(e.target.value)}
  />

  <span
    onClick={() => setShowOldPassword(!showOldPassword)}
    style={{
      position: "absolute",
      right: "15px",
      top: "50%",
      transform: "translateY(-50%)",
      cursor: "pointer",
    }}
  >
    {showOldPassword ? <FaEyeSlash /> : <FaEye />}
  </span>
</div>

<div className="position-relative">
  <input
    type={showNewPassword ? "text" : "password"}
    className="form-control pe-5"
    placeholder="New password"
    value={newPassword}
    onChange={(e) => setNewPassword(e.target.value)}
  />

  <span
    onClick={() => setShowNewPassword(!showNewPassword)}
    style={{
      position: "absolute",
      right: "15px",
      top: "50%",
      transform: "translateY(-50%)",
      cursor: "pointer",
    }}
  >
    {showNewPassword ? <FaEyeSlash /> : <FaEye />}
  </span>
</div>

        <button
          className="btn btn-primary w-100 mt-3"
          onClick={handleSubmit}
          disabled={loading}
        >
          {loading ? "Updating..." : "Update Password"}
        </button>
      </Modal.Body>
    </Modal>
  );
};

  // 🔒 FORCE LOGIN BEFORE SITE ACCESS
  // useEffect(() => {
  //   if (!user) {
  //     setShowLoginModal(true);
  //     document.body.style.overflow = "hidden";
  //   } else {
  //     setShowLoginModal(false);
  //     document.body.style.overflow = "auto";
  //   }
  // }, [user]);
  const location = useLocation();

const getPageTitle = () => {
  const path = location.pathname;

  if (path === "/") return "Vet and Pets - Home";

  const parts = path
    .replace("/", "")
    .split("/")
    .map((part) => decodeURIComponent(part)); // ✅ decode %20

  const formatted = parts.map((part) =>
    part
      .replace(/-/g, " ")
      .replace(/\b\w/g, (char) => char.toUpperCase())
  );

  return `Vet and Pets - ${formatted.join(" - ")}`;
};

  return (
    <>
      {/* 🔒 FULLSCREEN LOGIN MODAL */}
      {/* <Modal
        show={showLoginModal}
        backdrop="static"
        keyboard={false}
        centered
        size="md"
        contentClassName="login-modal"
      >
        <Modal.Body className="text-center p-5">
          {home?.siteLogoDark && (
            <img
              src={`${API_BASE}/${home.siteLogoDark}`}
              alt="PetPals"
              width={220}
              className="mb-4"
            />
          )}

          <h4 className="mb-2">Welcome to Vet and Pets</h4>
          <p className="text-muted mb-4">
            Please login with Google to continue
          </p>

          <div className="d-flex justify-content-center">
            <GoogleLogin
              onSuccess={loginWithGoogle}
              onError={() => console.log("Google Login Failed")}
            />
          </div>

          <p className="text-muted mt-4" style={{ fontSize: 13 }}>
            We use Google login to prevent spam & ensure trust.
          </p>
        </Modal.Body>
      </Modal> */}
      
<HeadProvider>
      <div>
        <Title>{getPageTitle()}</Title>
      </div>
    </HeadProvider>
  
    <div className="header">
      <Navbar
        expand="lg"
        expanded={expanded}
        className="bg-white shadow-sm sticky-top"
      >
        <Container fluid>
          {/* LEFT – LOGO */}
          <Navbar.Brand href="/" onClick={() => setExpanded(false)}>
            <img
              src={`${API_BASE}/${home.siteLogoDark}`}
              alt="PetPals India"
              className="site-logo"
              width={350}
            />
          </Navbar.Brand>

          {/* MOBILE TOGGLE */}
          <Navbar.Toggle
            aria-controls="basic-navbar-nav"
            onClick={() => setExpanded(expanded ? false : "expanded")}
          />

          {/* MENU */}
          <Navbar.Collapse
            id="basic-navbar-nav"
            className="mobile-menu"
          >
            {/* CENTER MENU */}
            <Nav className="mx-auto gap-4 text-center">
              <NavLink
                to="/"
                className={({ isActive }) =>
                  isActive ? "nav-link active" : "nav-link"
                }
                onClick={() => setExpanded(false)}
              >
                Home
              </NavLink>

              <NavLink
                to="/directory"
                className={({ isActive }) =>
                  isActive ? "nav-link active" : "nav-link"
                }
                onClick={() => setExpanded(false)}
              >
                Directory
              </NavLink>

              {/* <NavLink
                to="/offers"
                className={({ isActive }) =>
                  isActive ? "nav-link active" : "nav-link"
                }
                onClick={() => setExpanded(false)}
              >
                Offers
              </NavLink> */}

              <NavLink
                to="/blog"
                className={({ isActive }) =>
                  isActive ? "nav-link active" : "nav-link"
                }
                onClick={() => setExpanded(false)}
              >
                Blog
              </NavLink>

              <NavLink
                to="/contact"
                className={({ isActive }) =>
                  isActive ? "nav-link active" : "nav-link"
                }
                onClick={() => setExpanded(false)}
              >
                Contact
              </NavLink>
            </Nav>

            {/* RIGHT BUTTONS */}
            <div className="d-flex justify-content-center justify-content-lg-end gap-3 mt-3 mt-lg-0">
              
              {/* <button
                className="login-btn py-2 px-4 border-2 border-orange-500 text-orange-500 rounded-full hover:bg-orange-500 hover:text-white transition duration-300"
                onClick={() => {
                  setExpanded(false);
                  window.open(LOGIM_URI, "_self");
                }}
              >
                Login
              </button>

              <button
                className="signup-btn px-4 py-2 border-2 border-orange-500 bg-orange-500 text-white rounded-full hover:bg-orange-600 transition duration-300"
                onClick={() => {
                  setExpanded(false);
                  navigate("/register");
                }}
              >
                Sign Up
              </button> */}
              {!user && (
  <>
    <NavDropdown
      title="Login"
      id="login-dropdown"
      align="end"
      className="login-btn py-2 px-4 border-2 border-orange-500 text-orange-500 rounded-full hover:bg-orange-500 hover:text-white transition duration-300"
    >
      {/* Pet Parent Login */}
      <NavDropdown.Item
        onClick={() => {
          setExpanded(false);
          setAuthMode("login");
          setShowAuth(true);
        }}
      >
        Pet Parent Login
      </NavDropdown.Item>

      {/* Vendor Login */}
      <NavDropdown.Item
        onClick={() => {
          setExpanded(false);
          window.open(LOGIM_URI, "_self");
        }}
      >
        Vendor Login
      </NavDropdown.Item>
    </NavDropdown>
        <NavDropdown
      title="Sign Up"
      id="signup-dropdown"
      align="end"
      className="signup-btn px-4 py-2 border-2 border-orange-500 bg-orange-500 text-white rounded-full hover:bg-orange-600 transition duration-300"
    >
      {/* Pet Parent Signup */}
      <NavDropdown.Item
        onClick={() => {
          setExpanded(false);
          setAuthMode("signup");
          setShowAuth(true);
        }}
      >
        Pet Parent Signup
      </NavDropdown.Item>

      {/* Vendor Signup */}
      <NavDropdown.Item
        onClick={() => {
          setExpanded(false);
          navigate("/register");
        }}
      >
        Vendor Signup
      </NavDropdown.Item>
    </NavDropdown>
  </>
)}
              {/* {user && (
                <div className="logged-in-user d-flex align-items-center gap-2">
                  {user.picture && user.picture.length > 0 && (
                    <img src={user.picture} alt={user.name} referrerPolicy="no-referrer" className="user-avatar" />
                  )}
                  
                  <span>
                    {user.name}
                  </span>
                  <button
                      className="login-btn px-3 py-2 border rounded"
                      onClick={logout}
                    >
                      Logout
                    </button>
                </div>
              )} */}
              {user && (
  <NavDropdown 
    align="end"
    title={
      <div className="d-flex align-items-center gap-2">
        {user.picture ? (
          <img
            src={user.picture}
            alt={user.name}
            referrerPolicy="no-referrer"
            className="user-avatar"
          />
        ) : (
          <FaUser />
        )}
        <span className="user-name">{user.name}</span>
      </div>
    }
    id="user-dropdown"
    className="user-dropdown d-flex align-items-center"
  >
    {user.hasPassword ? (
      <NavDropdown.Item onClick={openChangePassword}>
        Change Password
      </NavDropdown.Item>
    ) : (
      <NavDropdown.Item onClick={openSetPassword}>
        Set Password
      </NavDropdown.Item>
    )}

    <NavDropdown.Divider />

    <NavDropdown.Item onClick={logout} className="text-danger">
      Logout
    </NavDropdown.Item>
  </NavDropdown>
)}

            </div>
          </Navbar.Collapse>
        </Container>
      </Navbar>
    </div>
     <SetPasswordModal
  show={showSetPassword}
  onClose={() => setShowSetPassword(false)}
/>
<AuthGateModal
  show={showAuth}
  onClose={() => setShowAuth(false)}
  defaultMode={authMode}
/>
<ChangePasswordModal
  show={showChangePassword}
  onClose={() => setShowChangePassword(false)}
/>
    </>
  );
};

export default Header;
