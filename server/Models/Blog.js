const mongoose = require('mongoose');
const Schema = mongoose.Schema;


const BlogSchema = new Schema({
  title: { type: String, required: true, unique: true },
  author: { type: String, required: true },
  category: [{ type: Schema.Types.ObjectId, ref: 'Category' }],
  date: { type: Date, default: Date.now },
  status: { type: String, enum: ['draft', 'published'], default: 'draft' },
  excerpt: { type: String, required: true },
  content: { type: String, required: true },
  bannerImage: { type: String, default: '' },   // URL or path to banner
  contentImage: { type: String, default: '' }   // URL or path to content image
});


module.exports = mongoose.model('Blog', BlogSchema);
