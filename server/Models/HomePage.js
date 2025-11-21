const mongoose = require("mongoose");

const homePageSchema = new mongoose.Schema({
  bannerTitle: { type: String, required: true },
  bannerSubtitle: { type: String },
  loginTitle: { type: String },
  loginDescription: { type: String },
  newsletterTitle: { type: String },
  newsletterDescription: { type: String },
  metaTitle: { type: String },
  metaDescription: { type: String },

  // ---------- NEW FIELDS ADDED BELOW ----------

  // Footer Description
  footerDescription: { type: String },

  // Site logos
  siteLogoDark: { type: String },   // For header
  siteLogoLight: { type: String },  // For footer

  // Footer Contact info
  footerAddress: { type: String },
  footerLocation: { type: String },
  footerEmail: { type: String },
  footerContact: { type: String },
  footerWorkingHours: { type: String }

}, { timestamps: true });

module.exports = mongoose.model('HomePage', homePageSchema, 'homepages');
