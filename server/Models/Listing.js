const mongoose = require("mongoose");
const slugify = require("slugify");
const sanitizeText = require("../Utils/SanitizeText");

const ListingSchema = new mongoose.Schema({
  shopName: { type: String, required: true, set: v => sanitizeText(v) },
  slug: { type: String, index: true },
  email: { type: String, required: false },
  phone: { type: String, required: true },
  address: String,
  city: { type: mongoose.Schema.Types.ObjectId, ref: "City", required: true },
  country: String,
  mapUrl: String,
  businessHours: [
  {
    day: { type: String, required: true },
    open: { type: String, default: "" },
    close: { type: String, default: "" },
    closed: { type: Boolean, default: false }
  }
],

  categories: [{ type: mongoose.Schema.Types.ObjectId, ref: "Category", required: true }],
  petCategories: [{ type: mongoose.Schema.Types.ObjectId, ref: "PetCategory", required: true }],
  specializedServices: [{ type: mongoose.Schema.Types.ObjectId, ref: "SpecializedService"}],

  description: String,
  photos: [String],
  bannerImage: { type: String }, 
  metaTitle: String,
  metaKeyword: [String],
  metaDescription: String,

  viewedIPs: {type: [String], default: [] },
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

  isSignup: { type: Boolean, default: false },
  signupBy: { type: mongoose.Schema.Types.ObjectId, ref: "User", default: null },
  signupAt: { type: Date, default: null },

  isVerified: { type: Boolean, default: false },
  verifiedBy: { type: mongoose.Schema.Types.ObjectId, ref: "Admin", default: null },
  verifiedAt: { type: Date, default: null },


  // Claim metadata
claimRole: {
  type: String,
  enum: ["owner", "manager", "staff"],
  default: null,
},
signupRole: {
  type: String,
  enum: ["owner", "manager", "staff"],
  default: null,
},

verificationMethod: {
  type: String,
  enum: ["email", "document"],
  default: null,
},

verificationDocs: {
  type: [String], // uploaded file paths
  default: [],
},

claimStatus: {
  type: String,
  enum: ["pending", "approved", "rejected", "otp_pending", "verified"],
  default: "pending",
},
signupStatus: {
  type: String,
  enum: ["pending", "approved", "rejected", "otp_pending", "verified"],
  default: "pending",
},

});
// ListingSchema.pre("save", function (next) {
//   if (this.created_by_type === "admin" && this.isNew) {
//     this.isVerified = true;
//     this.verifiedAt = new Date();
//   }
//   next();
// });

ListingSchema.pre("save", function (next) {
  if (this.isModified("shopName")) {
    this.slug = slugify(this.shopName, {
      lower: true,
      strict: true, // removes special chars
    });
  }
  next();
});
// ListingSchema.index(
//   { slug: 1, city: 1 },
//   { unique: true }
// );

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
