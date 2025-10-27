const mongoose = require("mongoose");

const ListingSchema = new mongoose.Schema({
  shopName: { type: String, required: true },
  email: { type: String, required: true },
  phone: { type: String, required: true },
  address: String,
  city: String,
  country: String,
  mapUrl: String,
  categories: { type: [String], required: true },
  petCategories: { type: [String], required: true },
  description: String,
  photos: [String],
  metaTitle: String,
  metaKeyword: { type: [String] },
  metaDescription: String,

  created_by_type: { type: String, enum: ["admin", "user"], required: true },
  created_by_id: { type: mongoose.Schema.Types.ObjectId, required: true },
  status: { type: String, enum: ["approved", "pending"], default: "pending" },

  created_at: { type: Date, default: Date.now },
});
ListingSchema.index(
  { shopName: 1, city: 1, email: 1 },
  { unique: true, collation: { locale: "en", strength: 2 } }
);

module.exports = mongoose.model("Listing", ListingSchema, "listings");
