import React, { useState } from "react";
import { FaPaw } from "react-icons/fa";
import "./GoPremium.css";

const GoPremium = () => {
  const [billingCycle, setBillingCycle] = useState("monthly");

  const pricing = {
    monthly: {
      price: "9.99",
      description: "Billed every month",
    },
    yearly: {
      price: "99.99",
      description: "Save 20% when billed yearly",
    },
    lifelong: {
      price: "999.99",
      description: "Save 40% when billed Lifelong",
    },
  };

  const handlePayment = (method) => {
    alert(`Redirecting to ${method} payment gateway...`);
    // TODO: integrate Razorpay or Stripe SDK here
  };
  const intlFormat = new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  })

  return (
    <div className="container py-5">
      <h1 className="text-center mb-4">Go Premium</h1>

      {/* Toggle Billing Cycle */}
      <div className="d-flex justify-content-center mb-4">
        <div className="btn-group" role="group">
          <button
            type="button"
            className={`btn ${billingCycle === "monthly" ? "btn-primary" : "btn-outline-primary"}`}
            onClick={() => setBillingCycle("monthly")}
          >
            Plan 1
          </button>
          <button
            type="button"
            className={`btn ${billingCycle === "yearly" ? "btn-primary" : "btn-outline-primary"}`}
            onClick={() => setBillingCycle("yearly")}
          >
            Plan 2
          </button>
          <button
            type="button"
            className={`btn ${billingCycle === "lifelong" ? "btn-primary" : "btn-outline-primary"}`}
            onClick={() => setBillingCycle("lifelong")}
          >
            Plan 3
          </button>
        </div>
      </div>

      {/* Pricing Card */}
      <div className="row justify-content-center">
        <div className="col-md-6">
          <div className="card shadow-lg">
            <div className="card-body text-center p-5">
              <h3 className="card-title mb-3">Premium Plan</h3>
              <h2 className="text-primary">{intlFormat.format(pricing[billingCycle].price)}</h2>
              <p className="text-muted">{pricing[billingCycle].description}</p>

              <ul className="list-unstyled my-4 text-start">
                <li><FaPaw /> Unlimited</li>
                <li><FaPaw /> Priority Support</li>
                <li><FaPaw /> Advanced Features</li>
              </ul>

              <div className="d-flex justify-content-center gap-2">
                {/* <button
                  className="btn btn-primary"
                  onClick={() => handlePayment("Razorpay")}
                >
                  Pay with Razorpay
                </button>
                <button
                  className="btn btn-dark"
                  onClick={() => handlePayment("Stripe")}
                >
                  Pay with Stripe
                </button> */}
                <button
                  className="btn btn-primary"
                  onClick={() => handlePayment("gpay")}
                >
                  Pay with Gpay
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
