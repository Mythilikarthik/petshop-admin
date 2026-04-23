// const mongoose = require("mongoose");

// const CustomPageSchema = new mongoose.Schema({
//   page: { type: String, required: true, unique: true }, // slug or identifier
//   category: [String],
//   city: String,
//   pageTitle: { type: String, required: true },
//   metaKeyword: [String],
//   metaDescription: String,
//   content: String,
//   banner: {
//     type: String,
    
//   },
//   created_at: { type: Date, default: Date.now },
// });

// module.exports = mongoose.model("CustomPage", CustomPageSchema, "custompages");

const mongoose = require("mongoose");

const CustomPageSchema = new mongoose.Schema({
  page: { type: String, required: true, unique: true },

  category: [String],
  city: String,

  pageTitle: { type: String, required: true },   // H1
  metaTitle: { type: String, trim: true },       // SEO title ✅ NEW

  metaKeyword: [String],
  metaDescription: String,

  content: String,

  banner: {
    type: String,
  },

  created_at: { type: Date, default: Date.now },
});

// fallback if metaTitle not given
CustomPageSchema.pre("save", function (next) {
  if (!this.metaTitle) {
    this.metaTitle = this.pageTitle;
  }
  next();
});

module.exports = mongoose.model("CustomPage", CustomPageSchema, "custompages");