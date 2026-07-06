import React, { useEffect, useState } from "react";
import { FaPaw } from "react-icons/fa";
import "./GoPremium.css";

const API_BASE =
  process.env.NODE_ENV === "production"
    ? process.env.REACT_APP_API_URL
    : "http://localhost:5000";

const GoPremium = () => {
  const [billingCycle, setBillingCycle] = useState("monthly");

  // Aligned currency values to represent standard INR amounts matching backend
  const pricing = {
    monthly: { price: 999, description: "Billed every month" },
    yearly: { price: 9999, description: "Save 20% when billed yearly" },
    lifelong: { price: 99999, description: "Save 40% when billed Lifelong" },
  };

  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.async = true;
    document.body.appendChild(script);
  }, []);

  const handlePayment = async () => {
    const token = localStorage.getItem("token");
    const plan = billingCycle;

    // 1. Fetch Key Configuration dynamically from Backend
    const configRes = await fetch(`${API_BASE}/api/payments/config`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    const configData = await configRes.json();
    
    // 2. Create Order
    const res = await fetch(`${API_BASE}/api/payments/create-order`, {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
      body: JSON.stringify({ plan }),
    });

    const data = await res.json();
    if (!data.success) return alert("Order creation failed");

    const { order } = data;

    const options = {
      key: configData.keyId, // ✅ Injected dynamically (Accepts either live or test keys)
      amount: order.amount,
      currency: order.currency,
      name: "PetShop Premium",
      description: `Premium Plan - ${plan}`,
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
            plan,
            amount: order.amount / 100,
          }),
        });

        const verifyData = await verifyRes.json();
        if (verifyData.success) {
          alert("Payment Successful! 🎉");
        } else {
          alert("Payment verification failed.");
        }
      },
      theme: { color: "#4CAF50" },
    };

    const rzp = new window.Razorpay(options);
    rzp.open();
  };

  const intlFormat = new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  });

  return (
    <div className="container py-5">
      <h1 className="text-center mb-4">Go Premium</h1>

      {/* Toggle Billing Cycle */}
      <div className="d-flex justify-content-center gap-3 mb-4">
        {Object.keys(pricing).map((type) => (
          <button
            key={type}
            className={`btn ${billingCycle === type ? "btn-primary" : "btn-outline-primary"} text-capitalize`}
            onClick={() => setBillingCycle(type)}
          >
            {type}
          </button>
        ))}
      </div>

      {/* Pricing Card */}
      <div className="row justify-content-center">
        <div className="col-md-6">
          <div className="card shadow-lg">
            <div className="card-body text-center p-5">
              <h3 className="card-title mb-3 text-capitalize">{billingCycle} Premium Plan</h3>
              <h2 className="text-primary">{intlFormat.format(pricing[billingCycle].price)}</h2>
              <p className="text-muted">{pricing[billingCycle].description}</p>

              <ul className="list-unstyled my-4 text-start">
                <li><FaPaw /> Unlimited Directory Access</li>
                <li><FaPaw /> Priority Support</li>
                <li><FaPaw /> Advanced Platform Features</li>
              </ul>

              <div className="d-flex justify-content-center gap-2">
                <button className="btn btn-primary lg w-100" onClick={handlePayment}>
                  Pay with Razorpay
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GoPremium;