const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const BlogSchema = new Schema({
  title: { type: String, required: true },
  author: { type: String, required: true },
  category: { type: String, required: true },
  date: { type: Date, default: Date.now },
  status: { type: String, enum: ['draft', 'published'], default: 'draft' },
  excerpt: { type: String, required: true },
  content: { type: String, required: true }
});

module.exports = mongoose.model('Blog', BlogSchema);
