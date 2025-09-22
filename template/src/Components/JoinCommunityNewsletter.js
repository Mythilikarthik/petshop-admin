import React from 'react';
import './Css/JoinCommunityNewsletter.css';
import { Row, Col, Container } from 'react-bootstrap';

const JoinCommunityNewsletter = () => (
  <section className="join-newsletter-section">
    <Container fluid>
        <div className="">
            <Row className='d-flex align-items-stretch'>
                <Col xs={6} className="text-center mb-4 d-flex">
                    <div className="community-card">
                        <h3>Join Our Pet Community</h3>
                        <p>
                        Create an account to save your favorite listings, write reviews, and connect with other pet lovers.
                        </p>
                        <div className="community-actions">
                        <button className="login-btn">Login</button>
                        <button className="register-btn">Register</button>
                        </div>
                    </div>
                </Col>
                <Col xs={6} className="text-center mb-4 d-flex">
                    <div className="newsletter-card">
                        <h3>Subscribe to Our Newsletter</h3>
                        <p>
                        Get the latest pet care tips, special offers, and updates delivered to your inbox.
                        </p>
                        <form className="newsletter-form" onSubmit={e => e.preventDefault()}>
                        <input type="text" placeholder="Your Name" required />
                        <input type="email" placeholder="Your Email" required />
                        <button type="submit" className="subscribe-btn">Subscribe</button>
                        </form>
                    </div>
                </Col>
            </Row>
        
        
        </div>
    </Container>
  </section>
);

export default JoinCommunityNewsletter;