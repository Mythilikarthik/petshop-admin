const mongoose = require('mongoose');
const Listing = require('./Listing');

const PetCategorySchema = new mongoose.Schema({
  categoryName: { type: String, required: true },
  description: String,
  metaTitle: String,
  metaKeyword: String,
  metaDescription: String,
  show: { type: Boolean, default: true },
  created_at: { type: Date, default: Date.now }
});

PetCategorySchema.pre('findOneAndDelete', async function(next) {
  const petCat = await this.model.findOne(this.getFilter());
  const inUse = await Listing.exists({ petCategories: petCat._id });
  if (inUse) {
    const err = new Error("Some listings are using this pet category. Delete not allowed.");
    err.code = 400;
    return next(err);
  }
  next();
});

module.exports = mongoose.model('PetCategory', PetCategorySchema, 'petcategories');
