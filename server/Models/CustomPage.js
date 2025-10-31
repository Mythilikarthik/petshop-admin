const mongoose = require("mongoose");

const CustomPageSchema = new mongoose.Schema({
  page: { type: String, required: true, unique: true }, // slug or identifier
  category: [String],
  city: String,
  pageTitle: { type: String, required: true },
  metaKeyword: [String],
  metaDescription: String,
  content: String,
  created_at: { type: Date, default: Date.now },
});

module.exports = mongoose.model("CustomPage", CustomPageSchema, "custompages");
