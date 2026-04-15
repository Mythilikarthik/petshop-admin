const mongoose = require("mongoose");
const Listing = require("./Listing");

const SpecializedServiceSchema = new mongoose.Schema({
  serviceName: { type: String, required: true, trim: true },

  // Mapping
  // category: {
  //   type: mongoose.Schema.Types.ObjectId,
  //   ref: "Category",
  //   required: true
  // },
  category: [
  {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Category",
    required: true
  }
],
  // petCategory: {
  //   type: mongoose.Schema.Types.ObjectId,
  //   ref: "PetCategory",
  //   required: true
  // },
  petCategories: [
  {
    type: mongoose.Schema.Types.ObjectId,
    ref: "PetCategory"
  }
],

  icon: String, // optional (store icon class or image path)

  description: String,

  show: { type: Boolean, default: true },

  created_at: { type: Date, default: Date.now }
});
// 🔥 Normalize before saving (sort IDs)
SpecializedServiceSchema.pre("save", function (next) {
  if (this.petCategories && this.petCategories.length) {
    this.petCategories = this.petCategories
      .map(id => id.toString())
      .sort();
  }
  next();
});
SpecializedServiceSchema.index(
  {
    serviceName: 1,
    category: 1,
    petCategories: 1
  },
  { unique: true }
);

/**
 * Prevent delete if used in Listing
 */
SpecializedServiceSchema.pre("findOneAndDelete", async function (next) {
  const service = await this.model.findOne(this.getFilter());

  if (!service) return next();

  const inUse = await Listing.exists({
    specializedServices: service._id
  });

  if (inUse) {
    const err = new Error(
      "Some listings are using this specialized service. Delete not allowed."
    );
    err.code = 400;
    return next(err);
  }

  next();
});
SpecializedServiceSchema.pre("findOneAndUpdate", function (next) {
  const update = this.getUpdate();

  if (update.petCategories && update.petCategories.length) {
    update.petCategories = update.petCategories
      .map(id => id.toString())
      .sort();
  }

  next();
});
SpecializedServiceSchema.pre("save", function (next) {
  if (this.serviceName) {
    this.serviceName = this.serviceName.toLowerCase().trim();
  }
  next();
});
SpecializedServiceSchema.pre("findOneAndUpdate", function (next) {
  const update = this.getUpdate();

  if (update.serviceName) {
    update.serviceName = update.serviceName.toLowerCase().trim();
  }

  if (update.petCategories && update.petCategories.length) {
    update.petCategories = update.petCategories
      .map(id => id.toString())
      .sort();
  }

  next();
});

module.exports = mongoose.model(
  "SpecializedService",
  SpecializedServiceSchema,
  "specializedservices"
);