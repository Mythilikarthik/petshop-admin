import React from 'react'
import { Row, Col, Container } from 'react-bootstrap'
import { AiOutlineHeart } from "react-icons/ai";
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import './Css/Header.css'
import { Link , useNavigate, NavLink} from 'react-router-dom';

const LOGIM_URI =
  process.env.NODE_ENV === "production"
    ? "https://petshop-user.onrender.com"
    : "http://localhost:3001";
const API_BASE =
  process.env.NODE_ENV === "production"
    ? "https://petshop-admin.onrender.com"
    : "http://localhost:5000";

const Header = ({home}) => {
    const navigate = useNavigate();
  return (
    <div className='header'>
        <Navbar expand="lg" className="bg-white shadow-sm bg-body sticky-top">
            <Container fluid>
                <Row className='justify-content-between align-items-center w-100'>
                    <Col lg={3} className='d-flex align-items-center justify-content-start gap-2 mobile-align-center'>
                        <Navbar.Brand href="/" >
                            <img src={`${API_BASE}/${home.siteLogoDark}`} alt="PetPals India" className='site-logo' width="100%" />
                            {/* <span className='icon'>
                                <AiOutlineHeart size={28} style={{ color: '#fff',  padding: '4px' }} />
                            </span>
                            <b>PetPals</b><span className='highlight'>India</span> */}
                        </Navbar.Brand>
                    </Col>
                    <Col lg={6} className='d-flex align-items-center justify-content-center mobile-align-center' >
                        <Navbar.Toggle aria-controls="basic-navbar-nav" />
                        <Navbar.Collapse id="basic-navbar-nav" className="mobile-menu d-flex align-items-center justify-content-center">
                            <Nav className="d-flex align-items-center gap-4 justify-content-between">
                                <NavLink to="/" className={({ isActive }) => isActive ? "nav-link active" : "nav-link"}>
                                    Home
                                </NavLink>

                                <NavLink to="/directory" className={({ isActive }) => isActive ? "nav-link active" : "nav-link"}>
                                    Directory
                                </NavLink>

                                <NavLink to="/pet-health" className={({ isActive }) => isActive ? "nav-link active" : "nav-link"}>
                                    Pet Health
                                </NavLink>

                                <NavLink to="/blog" className={({ isActive }) => isActive ? "nav-link active" : "nav-link"}>
                                    Blog
                                </NavLink>

                                <NavLink to="/contact" className={({ isActive }) => isActive ? "nav-link active" : "nav-link"}>
                                    Contact
                                </NavLink>
                                </Nav>

                        </Navbar.Collapse>
                    </Col>
                    <Col lg={3} className='d-flex justify-content-end gap-4  mobile-align-center'>
                        <button className='login-btn py-2 px-4 border-2 border-orange-500 text-orange-500 rounded-full hover:bg-orange-500 hover:text-white transition duration-300'
                        // onClick={() => {
                        //     process.env.NODE_ENV === "production" ? 
                        //     window.open("https://petshop-user.onrender.com", "_blank") :
                        //     window.open("http://localhost:3001", "_blank");
                        //   } }
                        onClick={() => {
                            window.open(LOGIM_URI, "_self");
                          } }
                        >Login</button>
                        <button className='signup-btn px-4 py-2 border-2 border-orange-500 bg-orange-500 text-white rounded-full hover:bg-orange-600 transition duration-300'
                        onClick = {() => navigate("/register")}
                        >Sign Up</button>
                    </Col>
                </Row>
            </Container>
        </Navbar>
    </div>
  )
}

export default Header