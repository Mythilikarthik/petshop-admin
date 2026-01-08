import React from 'react';
import './Css/JoinCommunityNewsletter.css';
import { Row, Col, Container } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';

const LOGIM_URI =
  process.env.NODE_ENV === "production"
    ? "https://petshop-user.onrender.com"
    : "http://localhost:3001";

const JoinCommunityNewsletter = ({home}) => {
  const navigate = useNavigate();
  return (
  <section className="join-newsletter-section">
    <Container>
        <div className="">
            <Row className='d-flex align-items-stretch justify-content-center'>
                <Col xs={6} className="text-center mb-4 d-flex">
                    <div className="community-card">
                        <h3>{home.loginTitle}</h3>
                        <p style={{textAlign: "left"}}>
                        {home.loginDescription}
                        </p>
                        <div className="community-actions">
                        <button className="login-btn"
                          onClick={() => {
                            window.open(LOGIM_URI, "_self");
                          } }
                        >
                            Login
                        </button>
                        <button className="register-btn" onClick={() => navigate("/register")}>Register</button>
                        </div>
                    </div>
                </Col>
                {/* <Col xs={6} className="text-center mb-4 d-flex">
                    <div className="newsletter-card">
                        <h3>{home.newsletterTitle}</h3>
                        <p>
                        {home.newsletterDescription}
                        </p>
                        <form className="newsletter-form" onSubmit={e => e.preventDefault()}>
                        <input type="text" placeholder="Your Name" required />
                        <input type="email" placeholder="Your Email" required />
                        <button type="submit" className="subscribe-btn">Subscribe</button>
                        </form>
                    </div>
                </Col> */}
            </Row>
        
        
        </div>
    </Container>
  </section>
);
};

export default JoinCommunityNewsletter;