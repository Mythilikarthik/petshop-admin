const express = require("express");
const Razorpay = require("razorpay");
const crypto = require("crypto");
const router = express.Router();
const User = require("../Models/User");
const Payment = require("../Models/Payment");
const PaymentSettings = require("../Models/PaymentSettings");
const { verifyToken } = require("../middleware/authMiddleware");

// Helper to fetch current payment settings from DB
const getPaymentSettings = async () => {
  const settings = await PaymentSettings.findOne();
  if (!settings || !settings.razorpay || !settings.razorpay.keyId || !settings.razorpay.keySecret) {
    throw new Error("Razorpay credentials are not configured in Payment Settings.");
  }
  return settings;
};

// Helper to initialize Razorpay instance dynamically from DB keys
const getRazorpayInstance = (settings) => {
  return new Razorpay({
    key_id: settings.razorpay.keyId,
    key_secret: settings.razorpay.keySecret,
  });
};

// Serve active Key ID to frontend from DB settings
router.get("/config", async (req, res) => {
  try {
    const settings = await getPaymentSettings();
    res.json({ keyId: settings.razorpay.keyId, enabled: settings.razorpay.enabled });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// ✅ Create Razorpay Order (Fetches key & pricing from DB)
router.post("/create-order", verifyToken, async (req, res) => {
  try {
    const { plan } = req.body; // e.g., 'monthly', 'yearly', 'lifelong', or custom keys like 'featuredCityPlan'
    const settings = await getPaymentSettings();

    if (!settings.razorpay.enabled) {
      return res.status(400).json({ success: false, message: "Payment gateway is currently disabled." });
    }

    // Retrieve amount dynamically from DB settings or fallback schema structure
    let amount = 0;
    if (settings[plan] && settings[plan].amount) {
      amount = Number(settings[plan].amount);
    } else if (plan === "monthly") {
      amount = settings.featuredCityPlan?.amount || 999;
    } else if (plan === "yearly") {
      amount = settings.premiumVerifiedPlan?.amount || 9999;
    } else if (plan === "lifelong") {
      amount = 99999;
    }

    if (!amount || amount <= 0) {
      return res.status(400).json({ success: false, message: "Invalid plan or pricing selected." });
    }

    const razorpay = getRazorpayInstance(settings);
    const options = {
      amount: amount * 100, // amount in paise
      currency: "INR",
      receipt: `receipt_${Date.now()}`,
    };

    const order = await razorpay.orders.create(options);
    return res.json({ success: true, order, amount });
  } catch (err) {
    console.error("❌ Razorpay Order Creation Error:", err);
    return res.status(500).json({
      success: false,
      message: "Order creation failed",
      error: err.message,
    });
  }
});

// ✅ Verify Payment & Activate Premium User (Validates HMAC using DB secret)
router.post("/verify", verifyToken, async (req, res) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature, plan } = req.body;
    const userId = req.userId;
    const settings = await getPaymentSettings();

    // Verify signature using the DB-stored secret
    const expectedSignature = crypto
      .createHmac("sha256", settings.razorpay.keySecret)
      .update(`${razorpay_order_id}|${razorpay_payment_id}`)
      .digest("hex");

    if (expectedSignature !== razorpay_signature) {
      return res.status(400).json({ success: false, message: "Invalid payment signature" });
    }

    // Determine amount dynamically from DB
    let amount = 0;
    if (settings[plan] && settings[plan].amount) {
      amount = Number(settings[plan].amount);
    } else if (plan === "monthly") {
      amount = settings.featuredCityPlan?.amount || 999;
    } else if (plan === "yearly") {
      amount = settings.premiumVerifiedPlan?.amount || 9999;
    } else if (plan === "lifelong") {
      amount = 99999;
    }

    // Record transaction
    const payment = await Payment.create({
      userId,
      amount: amount || req.body.amount,
      plan,
      paymentMethod: "razorpay",
      paymentStatus: "success",
      transactionId: razorpay_payment_id,
    });

    // Calculate plan duration
    const startDate = new Date();
    let endDate = new Date(startDate);

    if (plan === "monthly" || settings[plan]?.billingCycle === "monthly") {
      endDate.setMonth(endDate.getMonth() + 1);
    } else if (plan === "yearly" || settings[plan]?.billingCycle === "yearly") {
      endDate.setFullYear(endDate.getFullYear() + 1);
    } else if (plan === "lifelong") {
      endDate.setFullYear(endDate.getFullYear() + 99);
    }

    // Update User Profile
    await User.findByIdAndUpdate(userId, {
      isPremium: true,
      premiumPlan: plan,
      premiumStartDate: startDate,
      premiumEndDate: endDate,
      paymentId: payment._id,
    });

    return res.json({ success: true, message: "Payment verified & premium activated." });
  } catch (err) {
    console.error("❌ Razorpay Verification Error:", err);
    return res.status(500).json({ success: false, message: "Payment verification failed", error: err.message });
  }
});

// Admin Analytics Endpoints
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