const express = require("express");
const Razorpay = require("razorpay");
const router = express.Router();
const User = require("../Models/User");
const Payment = require("../Models/Payment");
const PaymentSettings = require("../Models/PaymentSettings");
const { verifyToken } = require("../middleware/authMiddleware");

// Helper function to get settings or create initial fallback defaults
const getSettings = async () => {
  let settings = await PaymentSettings.findOne();
  if (!settings) {
    settings = await PaymentSettings.create({
      razorpay: {
        keyId: process.env.RAZORPAY_TEST_KEY_ID || "",
        keySecret: process.env.RAZORPAY_TEST_SECRET || "",
        enabled: true,
        mode: "test"
      },
      featuredCityPlan: {
        name: "Featured City Plan",
        amount: 999,
        billingCycle: "monthly",
        features: ["Unlimited Directory Access", "Priority Support", "Advanced Platform Features"],
        enabled: true
      },
      premiumVerifiedPlan: {
        name: "Premium Verified Plan",
        amount: 2999,
        billingCycle: "yearly",
        features: ["Unlimited Directory Access", "Priority Support", "Advanced Platform Features"],
        enabled: true
      },
      purchaseSettings: {
        maxPurchaseLimit: 5,
        allowMultipleSubscriptions: false
      }
    });
  }
  return settings;
};

// Helper to initialize Razorpay dynamically based on DB settings or .env fallback
const getRazorpayInstance = async () => {
  const settings = await getSettings();
  const keyId = settings.razorpay.keyId || process.env.RAZORPAY_TEST_KEY_ID;
  const keySecret = settings.razorpay.keySecret || process.env.RAZORPAY_TEST_SECRET;

  return {
    instance: new Razorpay({ key_id: keyId, key_secret: keySecret }),
    keyId,
    keySecret
  };
};

// GET: Retrieve Payment Settings (For Admin UI and Public Pricing Cards)
router.get("/settings", async (req, res) => {
  try {
    const settings = await getSettings();
    res.json({ success: true, settings });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// POST: Save/Update Payment Settings (Admin endpoint)
router.post("/settings", verifyToken, async (req, res) => {
  try {
    let settings = await PaymentSettings.findOne();
    if (settings) {
      settings = await PaymentSettings.findByIdAndUpdate(settings._id, req.body, { new: true });
    } else {
      settings = await PaymentSettings.create(req.body);
    }
    res.json({ success: true, message: "Settings saved successfully", settings });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// GET: Serve active public Razorpay Key ID to frontend
router.get("/config", async (req, res) => {
  try {
    const { keyId } = await getRazorpayInstance();
    res.json({ keyId });
  } catch (err) {
    res.status(500).json({ success: false, message: "Config retrieval failed" });
  }
});

// POST: Create Razorpay Order with Dynamic Pricing from Database
router.post("/create-order", verifyToken, async (req, res) => {
  try {
    const { planKey } = req.body; // Expects 'featuredCityPlan' or 'premiumVerifiedPlan'
    const settings = await getSettings();

    if (!settings.razorpay.enabled) {
      return res.status(400).json({ success: false, message: "Payments are currently disabled." });
    }

    const targetPlan = settings[planKey];
    if (!targetPlan || !targetPlan.enabled) {
      return res.status(400).json({ success: false, message: "Selected plan is inactive or invalid." });
    }

    const amountInPaise = Number(targetPlan.amount) * 100;
    if (!amountInPaise || amountInPaise <= 0) {
      return res.status(400).json({ success: false, message: "Invalid plan pricing" });
    }

    const { instance } = await getRazorpayInstance();
    const options = {
      amount: amountInPaise,
      currency: "INR",
      receipt: `receipt_${Date.now()}`
    };

    const order = await instance.orders.create(options);
    return res.json({ success: true, order, planDetails: targetPlan });
  } catch (err) {
    console.error("❌ Razorpay Order Error:", err);
    return res.status(500).json({ success: false, message: "Order creation failed", error: err.message });
  }
});

// POST: Verify Payment Signature
router.post("/verify", verifyToken, async (req, res) => {
  try {
    const crypto = require("crypto");
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature, planKey, amount } = req.body;
    const userId = req.userId;

    const { keySecret } = await getRazorpayInstance();

    const expectedSignature = crypto
      .createHmac("sha256", keySecret)
      .update(razorpay_order_id + "|" + razorpay_payment_id)
      .digest("hex");

    if (expectedSignature === razorpay_signature) {
      const settings = await getSettings();
      const planInfo = settings[planKey] || {};

      const payment = await Payment.create({
        userId,
        amount: amount || planInfo.amount,
        plan: planInfo.name || planKey,
        paymentMethod: "razorpay",
        paymentStatus: "success",
        transactionId: razorpay_payment_id
      });

      let endDate = new Date();
      if (planInfo.billingCycle === "yearly") {
        endDate.setFullYear(endDate.getFullYear() + 1);
      } else {
        endDate.setMonth(endDate.getMonth() + 1);
      }

      await User.findByIdAndUpdate(userId, {
        isPremium: true,
        premiumPlan: planInfo.name || planKey,
        premiumStartDate: new Date(),
        premiumEndDate: endDate,
        paymentId: payment._id
      });

      res.json({ success: true, message: "Payment verified & plan activated." });
    } else {
      res.status(400).json({ success: false, message: "Invalid payment signature" });
    }
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// Analytics Dashboard Endpoints
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
    res.json({ success: true, totalRevenue: result[0]?.totalRevenue || 0 });
  } catch (err) {
    res.status(500).json({ success: false, message: "Server error" });
  }
});

module.exports = router;