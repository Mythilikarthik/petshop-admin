const mongoose = require('mongoose');
const Listing = require('./Listing');

const CategorySchema = new mongoose.Schema({
  categoryName: { type: String, required: true, unique: true, trim: true },
  petCategories: [{ type: mongoose.Schema.Types.ObjectId, ref: "PetCategory" }],
  description: String,
  metaTitle: String,
  metaKeyword: String,
  metaDescription: String,
  show: { type: Boolean, default: true },
  created_at: { type: Date, default: Date.now }
});

CategorySchema.pre('findOneAndDelete', async function(next) {
  const category = await this.model.findOne(this.getFilter());
  const inUse = await Listing.exists({ categories: category._id });
  if (inUse) {
    const err = new Error("Some listings are using this category. Delete not allowed.");
    err.code = 400;
    return next(err);
  }
  next();
});

module.exports = mongoose.model('Category', CategorySchema, 'categories');
