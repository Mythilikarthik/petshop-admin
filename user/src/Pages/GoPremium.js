import React, { useEffect, useState } from "react";
import { FaPaw } from "react-icons/fa";
import "./GoPremium.css";
const API_BASE =
  process.env.NODE_ENV === "production"
    ? "https://petshop-admin.onrender.com"
    : "http://localhost:5000";
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

  const handlePayment = async () => {
  const token = localStorage.getItem("token");
  const plan = billingCycle;

  const res = await fetch(`${API_BASE}/api/payments/create-order`, {
    method: "POST",
    headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
    body: JSON.stringify({ plan }),
  });

  const data = await res.json();
  if (!data.success) return alert("Order creation failed");

  const { order } = data;

  const options = {
    key: "rzp_test_1234567890", // Replace with your Razorpay Key ID
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
  })
  useEffect(() => {
  const script = document.createElement("script");
  script.src = "https://checkout.razorpay.com/v1/checkout.js";
  script.async = true;
  document.body.appendChild(script);
}, []);

  return (
    <div className="container py-5">
      <h1 className="text-center mb-4">Go Premium</h1>

      {/* Toggle Billing Cycle */}
      

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
                  onClick={handlePayment}
                >
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
