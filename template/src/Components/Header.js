import React from 'react'
import { Row, Col, Container } from 'react-bootstrap'
import { AiOutlineHeart } from "react-icons/ai";
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import './Css/Header.css'

const Header = () => {
  return (
    <div className='header'>
        <Navbar expand="lg" className="bg-white shadow-sm p-3 bg-body sticky-top">
            <Container fluid>
                <Row className='justify-content-between align-items-center w-100'>
                    <Col className='d-flex align-items-center justify-content-start gap-2'>
                        <Navbar.Brand href="/" >
                            <span className='icon'>
                                <AiOutlineHeart size={28} style={{ color: '#fff',  padding: '4px' }} />
                            </span>
                            <b>PetPals</b><span className='highlight'>India</span>
                        </Navbar.Brand>
                    </Col>
                    <Col>
                        <Navbar.Toggle aria-controls="basic-navbar-nav" />
                        <Navbar.Collapse id="basic-navbar-nav">
                            <Nav className="d-flex align-items-center gap-4 justify-content-between">
                                <Nav.Link href="/">Home</Nav.Link>
                                <Nav.Link href="/directory">Directory</Nav.Link>
                                <Nav.Link href="/pet-health">Pet Health</Nav.Link>
                                <Nav.Link href="/about">About</Nav.Link>
                                <Nav.Link href="/contact">Contact</Nav.Link>
                            </Nav>
                        </Navbar.Collapse>
                    </Col>
                    <Col className='d-flex justify-content-end gap-4'>
                        <button className='login-btn py-2 px-4 border-2 border-orange-500 text-orange-500 rounded-full hover:bg-orange-500 hover:text-white transition duration-300'>Login</button>
                        <button className='signup-btn px-4 py-2 border-2 border-orange-500 bg-orange-500 text-white rounded-full hover:bg-orange-600 transition duration-300'>Sign Up</button>
                    </Col>
                </Row>
            </Container>
        </Navbar>
    </div>
  )
}

export default Header