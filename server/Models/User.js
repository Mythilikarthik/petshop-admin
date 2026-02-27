const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
  username: String,
  email: String,
  phone: String,
  name: String,
  password: String,
  isPremium: { type: Boolean, default: false },
  premiumPlan: { type: String, default: null },
  premiumStartDate: { type: Date, default: null },
  premiumEndDate: { type: Date, default: null },
  paymentId: { type: mongoose.Schema.Types.ObjectId, ref: "Payment" },
  resetPasswordToken: String,
resetPasswordExpires: Date,
authProvider: {
  type: String,
  enum: ["local", "google"],
  default: "local"
},
googleId: String,
site: {type: String,  enum: ["0", "1"], default: "0"},

  created_at: { type: Date, default: Date.now },
  otp: String,
  otpExpiresAt: Date,
  isVerified: {
    type: Boolean,
    default: false,
  },
  lastLogin: {
  type: Date,
  default: null
}

});


module.exports = mongoose.model("User", UserSchema, "user");
