const mongoose = require("mongoose");

const planSchema = new mongoose.Schema({
  name: { type: String, required: true },
  amount: { type: Number, required: true, default: 0 },
  billingCycle: { type: String, enum: ["monthly", "yearly"], default: "monthly" },
  features: [{ type: String }],
  enabled: { type: Boolean, default: true }
});

const paymentSettingsSchema = new mongoose.Schema(
  {
    razorpay: {
      keyId: { type: String, default: "" },
      keySecret: { type: String, default: "" },
      webhookSecret: { type: String, default: "" },
      enabled: { type: Boolean, default: true },
      mode: { type: String, enum: ["test", "live"], default: "test" }
    },
    featuredCityPlan: planSchema,
    premiumVerifiedPlan: planSchema,
    purchaseSettings: {
      maxPurchaseLimit: { type: Number, default: 5 },
      allowMultipleSubscriptions: { type: Boolean, default: false }
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("PaymentSettings", paymentSettingsSchema);