import React from 'react'
import { Row, Col, Container } from 'react-bootstrap'
import { AiOutlineHeart } from "react-icons/ai";
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import './Css/Header.css'
import { Link , useNavigate} from 'react-router-dom';

const Header = ({home}) => {
    const navigate = useNavigate();
  return (
    <div className='header'>
        <Navbar expand="lg" className="bg-white shadow-sm p-3 bg-body sticky-top">
            <Container>
                <Row className='justify-content-between align-items-center w-100'>
                    <Col className='d-flex align-items-center justify-content-start gap-2'>
                        <Navbar.Brand href="/" >
                            <img src={`/${home.siteLogoDark}`} alt="PetPals India" className='site-logo' width={300} />
                            {/* <span className='icon'>
                                <AiOutlineHeart size={28} style={{ color: '#fff',  padding: '4px' }} />
                            </span>
                            <b>PetPals</b><span className='highlight'>India</span> */}
                        </Navbar.Brand>
                    </Col>
                    <Col>
                        <Navbar.Toggle aria-controls="basic-navbar-nav" />
                        <Navbar.Collapse id="basic-navbar-nav">
                            <Nav className="d-flex align-items-center gap-4 justify-content-between">
                                <Link to="/">Home</Link>
                                <Link to="/directory">Directory</Link>
                                <Link to="/pet-health">Pet Health</Link>
                                <Link to="/blog">Blog</Link>
                                <Link to="/contact">Contact</Link>
                            </Nav>
                        </Navbar.Collapse>
                    </Col>
                    <Col className='d-flex justify-content-end gap-4'>
                        <button className='login-btn py-2 px-4 border-2 border-orange-500 text-orange-500 rounded-full hover:bg-orange-500 hover:text-white transition duration-300'
                        // onClick={() => {
                        //     process.env.NODE_ENV === "production" ? 
                        //     window.open("https://petshop-user.onrender.com", "_blank") :
                        //     window.open("http://localhost:3001", "_blank");
                        //   } }
                        onClick={() => {
                            window.open("https://petshop-user.onrender.com", "_blank");
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