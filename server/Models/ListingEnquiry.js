const mongoose = require("mongoose");

const ListingEnquirySchema = new mongoose.Schema({
  listingId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Listing",
    required: true,
  },
  userName: String,
  userEmail: String,
  action: {
    type: String,
    enum: ["phone_view", "whatsapp", "email", "url_view"],
    required: true,
  },
  ip: String,
  isSeen: {
    type: Boolean,
    default: false
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

ListingEnquirySchema.index(
  { listingId: 1, userEmail: 1, action: 1 },
  { unique: true }
);

module.exports = mongoose.model("ListingEnquiry", ListingEnquirySchema);
