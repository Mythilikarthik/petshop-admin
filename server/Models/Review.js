const mongoose = require("mongoose");

const ReviewSchema = new mongoose.Schema({
  listingId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: "Listing", 
    required: true 
  },

  // Registered user (optional)
  userId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: "User", 
    default: null 
  },

  // Guest or user info
  userName: { type: String, required: true },
  userEmail: { type: String },
  rating: { type: Number, min: 1, max: 5, required: true },
  comment: { type: String, trim: true },
  isGuest: { type: Boolean, default: false },

  // Moderation fields
  status: { 
    type: String, 
    enum: ["pending", "approved", "rejected"], 
    default: "pending" 
  },
  reviewedBy: { type: mongoose.Schema.Types.ObjectId, ref: "Admin" }, // optional
  reviewedAt: { type: Date },

  created_at: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Review", ReviewSchema, "reviews");
