// const mongoose = require("mongoose");

// const blogBannerSchema = new mongoose.Schema(
//   {
//     banner: {
//       type: String, // image filename or URL
//       required: true,
//     },
//     created_at: { type: Date, default: Date.now },
//   },  
// );

// // Only ONE banner allowed
// module.exports = mongoose.model("BlogBanner", blogBannerSchema);
const mongoose = require("mongoose");

const blogBannerSchema = new mongoose.Schema(
{
    banners: [
        {
            image: {
                type: String,
                required: true
            },
            alt: {
                type: String,
                default: ""
            }
        }
    ],

    metaTitle: String,
    metaDescription: String,
    metaKeywords: String,
    content: String,

    created_at: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model("BlogBanner", blogBannerSchema);