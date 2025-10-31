const mongoose = require("mongoose");

const homePageSchema = new mongoose.Schema({
  bannerTitle: { type: String, required: true },
  bannerSubtitle: { type: String },
  loginTitle: { type: String },
  loginDescription: { type: String },
  newsletterTitle: { type: String },
  newsletterDescription: { type: String },
  metaTitle: { type: String },
  metaDescription: { type: String }
}, { timestamps: true });

module.exports = mongoose.model('HomePage', homePageSchema,'homepages');
