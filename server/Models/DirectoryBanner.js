// const mongoose = require("mongoose");

// const directoryBannerSchema = new mongoose.Schema(
//   {
//     banner: {
//       type: String, // image filename or URL
//       required: true,
//     },
//     created_at: { type: Date, default: Date.now },
//   },  
// );

// // Only ONE banner allowed
// module.exports = mongoose.model("DirectoryBanner", directoryBannerSchema);
const mongoose = require("mongoose");

const directoryBannerSchema = new mongoose.Schema({
  banners: [
    {
      image: {
        type: String,
        required: true,
      },
      alt: {
        type: String,
        default: "",
      },
    },
  ],
  created_at: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model(
  "DirectoryBanner",
  directoryBannerSchema
);