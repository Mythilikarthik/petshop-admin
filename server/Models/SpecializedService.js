const mongoose = require("mongoose");
const Listing = require("./Listing");

const SpecializedServiceSchema = new mongoose.Schema({
  serviceName: { type: String, required: true, trim: true },

  category: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      required: true
    }
  ],

  petCategories: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "PetCategory",
      required: true
    }
  ],

  // ✅ THIS is the ONLY unique field
  uniqueKey: { type: String, unique: true },

  icon: String,
  description: String,
  show: { type: Boolean, default: true },
  created_at: { type: Date, default: Date.now }
});


// ✅ Normalize + build uniqueKey
SpecializedServiceSchema.pre("save", function (next) {
  // normalize service name
  this.serviceName = this.serviceName.toLowerCase().trim();

  // sort category
  const category = (this.category || [])
    .map(id => id.toString())
    .sort();

  // sort pets
  const pets = (this.petCategories || [])
    .map(id => id.toString())
    .sort();

  // assign back sorted arrays
  this.category = category;
  this.petCategories = pets;

  // build unique key
  this.uniqueKey = `${this.serviceName}__${category.join(",")}__${pets.join(",")}`;

  next();
});


// ✅ Handle update
SpecializedServiceSchema.pre("findOneAndUpdate", function (next) {
  const update = this.getUpdate();

  if (!update) return next();

  if (update.serviceName) {
    update.serviceName = update.serviceName.toLowerCase().trim();
  }

  const category = (update.category || [])
    .map(id => id.toString())
    .sort();

  const pets = (update.petCategories || [])
    .map(id => id.toString())
    .sort();

  if (category.length) update.category = category;
  if (pets.length) update.petCategories = pets;

  if (update.serviceName || category.length || pets.length) {
    update.uniqueKey = `${update.serviceName}__${category.join(",")}__${pets.join(",")}`;
  }

  next();
});


// ❌ REMOVE THIS (VERY IMPORTANT)
// SpecializedServiceSchema.index({ serviceName: 1, category: 1, petCategories: 1 }, { unique: true });


// Prevent delete if used
SpecializedServiceSchema.pre("findOneAndDelete", async function (next) {
  const service = await this.model.findOne(this.getFilter());

  if (!service) return next();

  const inUse = await Listing.exists({
    specializedServices: service._id
  });

  if (inUse) {
    return next(new Error("Service is used in listings"));
  }

  next();
});

module.exports = mongoose.model(
  "SpecializedService",
  SpecializedServiceSchema,
  "specializedservices"
);