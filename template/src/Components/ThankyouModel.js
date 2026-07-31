import React from 'react';
import "./Css/Register.css";
import { FaCheck, FaHome, FaStar } from "react-icons/fa";
import { BsFileEarmarkCheck, BsShieldCheck, BsShop } from "react-icons/bs";
import { Modal, Row, Col, Button } from 'react-bootstrap';
import { useNavigate } from "react-router-dom";

// ✅ Fix 1: Destructure your props properly inside curly braces { }
const ThankyouModel = ({ showThankYou, setShowThankYou }) => {
  const navigate = useNavigate();

  return (
    <>
      {/* ---------------- PREMIUM THANK YOU MODAL ---------------- */}
      <Modal 
        show={showThankYou} 
        onHide={() => setShowThankYou(false)} 
        size="xs" 
        centered
        backdrop="static"
      >
        <Modal.Body className="p-3 bg-white position-relative" style={{ borderRadius: '16px' }}>
          
          {/* 1. GPay Success Indicator & Floating Star Ribbon Burst */}
          <div className="gpay-wrapper">
            <FaStar className="ribbon-star star-1" />
            <FaStar className="ribbon-star star-2" />
            <FaStar className="ribbon-star star-3" />
            <FaStar className="ribbon-star star-4" />
            <FaStar className="ribbon-star star-5" />
            <FaStar className="ribbon-star star-6" />
            
            <div className="gpay-success-circle">
              <FaCheck className="gpay-success-check" />
            </div>
          </div>

          {/* 2. Header Content */}
          <div className="text-center mb-0">
            <div className="thankyou-title-wrapper">
              <h2 className="fw-bold text-dark m-0" style={{"font-size" : "18px"}}>Thank you for registering!</h2>
            </div>
            <p className="text-muted mt-2 mx-auto" style={{ maxWidth: '480px', fontSize: '0.85rem' }}>
              Your account has been created successfully. We will <br /> review and approve your account.
            </p>
          </div>

          {/* 3. Horizontal 4-Step Process Section */}
          <div className="steps-container d-flex align-items-start justify-content-between my-2">
            
            {/* Step 1 */}
            <div className="step-item">
              <div className="step-icon-circle" style={{ backgroundColor: '#eff6ff', color: '#2563eb' }}>
                <BsFileEarmarkCheck size={20} />
              </div>
              <div className="step-text">Account Under<br />Review</div>
            </div>

            {/* Step 2 */}
            <div className="step-item">
              <div className="step-icon-circle" style={{ backgroundColor: '#f0fdf4', color: '#16a34a' }}>
                <BsShieldCheck size={20} />
              </div>
              <div className="step-text">Quality & Verification<br />by Our Team</div>
            </div>

            {/* Step 3 */}
            <div className="step-item">
              <div className="step-icon-circle" style={{ backgroundColor: '#faf5ff', color: '#9333ea' }}>
                <BsShop size={20} />
              </div>
              <div className="step-text">Go Live & Grow<br />Your Business</div>
            </div>

          </div>

          {/* 4. Bottom Light Blue Highlight Banner */}
          <div className="next-steps-banner p-3 mb-3">
            <Row className="align-items-center">
              <Col xs={12} sm={12} className="text-center">
                <h5 className="fw-bold text-dark mb-1" style={{ fontSize: '1.05rem' }}>What happens next?</h5>
                <p className="text-muted small mb-0" style={{ lineHeight: '1.4' }}>
                  Our team will review your information. Once approved, you'll be able to manage your profile, add services, post offers and connect with pet parents.
                </p>
              </Col>
            </Row>
          </div>

          {/* 5. Clean Primary Action Home Button */}
          <div className="text-center mt-4">
            <Button 
              className="px-5 py-2 fw-semibold border-0 shadow-sm d-inline-flex align-items-center gap-2" 
              style={{ backgroundColor: "#0066cc", borderRadius: '8px', fontSize: '0.95rem' }}
              onClick={() => {
                // ✅ Fix 2: Closes the modal through the passed setter prop
                setShowThankYou(false); 
                navigate("/");
              }}
            >
              <FaHome size={16} /> Back to Home
            </Button>
          </div>

        </Modal.Body>
      </Modal>
    </>
  )
}

export default ThankyouModel;