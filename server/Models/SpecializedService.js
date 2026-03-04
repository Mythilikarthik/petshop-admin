const mongoose = require("mongoose");
const Listing = require("./Listing");

const SpecializedServiceSchema = new mongoose.Schema({
  serviceName: { type: String, required: true, trim: true },

  // Mapping
  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Category",
    required: true
  },
  petCategory: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "PetCategory",
    required: true
  },

  icon: String, // optional (store icon class or image path)

  description: String,

  show: { type: Boolean, default: true },

  created_at: { type: Date, default: Date.now }
});


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

module.exports = mongoose.model(
  "SpecializedService",
  SpecializedServiceSchema,
  "specializedservices"
);