const mongoose = require("mongoose");

const directoryBannerSchema = new mongoose.Schema(
  {
    banner: {
      type: String, // image filename or URL
      required: true,
    },
    created_at: { type: Date, default: Date.now },
  },  
);

// Only ONE banner allowed
module.exports = mongoose.model("DirectoryBanner", directoryBannerSchema);
