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
    category: { type: mongoose.Schema.Types.ObjectId, ref: "PetCategory" },
    city: { type: mongoose.Schema.Types.ObjectId, ref: "City" },
    position: { type: String, enum: ["top", "middle", "bottom"], required: true },
    image: { type: String, required: true },
    url: { type: String },
    impressions: { type: Number, default: 0 },
    clicks: { type: Number, default: 0 },
    earnings: { type: Number, default: 0 } // optional for later
  },
  { timestamps: true }
);

module.exports = mongoose.model("Ad", adSchema);
