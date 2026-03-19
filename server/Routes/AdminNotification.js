const express = require("express");
const router = express.Router();
const Review = require("../Models/Review");
const ListingEnquiry = require("../Models/ListingEnquiry");
const User = require("../Models/User");
const Listing = require("../Models/Listing");

router.get("/", async (req, res) => {
  try {
    const newReviews = await Review.countDocuments({ status: "pending" });

    const newEnquiries = await ListingEnquiry.countDocuments({ isSeen: false });

    const newUsers = await User.countDocuments({ site: "1", isVerified: false });

    const newServiceProviders = await User.countDocuments({ site: "0", isVerified: false });
    const totallisting = await Listing.countDocuments({status: "pending" });

    res.json({
      reviews: newReviews,
      enquiries: newEnquiries,
      users: newUsers,
      serviceProviders: newServiceProviders,
      totallisting: totallisting,
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server Error" });
  }
});

module.exports = router;