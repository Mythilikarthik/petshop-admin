import React, { useEffect, useState } from "react";
import { FaPaw, FaExclamationTriangle, FaCheckCircle } from "react-icons/fa";
import { Spinner, Alert } from "react-bootstrap";
import "./GoPremium.css";

const API_BASE =
  process.env.NODE_ENV === "production"
    ? process.env.REACT_APP_API_URL
    : "http://localhost:5000";

const GoPremium = () => {
  const [settings, setSettings] = useState(null);
  const [userProfile, setUserProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [alert, setAlert] = useState({ show: false, type: "", message: "" });

  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.async = true;
    document.body.appendChild(script);

    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const token = localStorage.getItem("token");

      // 1. Fetch Payment Settings
      const settingsRes = await fetch(`${API_BASE}/api/payments`);
      const settingsData = await settingsRes.json();
      if (settingsData.success && settingsData.settings) {
        setSettings(settingsData.settings);
      }

      // 2. Fetch User Profile to check existing subscription status
      if (token) {
        const userRes = await fetch(`${API_BASE}/api/users/profile`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        const userData = await userRes.json();
        if (userData.success || userData._id) {
          setUserProfile(userData.user || userData);
        }
      }
    } catch (err) {
      console.error("Error loading data:", err);
    } finally {
      setLoading(false);
    }
  };

  const showAlert = (type, message) => {
    setAlert({ show: true, type, message });
    window.scrollTo({ top: 0, behavior: "smooth" });
    setTimeout(() => {
      setAlert({ show: false, type: "", message: "" });
    }, 6000);
  };

  const handlePayment = async (planKey) => {
    const token = localStorage.getItem("token");
    if (!token) {
      showAlert("danger", "Please login first to purchase a plan.");
      return;
    }

    try {
      const configRes = await fetch(`${API_BASE}/api/payments/config`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const configData = await configRes.json();
      
      if (!configData.enabled) {
        throw new Error("Payment gateway is currently disabled by admin.");
      }

      const res = await fetch(`${API_BASE}/api/payments/create-order`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ plan: planKey }),
      });

      const data = await res.json();
      if (!data.success) throw new Error(data.message || "Order creation failed");

      const { order, planDetails } = data;

      const options = {
        key: configData.keyId,
        amount: order.amount,
        currency: order.currency,
        name: "PetShop Platform",
        description: `${planDetails.name}`,
        order_id: order.id,
        handler: async (response) => {
          const verifyRes = await fetch(`${API_BASE}/api/payments/verify`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({
              ...response,
              plan: planKey,
              amount: planDetails.amount,
            }),
          });

          const verifyData = await verifyRes.json();
          if (verifyData.success) {
            showAlert("success", "Payment Successful! Plan activated 🎉");
            // Refresh user profile after successful subscription
            fetchData();
          } else {
            showAlert("danger", verifyData.message || "Payment verification failed.");
          }
        },
        theme: { color: "#4CAF50" },
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (err) {
      showAlert("danger", err.message || "Something went wrong during payment.");
    }
  };

  const intlFormat = new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  });

  if (loading) {
    return (
      <div className="container py-5 text-center">
        <Spinner animation="border" variant="primary" />
        <p className="mt-2 text-muted">Loading premium plans...</p>
      </div>
    );
  }

  const isGatewayEnabled = settings?.razorpay?.enabled ?? false;

  // Check if user already has an active subscription
  const hasActivePlan = 
    userProfile?.isPremium && 
    userProfile?.premiumEndDate && 
    new Date() < new Date(userProfile.premiumEndDate);

  const plansToDisplay = [
    { key: "featuredCityPlan", data: settings?.featuredCityPlan },
    { key: "premiumVerifiedPlan", data: settings?.premiumVerifiedPlan },
  ].filter((p) => p.data && p.data.enabled);

  return (
    <div className="container py-5">
      <h1 className="text-center mb-4">Go Premium</h1>

      {alert.show && (
        <Alert variant={alert.type} className="text-center mb-4 fw-bold shadow-sm">
          {alert.message}
        </Alert>
      )}

      {hasActivePlan && (
        <Alert variant="success" className="text-center mb-4 shadow-sm">
          <FaCheckCircle className="me-2" /> You currently have an active subscription: <strong>{userProfile.premiumPlan}</strong> (Valid until {new Date(userProfile.premiumEndDate).toDateString()})
        </Alert>
      )}

      {!isGatewayEnabled && (
        <Alert variant="warning" className="text-center mb-4">
          <FaExclamationTriangle /> Online payments are currently offline. Please check back later.
        </Alert>
      )}

      {plansToDisplay.length === 0 ? (
        <div className="text-center py-5 text-muted">
          <h4>No subscription plans are currently available.</h4>
        </div>
      ) : (
        <div className="row justify-content-center g-4">
          {plansToDisplay.map(({ key, data }) => (
            <div key={key} className="col-md-5">
              <div className="card shadow-lg h-100 border-0 rounded-4">
                <div className="card-body text-center p-5 d-flex flex-column justify-content-between">
                  <div>
                    <h3 className="card-title mb-3 fw-bold">{data.name}</h3>
                    <h2 className="text-primary mb-1">{intlFormat.format(data.amount)}</h2>
                    <p className="text-muted text-capitalize mb-4">Billed {data.billingCycle}</p>

                    <ul className="list-unstyled my-4 text-start">
                      {data.features && data.features.length > 0 ? (
                        data.features.map((feature, idx) => (
                          <li key={idx} className="mb-2 d-flex align-items-center gap-2">
                            <FaPaw className="text-success" /> {feature}
                          </li>
                        ))
                      ) : (
                        <>
                          <li className="mb-2 d-flex align-items-center gap-2"><FaPaw className="text-success" /> Standard Features</li>
                          <li className="mb-2 d-flex align-items-center gap-2"><FaPaw className="text-success" /> Priority Support</li>
                        </>
                      )}
                    </ul>
                  </div>

                  <button
                    className={`btn btn-lg w-100 mt-3 ${hasActivePlan ? "btn-secondary" : "btn-primary"}`}
                    onClick={() => handlePayment(key)}
                    disabled={!isGatewayEnabled || hasActivePlan}
                  >
                    {hasActivePlan ? "Already Subscribed" : isGatewayEnabled ? "Pay with Razorpay" : "Payments Disabled"}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default GoPremium;