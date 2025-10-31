const mongoose = require("mongoose");

const adSettingSchema = new mongoose.Schema({
  slideInterval: { type: Number, default: 5 }, // in seconds
  maxImages: { type: Number, default: 5 }
});

module.exports = mongoose.model("AdSetting", adSettingSchema);
