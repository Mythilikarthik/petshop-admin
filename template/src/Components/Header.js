import React, { useState } from "react";
import { Container, Nav, Navbar } from "react-bootstrap";
import { NavLink, useNavigate } from "react-router-dom";
import "./Css/Header.css";

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

  return (
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
            </div>
          </Navbar.Collapse>
        </Container>
      </Navbar>
    </div>
  );
};

export default Header;
