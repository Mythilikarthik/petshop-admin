const mongoose = require("mongoose");

const ListingSchema = new mongoose.Schema({
  shopName: { type: String, required: true },
  email: { type: String, required: true },
  phone: { type: String, required: true },
  address: String,
  city: { type: mongoose.Schema.Types.ObjectId, ref: "City", required: true },
  country: String,
  mapUrl: String,

  categories: [{ type: mongoose.Schema.Types.ObjectId, ref: "Category", required: true }],
  petCategories: [{ type: mongoose.Schema.Types.ObjectId, ref: "PetCategory", required: true }],

  description: String,
  photos: [String],
  metaTitle: String,
  metaKeyword: [String],
  metaDescription: String,

  views: { type: Number, default: 0 },
  enquiries: { type: Number, default: 0 },
  messages: {type: Number, default : 0},
  user_id: { type: mongoose.Schema.Types.ObjectId, ref: "User" },

  created_by_type: { type: String, enum: ["admin", "user"], required: true },
  created_by_id: { type: mongoose.Schema.Types.ObjectId, required: true },
  status: { type: String, enum: ["approved", "pending"], default: "pending" },
  created_at: { type: Date, default: Date.now },

  isClaimed: { type: Boolean, default: false },
  claimedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User", default: null },
  claimedAt: { type: Date, default: null },
});

ListingSchema.pre("validate", function (next) {
  if (this.created_by_type === "user" && !this.user_id) {
    next(new Error("user_id is required when created_by_type is 'user'"));
  } else {
    next();
  }
});

ListingSchema.index(
  { shopName: 1, city: 1, email: 1 },
  { unique: true, collation: { locale: "en", strength: 2 } }
);

module.exports = mongoose.model("Listing", ListingSchema, "listings");
