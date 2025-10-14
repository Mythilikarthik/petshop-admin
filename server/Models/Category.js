const mongoose = require('mongoose');

const CategorySchema = new mongoose.Schema({
  categoryName: { type: String, required: true },
  description: { type: String },
  metaTitle: { type: String },
  metaKeyword: { type: String },
  metaDescription: { type: String },
  created_at: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Category', CategorySchema, 'categories');
