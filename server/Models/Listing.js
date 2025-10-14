const mongoose = require('mongoose');

const ListingSchema = new mongoose.Schema({
  shopName: { type: String, required: true },
  email: { type: String, required: true },
  phone: { type: String, required: true },
  address: { type: String },
  city: { type: String },
  country: { type: String },
  mapUrl: { type: String },
  description: { type: String },
  categories: [{ type: String }],
  photos: [{ type: String }],     

  // SEO fields
  metaTitle: { type: String },
  metaKeyword: { type: String },
  metaDescription: { type: String },

  status: { type: String, enum: ["approved", "pending"], default: "pending" },
  created_at: { type: Date, default: Date.now }
});


module.exports = mongoose.model('Listing', ListingSchema, 'listings');
