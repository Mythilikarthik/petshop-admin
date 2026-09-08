const mongoose = require("mongoose");

const PaymentSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  amount: { type: Number, required: true },
  plan: { type: String, required: true },
  paymentMethod: { type: String, enum: ["gpay", "razorpay", "stripe"], required: true },
  paymentStatus: { type: String, enum: ["pending", "success", "failed"], default: "pending" },
  transactionId: { type: String, default: null },
  orderId: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
  
});

module.exports = mongoose.model("Payment", PaymentSchema, "payments");
