import React, { useState, useEffect } from "react";
import { Container, Nav, Navbar, Modal, NavDropdown  } from "react-bootstrap";
import { NavLink, useNavigate } from "react-router-dom";
import "./Css/Header.css";
import { GoogleLogin } from "@react-oauth/google";
import { useAuth } from "../contexts/AuthContext";
import { FaUser } from "react-icons/fa";

const LOGIM_URI =
  process.env.NODE_ENV === "production"
    ? "https://petshop-user.onrender.com"
    : "http://localhost:3001";
const API_BASE =
  process.env.NODE_ENV === "production"
    ? "https://petshop-admin.onrender.com"
    : "http://localhost:5000";


const Header = ({ home }) => {
  const navigate = useNavigate();
  const [expanded, setExpanded] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);

  const { user, loginWithGoogle, logout } = useAuth();

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

              <NavLink
                to="/pet-health"
                className={({ isActive }) =>
                  isActive ? "nav-link active" : "nav-link"
                }
                onClick={() => setExpanded(false)}
              >
                Pet Health
              </NavLink>

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
              
              <button
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
              </button>
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
     
    </>
  );
};

export default Header;
