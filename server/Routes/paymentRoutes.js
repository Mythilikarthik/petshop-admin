const express = require("express");
const Razorpay = require("razorpay");
const crypto = require("crypto");
const router = express.Router();
const User = require("../Models/User");
const Payment = require("../Models/Payment");
const PaymentSettings = require("../Models/PaymentSettings");
const Notification = require("../Models/Notification");
const sendInvoiceMail = require("../Utils/sendInvoiceMail");
const { verifyToken } = require("../middleware/authMiddleware");
const Admin = require("../Models/Admin");

// Helper to fetch current payment settings
const getPaymentSettings = async () => {
  let settings = await PaymentSettings.findOne();
  if (!settings || !settings.razorpay || !settings.razorpay.keyId || !settings.razorpay.keySecret) {
    throw new Error("Razorpay credentials are not configured in Payment Settings.");
  }
  return settings;
};

const getRazorpayInstance = (settings) => {
  return new Razorpay({
    key_id: settings.razorpay.keyId,
    key_secret: settings.razorpay.keySecret,
  });
};

const getPlanDetails = (settings, plan) => {
  if (settings[plan] && typeof settings[plan] === "object" && settings[plan].amount !== undefined) {
    return {
      key: plan,
      name: settings[plan].name || plan,
      amount: Number(settings[plan].amount),
      billingCycle: settings[plan].billingCycle || "monthly",
      enabled: settings[plan].enabled ?? true
    };
  }
  return null;
};

// GET: Settings
router.get("/", async (req, res) => {
  try {
    const settings = await PaymentSettings.findOne();
    res.json({ success: true, settings });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

router.get("/config", async (req, res) => {
  try {
    const settings = await getPaymentSettings();
    res.json({ keyId: settings.razorpay.keyId, enabled: settings.razorpay.enabled });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// Create Order
router.post("/create-order", verifyToken, async (req, res) => {
  try {
    const { plan } = req.body;
    const userId = req.userId;
    const settings = await getPaymentSettings();
    const planDetails = getPlanDetails(settings, plan);

    if (!settings.razorpay.enabled) {
      return res.status(400).json({ success: false, message: "Payment gateway is currently disabled." });
    }
    // ✅ Check if user already has an active, unexpired subscription
    const user = await User.findById(userId);
    if (user && user.isPremium && user.premiumEndDate && new Date() < new Date(user.premiumEndDate)) {
      return res.status(400).json({
        success: false,
        message: `You already have an active subscription (${user.premiumPlan || "Premium"}) valid until ${new Date(user.premiumEndDate).toDateString()}.`
      });
    }
    if (!planDetails || !planDetails.enabled) {
      return res.status(400).json({ success: false, message: "Selected plan is inactive or invalid." });
    }
    const maxLimit = settings.purchaseSettings?.maxPurchaseLimit || 5;
    const userPurchaseCount = await Payment.countDocuments({ userId, paymentStatus: "success" });

    if (userPurchaseCount >= maxLimit) {
      return res.status(400).json({ 
        success: false, 
        message: `We have reached the maximum purchase limit (${maxLimit} transactions) allowed per account.` 
      });
    }

    const razorpay = getRazorpayInstance(settings);
    const order = await razorpay.orders.create({
      amount: planDetails.amount * 100,
      currency: "INR",
      receipt: `receipt_${Date.now()}`,
    });

    return res.json({ success: true, order, planDetails });
  } catch (err) {
    console.error("❌ Order Creation Error:", err);
    return res.status(500).json({ success: false, message: "Order creation failed", error: err.message });
  }
});

// ✅ VERIFY & ACTIVATE PLAN + EMAILS + NOTIFICATIONS + FEATURES
router.post("/verify", verifyToken, async (req, res) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature, plan, serviceCoverage } = req.body;
    const userId = req.userId;
    const settings = await getPaymentSettings();

    const expectedSignature = crypto
      .createHmac("sha256", settings.razorpay.keySecret)
      .update(`${razorpay_order_id}|${razorpay_payment_id}`)
      .digest("hex");

    if (expectedSignature !== razorpay_signature) {
      return res.status(400).json({ success: false, message: "Invalid payment signature" });
    }

    const planDetails = getPlanDetails(settings, plan);
    if (!planDetails) {
      return res.status(400).json({ success: false, message: "Invalid plan configuration." });
    }

    // 1. Record Transaction in DB
    const payment = await Payment.create({
      userId,
      amount: planDetails.amount,
      plan: planDetails.name,
      paymentMethod: "razorpay",
      paymentStatus: "success",
      transactionId: razorpay_payment_id,
      orderId: razorpay_order_id,
    });

    // 2. Compute expiration date
    const startDate = new Date();
    let endDate = new Date(startDate);
    if (planDetails.billingCycle === "yearly") {
      endDate.setFullYear(endDate.getFullYear() + 1);
    } else {
      endDate.setMonth(endDate.getMonth() + 1);
    }

    // 3. Define feature limits mapping based on plan type
    let featureConfig = {};
    if (plan === "featuredCityPlan") {
      featureConfig = {
        imageLimit: 5,
        keywordLimit: 5,
        hasAnalytics: false,
        hasWhatsAppApi: false,
        serviceCoverage: serviceCoverage || "Standard City",
        badges: ["Featured", "Verified"]
      };
    } else if (plan === "premiumVerifiedPlan") {
      featureConfig = {
        imageLimit: 10,
        keywordLimit: 10,
        hasAnalytics: true,
        hasWhatsAppApi: true, // Request a Quote via WhatsApp API
        serviceCoverage: serviceCoverage || "Expanded Coverage",
        badges: ["Verified", "Premium Shield"]
      };
    }

    // 4. Update User Schema with active plan & custom feature rules
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      {
        isPremium: true,
        premiumPlan: planDetails.name,
        premiumStartDate: startDate,
        premiumEndDate: endDate,
        paymentId: payment._id,
        planFeatures: featureConfig,
      },
      { new: true }
    );

    // 5. Send Notification to Admin Panel
    await Notification.create({
      title: "New Subscription Payment 🎉",
      message: `${updatedUser.name || "A user"} successfully subscribed to ${planDetails.name} for ₹${planDetails.amount}.`,
      type: "payment"
    });

    

    // Send to User
    if (updatedUser.email) {
      await sendInvoiceMail(
        updatedUser.email,
        updatedUser.name,
        planDetails,
        razorpay_payment_id,
        planDetails.amount,
        endDate
      );
    }


    const admin = await Admin.findOne({});
    if (!admin || !admin.email) {
      return res.status(404).json({ success: false, message: "Admin email not found" });
    }
    // Send copy to Admin Email (configured via env)
    if (admin.email) {
      await sendInvoiceMail(
        admin.email,
        updatedUser.name,
        planDetails,
        razorpay_payment_id,
        planDetails.amount,
        endDate
      );
    }

    return res.json({ success: true, message: "Payment verified, features updated, and invoice sent!" });
  } catch (err) {
    console.error("❌ Verification Error:", err);
    return res.status(500).json({ success: false, message: "Payment verification failed", error: err.message });
  }
});

// Admin Notifications Route (for your Admin Panel Dashboard bell/notifications dropdown)
router.get("/notifications", async (req, res) => {
  try {
    const notifications = await Notification.find().sort({ createdAt: -1 }).limit(20);
    res.json({ success: true, notifications });
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