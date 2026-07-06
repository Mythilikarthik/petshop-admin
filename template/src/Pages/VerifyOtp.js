import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Container, Form, Button, Alert } from "react-bootstrap";
import ThankyouModel from "../Components/ThankyouModel";

const API_BASE =
  process.env.NODE_ENV === "production"
    ? process.env.REACT_APP_API_URL
    : "http://localhost:5000";

const VerifyOtp = () => {
  const { state } = useLocation();
  const navigate = useNavigate();
  const [showThankYou, setShowThankYou] = useState(false);

  const [otp, setOtp] = useState("");
  const [alert, setAlert] = useState({ show: false, type: "", message: "" });
  const [loading, setLoading] = useState(false);

  if (!state?.userId) {
    return <p>Invalid access</p>;
  }

  const handleVerify = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch(`${API_BASE}/api/auth/user/verify-otp`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${state.token}`,
        },
        body: JSON.stringify({
          userId: state.userId,
          otp,
        }),
      });

      const data = await res.json();

      if (!data.success) {
        setAlert({
          show: true,
          type: "danger",
          message: data.message || "Invalid OTP",
        });
        setLoading(false);
        return;
      }

      // setAlert({
      //   show: true,
      //   type: "success",
      //   message: "OTP verified successfully!",
      // });

      // setTimeout(() => navigate("/directory"), 1500);
      setAlert({ show: false, type: "", message: "" });
      setShowThankYou(true);
    } catch (err) {
      setAlert({
        show: true,
        type: "danger",
        message: "Something went wrong",
      });
    }

    setLoading(false);
  };

  return (
    <Container className="mt-5 mb-5" style={{ maxWidth: "400px" }}>
      <h3 className="text-center">Verify OTP</h3>
      <p className="text-muted text-center">
        OTP sent to {state.email || state.phone}
      </p>

      {alert.show && (
        <Alert variant={alert.type} dismissible onClose={() => setAlert({ show: false })}>
          {alert.message}
        </Alert>
      )}

      <Form onSubmit={handleVerify}>
        <Form.Group className="mb-3">
          <Form.Label>Enter OTP</Form.Label>
          <Form.Control
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
            required
          />
        </Form.Group>

        <Button type="submit" className="w-100" disabled={loading}>
          {loading ? "Verifying..." : "Verify OTP"}
        </Button>
      </Form>
      {/* ✅ Mount the reusable component right at the bottom */}
      <ThankyouModel 
        showThankYou={showThankYou} 
        setShowThankYou={setShowThankYou} 
      />
    </Container>
  );
};

export default VerifyOtp;
