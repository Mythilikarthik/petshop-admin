const mongoose = require("mongoose");

const serviceSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true }
});

const categoryPageSchema = new mongoose.Schema(
  {
    // Link to existing Category model
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "PetCategory",
      required: true,
      unique: true
    },

    displayName: { type: String, required: true },
    description: { type: String },
    image: { type: String },

    // Services section
    services: [serviceSchema],

    // SEO meta data
    metaTitle: { type: String },
    metaDescription: { type: String },
    metaKeywords: { type: String }
  },
  { timestamps: true }
);

module.exports = mongoose.model("CategoryPage", categoryPageSchema);
