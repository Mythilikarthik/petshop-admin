// const mongoose = require("mongoose");

// const cityBannerSchema = new mongoose.Schema(
//   {
//     city: {
//       type: mongoose.Schema.Types.ObjectId,
//       ref: "City",
//       required: true,
//       unique: true, // ✅ enforce one banner per city
//     },
//     banner: {
//       type: String,
//       required: true,
//     },
//     created_at: { type: Date, default: Date.now },
//   },  
// );

// // Only ONE banner allowed
// module.exports = mongoose.model("CityBanner", cityBannerSchema);
const mongoose = require("mongoose");

const cityBannerSchema = new mongoose.Schema(
  {
    city: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "City",
      required: true,
      unique: true,
    },

    banner: {
      type: String,
      required: true,
    },

    // ✅ NEW FIELDS
    content: {
      type: String,
      default: "",
    },

    metaTitle: {
      type: String,
      default: "",
    },

    metaDescription: {
      type: String,
      default: "",
    },

    metaKeywords: {
      type: String,
      default: "",
    },

    created_at: {
      type: Date,
      default: Date.now,
    },
  }
);

module.exports = mongoose.model("CityBanner", cityBannerSchema);