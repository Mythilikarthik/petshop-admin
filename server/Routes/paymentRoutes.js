console.log("✅ Payment route file loaded");
const express = require("express");
const Razorpay = require("razorpay");
const router = express.Router();
const User = require("../Models/User");
const Payment = require("../Models/Payment");
const { verifyToken } = require("../middleware/authMiddleware");

require("dotenv").config(); // ✅ ensure .env loads in this file too
console.log("Razorpay Keys:", process.env.RAZORPAY_KEY_ID, process.env.RAZORPAY_SECRET);


const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,     // store in .env
  key_secret: process.env.RAZORPAY_SECRET, // store in .env
});
console.log("✅ Razorpay initialized:", !!razorpay);
// ✅ Create Razorpay Order
// ✅ Create Razorpay Order (debug version)
router.post("/create-order", verifyToken, async (req, res) => {
  try {
    const { plan } = req.body;
    const amount =
      plan === "monthly" ? 999 :
      plan === "yearly" ? 9999 :
      plan === "lifelong" ? 99999 : 0;

    const options = {
      amount: amount * 100, // amount in paise
      currency: "INR",
      receipt: `receipt_${Date.now()}`,
    };

    console.log("Creating order with options:", options);

    const order = await razorpay.orders.create(options);
    console.log("✅ Order created:", order);

    return res.json({ success: true, order });
  } catch (err) {
    console.error("❌ Razorpay Order Error (full):", err);
    return res.status(500).json({
      success: false,
      message: "Order creation failed",
      error: err.message,
    });
  }
});



// ✅ Verify Payment after success
router.post("/verify", verifyToken, async (req, res) => {
  const crypto = require("crypto");
  const { razorpay_order_id, razorpay_payment_id, razorpay_signature, plan } = req.body;
  const userId = req.user.id;

  const expectedSignature = crypto
    .createHmac("sha256", process.env.RAZORPAY_SECRET)
    .update(razorpay_order_id + "|" + razorpay_payment_id)
    .digest("hex");

  if (expectedSignature === razorpay_signature) {
    // Save Payment in DB
    const payment = await Payment.create({
      userId,
      amount: req.body.amount,
      plan,
      paymentMethod: "razorpay",
      paymentStatus: "success",
      transactionId: razorpay_payment_id,
    });

    // Update user premium status
    let endDate = null;
    const startDate = new Date();
    if (plan === "monthly") endDate = new Date(startDate.setMonth(startDate.getMonth() + 1));
    if (plan === "yearly") endDate = new Date(startDate.setFullYear(startDate.getFullYear() + 1));

    await User.findByIdAndUpdate(userId, {
      isPremium: true,
      premiumPlan: plan,
      premiumStartDate: new Date(),
      premiumEndDate: endDate,
      paymentId: payment._id,
    });

    res.json({ success: true, message: "Payment verified & premium activated." });
  } else {
    res.json({ success: false, message: "Invalid payment signature" });
  }
});

module.exports = router;
