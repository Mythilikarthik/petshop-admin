// console.log("✅ Payment route file loaded");
// const express = require("express");
// const Razorpay = require("razorpay");
// const router = express.Router();
// const User = require("../Models/User");
// const Payment = require("../Models/Payment");
// const { verifyToken } = require("../middleware/authMiddleware");

// require("dotenv").config(); // ✅ ensure .env loads in this file too
// console.log("Razorpay Keys:", process.env.RAZORPAY_KEY_ID, process.env.RAZORPAY_SECRET);


// const razorpay = new Razorpay({
//   key_id: process.env.RAZORPAY_KEY_ID,     // store in .env
//   key_secret: process.env.RAZORPAY_SECRET, // store in .env
// });
// console.log("✅ Razorpay initialized:", !!razorpay);
// // ✅ Create Razorpay Order
// // ✅ Create Razorpay Order (debug version)
// router.post("/create-order", verifyToken, async (req, res) => {
//   try {
//     const { plan } = req.body;
//     const amount =
//       plan === "monthly" ? 999 :
//       plan === "yearly" ? 9999 :
//       plan === "lifelong" ? 99999 : 0;

//     const options = {
//       amount: amount * 100, // amount in paise
//       currency: "INR",
//       receipt: `receipt_${Date.now()}`,
//     };

//     console.log("Creating order with options:", options);

//     const order = await razorpay.orders.create(options);
//     console.log("✅ Order created:", order);

//     return res.json({ success: true, order });
//   } catch (err) {
//     console.error("❌ Razorpay Order Error (full):", err);
//     return res.status(500).json({
//       success: false,
//       message: "Order creation failed",
//       error: err.message,
//     });
//   }
// });



// // ✅ Verify Payment after success
// router.post("/verify", verifyToken, async (req, res) => {
//   const crypto = require("crypto");
//   const { razorpay_order_id, razorpay_payment_id, razorpay_signature, plan } = req.body;
//   const userId = req.user.id;

//   const expectedSignature = crypto
//     .createHmac("sha256", process.env.RAZORPAY_SECRET)
//     .update(razorpay_order_id + "|" + razorpay_payment_id)
//     .digest("hex");

//   if (expectedSignature === razorpay_signature) {
//     // Save Payment in DB
//     const payment = await Payment.create({
//       userId,
//       amount: req.body.amount,
//       plan,
//       paymentMethod: "razorpay",
//       paymentStatus: "success",
//       transactionId: razorpay_payment_id,
//     });

//     // Update user premium status
//     let endDate = null;
//     const startDate = new Date();
//     if (plan === "monthly") endDate = new Date(startDate.setMonth(startDate.getMonth() + 1));
//     if (plan === "yearly") endDate = new Date(startDate.setFullYear(startDate.getFullYear() + 1));

//     await User.findByIdAndUpdate(userId, {
//       isPremium: true,
//       premiumPlan: plan,
//       premiumStartDate: new Date(),
//       premiumEndDate: endDate,
//       paymentId: payment._id,
//     });

//     res.json({ success: true, message: "Payment verified & premium activated." });
//   } else {
//     res.json({ success: false, message: "Invalid payment signature" });
//   }
// });
// // ✅ Get all payments (for admin revenue dashboard)
// router.get("/all", async (req, res) => {
//   try {
//     const payments = await Payment.find().populate("userId", "name email");

//     res.json({
//       success: true,
//       payments,
//     });
//   } catch (err) {
//     console.error("Error fetching payments:", err.message);
//     res.status(500).json({
//       success: false,
//       message: "Server error",
//     });
//   }
// });
// // ===========================================
// // ✅ TOTAL REVENUE
// // ===========================================
// router.get("/totalrevenue", async (req, res) => {
//   try {
//     const result = await Payment.aggregate([
//       { $match: { paymentStatus: "success" } },
//       { $group: { _id: null, totalRevenue: { $sum: "$amount" } } }
//     ]);

//     const totalRevenue = result.length > 0 ? result[0].totalRevenue : 0;

//     res.json({ success: true, totalRevenue });
//   } catch (err) {
//     console.error("Error calculating total revenue:", err.message);
//     res.status(500).json({ success: false, message: "Server error" });
//   }
// });


// // ===========================================
// // ✅ REVENUE BY MONTH (LAST 12 MONTHS)
// // ===========================================
// // 📌 Get revenue grouped by month
// router.get("/revenue-by-month", async (req, res) => {
//   try {
//     let { month, year } = req.query;

//     month = parseInt(month);
//     year = parseInt(year);

//     if (!month || !year) {
//       return res.status(400).json({
//         success: false,
//         message: "Month and year are required",
//       });
//     }

//     const result = await Payment.aggregate([
//       {
//         $match: {
//           paymentStatus: "success",
//           $expr: {
//             $and: [
//               { $eq: [{ $month: "$createdAt" }, month] },
//               { $eq: [{ $year: "$createdAt" }, year] },
//             ],
//           },
//         },
//       },
//       {
//         $group: {
//           _id: null,
//           total: { $sum: "$amount" },
//         },
//       },
//     ]);

//     const total = result.length ? result[0].total : 0;

//     res.json({ success: true, total });
//   } catch (err) {
//     console.error("Revenue filter error:", err);
//     res.status(500).json({ success: false, message: err.message });
//   }
// });




// // ===========================================
// // ✅ COUNTS: total payments, premium users, and plan wise
// // ===========================================
// router.get("/counts", async (req, res) => {
//   try {
//     const totalPayments = await Payment.countDocuments();
//     const totalSuccessPayments = await Payment.countDocuments({ paymentStatus: "success" });

//     const premiumUsers = await User.countDocuments({ isPremium: true });

//     const monthlyCount = await Payment.countDocuments({ plan: "monthly", paymentStatus: "success" });
//     const yearlyCount = await Payment.countDocuments({ plan: "yearly", paymentStatus: "success" });
//     const lifelongCount = await Payment.countDocuments({ plan: "lifelong", paymentStatus: "success" });

//     res.json({
//       success: true,
//       totalPayments,
//       totalSuccessPayments,
//       premiumUsers,
//       planCounts: {
//         monthly: monthlyCount,
//         yearly: yearlyCount,
//         lifelong: lifelongCount
//       }
//     });
//   } catch (err) {
//     console.error("Error fetching counts:", err);
//     res.status(500).json({ success: false, message: "Server error" });
//   }
// });



// module.exports = router;

console.log("✅ Payment route file loaded");
const express = require("express");
const Razorpay = require("razorpay");
const router = express.Router();
const User = require("../Models/User");
const Payment = require("../Models/Payment");
const { verifyToken } = require("../middleware/authMiddleware");

require("dotenv").config();

// Dynamically use Live or Test keys depending on the environment
// const RAZORPAY_KEY_ID = process.env.NODE_ENV === "production" ? process.env.RAZORPAY_LIVE_KEY_ID : process.env.RAZORPAY_TEST_KEY_ID;
// const RAZORPAY_SECRET = process.env.NODE_ENV === "production" ? process.env.RAZORPAY_LIVE_SECRET : process.env.RAZORPAY_TEST_SECRET;
const RAZORPAY_KEY_ID = process.env.NODE_ENV === "production" ? process.env.RAZORPAY_TEST_KEY_ID : process.env.RAZORPAY_TEST_KEY_ID;
const RAZORPAY_SECRET = process.env.NODE_ENV === "production" ? process.env.RAZORPAY_TEST_SECRET : process.env.RAZORPAY_TEST_SECRET;

console.log(`Razorpay running in [${process.env.NODE_ENV || 'development'}] mode.`);
console.log("Razorpay Key ID being used:", RAZORPAY_KEY_ID);

const razorpay = new Razorpay({
  key_id: RAZORPAY_KEY_ID,
  key_secret: RAZORPAY_SECRET,
});

// Route to serve the active Key ID to frontend securely
router.get("/config", (req, res) => {
  res.json({ keyId: RAZORPAY_KEY_ID });
});

// ✅ Create Razorpay Order
router.post("/create-order", verifyToken, async (req, res) => {
  try {
    const { plan } = req.body;
    // Normalized amount values to clean INR currency values matching your logic
    const amount =
      plan === "monthly" ? 999 :
      plan === "yearly" ? 9999 :
      plan === "lifelong" ? 99999 : 0;

    if (amount === 0) {
      return res.status(400).json({ success: false, message: "Invalid plan selected" });
    }

    const options = {
      amount: amount * 100, // amount in paise
      currency: "INR",
      receipt: `receipt_${Date.now()}`,
    };

    console.log("Creating order with options:", options);
    const order = await razorpay.orders.create(options);
    
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
// ✅ Verify Payment after success
router.post("/verify", verifyToken, async (req, res) => {
  const crypto = require("crypto");
  const { razorpay_order_id, razorpay_payment_id, razorpay_signature, plan } = req.body;
  
  // FIXED: Changed from req.user.id to req.userId to match your authMiddleware
  const userId = req.userId; 

  // Crucial: Use the context-aware secret for dynamic verification
  const expectedSignature = crypto
    .createHmac("sha256", RAZORPAY_SECRET)
    .update(razorpay_order_id + "|" + razorpay_payment_id)
    .digest("hex");

  if (expectedSignature === razorpay_signature) {
    const payment = await Payment.create({
      userId,
      amount: req.body.amount,
      plan,
      paymentMethod: "razorpay",
      paymentStatus: "success",
      transactionId: razorpay_payment_id,
    });

    let endDate = null;
    const startDate = new Date();
    if (plan === "monthly") endDate = new Date(startDate.setMonth(startDate.getMonth() + 1));
    if (plan === "yearly") endDate = new Date(startDate.setFullYear(startDate.getFullYear() + 1));
    if (plan === "lifelong") endDate = new Date(startDate.setFullYear(startDate.getFullYear() + 99)); // Lifelong tier handling

    await User.findByIdAndUpdate(userId, {
      isPremium: true,
      premiumPlan: plan,
      premiumStartDate: new Date(),
      premiumEndDate: endDate,
      paymentId: payment._id,
    });

    res.json({ success: true, message: "Payment verified & premium activated." });
  } else {
    res.status(400).json({ success: false, message: "Invalid payment signature" });
  }
});

// Admin Dashboard Endpoints (Kept intact)
router.get("/all", async (req, res) => {
  try {
    const payments = await Payment.find().populate("userId", "name email");
    res.json({ success: true, payments });
  } catch (err) {
    res.status(500).json({ success: false, message: "Server error" });
  }
});

router.get("/totalrevenue", async (req, res) => {
  try {
    const result = await Payment.aggregate([
      { $match: { paymentStatus: "success" } },
      { $group: { _id: null, totalRevenue: { $sum: "$amount" } } }
    ]);
    const totalRevenue = result.length > 0 ? result[0].totalRevenue : 0;
    res.json({ success: true, totalRevenue });
  } catch (err) {
    res.status(500).json({ success: false, message: "Server error" });
  }
});

router.get("/revenue-by-month", async (req, res) => {
  try {
    let { month, year } = req.query;
    month = parseInt(month);
    year = parseInt(year);

    if (!month || !year) {
      return res.status(400).json({ success: false, message: "Month and year are required" });
    }

    const result = await Payment.aggregate([
      {
        $match: {
          paymentStatus: "success",
          $expr: {
            $and: [
              { $eq: [{ $month: "$createdAt" }, month] },
              { $eq: [{ $year: "$createdAt" }, year] },
            ],
          },
        },
      },
      { $group: { _id: null, total: { $sum: "$amount" } } },
    ]);

    const total = result.length ? result[0].total : 0;
    res.json({ success: true, total });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

router.get("/counts", async (req, res) => {
  try {
    const totalPayments = await Payment.countDocuments();
    const totalSuccessPayments = await Payment.countDocuments({ paymentStatus: "success" });
    const premiumUsers = await User.countDocuments({ isPremium: true });

    const monthlyCount = await Payment.countDocuments({ plan: "monthly", paymentStatus: "success" });
    const yearlyCount = await Payment.countDocuments({ plan: "yearly", paymentStatus: "success" });
    const lifelongCount = await Payment.countDocuments({ plan: "lifelong", paymentStatus: "success" });

    res.json({
      success: true,
      totalPayments,
      totalSuccessPayments,
      premiumUsers,
      planCounts: { monthly: monthlyCount, yearly: yearlyCount, lifelong: lifelongCount }
    });
  } catch (err) {
    res.status(500).json({ success: false, message: "Server error" });
  }
});

module.exports = router;