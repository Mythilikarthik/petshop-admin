// const mongoose = require("mongoose");

// const adSchema = new mongoose.Schema(
//   {
//     category: { type: mongoose.Schema.Types.ObjectId, ref: "Category" },
//     city: { type: mongoose.Schema.Types.ObjectId, ref: "City" },
//     position: {
//       type: String,
//       enum: ["top", "middle", "bottom"],
//       required: true
//     },
//     image: { type: String, required: true },
//     url: { type: String }
//   },
//   { timestamps: true }
// );

// module.exports = mongoose.model("Ad", adSchema);
const mongoose = require("mongoose");

const adSchema = new mongoose.Schema(
  {
    category: { type: mongoose.Schema.Types.ObjectId, ref: "PetCategory", default: null, set: v => v === "" ? null : v },
    city: { type: mongoose.Schema.Types.ObjectId, ref: "City", default: null, set: v => v === "" ? null : v },
    position: { type: String, enum: ["top", "middle", "bottom"], required: true },
    image: { type: String, required: true },
    url: { type: String },
    impressions: { type: Number, default: 0 },
    clicks: { type: Number, default: 0 },
    earnings: { type: Number, default: 0 } ,
    page: {
  type: String,
  enum: ["home", "directory", "city", "blog"],
  required: true
},
fromDate: { type: Date, default: null },
  toDate: { type: Date, default: null },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Ad", adSchema);
