const express = require('express');
const router = express.Router();
const Category = require('../Models/Category');
const Listing = require('../Models/Listing');
const Review = require("../Models/Review");
const User = require("../Models/User");
const { Types } = require("mongoose");

router.get('/categories', async (req, res) => {
  try {
    const data = await Category.aggregate([
      {
        $match: { show: true } 
      },
      {
        $lookup: {
          from: "listings",
          let: { catId: "$_id" },
          pipeline: [
            {
              $match: {
                $expr: {
                  $and: [
                    { $in: ["$$catId", "$categories"] }  // match category ObjectId
                  ]
                },
                status: "approved",  
              }
            }
          ],
          as: "matchedListings"
        }
      },
      {
        $project: {
          name: "$categoryName",
          value: { $size: "$matchedListings" }
        }
      },
      { $sort: { value: -1 } }
    ]);

    res.json({ success: true, chartData: data });
  } catch (err) {
    console.error("Error fetching category stats:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
});
router.get("/user-activity", async (req, res) => {
  try {
    const data = await Listing.aggregate([
      // Only listings created by users
      { $match: { created_by_type: "user" } },

      // Lookup reviews for each listing
      {
        $lookup: {
          from: "reviews",
          localField: "_id",        // listing id
          foreignField: "listingId",
          as: "reviewData"
        }
      },

      // Lookup user details
      {
        $lookup: {
          from: "user",
          localField: "user_id",    // user id
          foreignField: "_id",
          as: "userData"
        }
      },

      // Flatten user array
      { $unwind: { path: "$userData", preserveNullAndEmptyArrays: true } },

      // Project the fields you need
      {
        $project: {
          listing_id: "$_id",
          user_id: "$user_id",
          name: "$userData.name",
          listings: "1",
          reviews: { $size: "$reviewData" }
        }
      }
    ]);

    res.json({ success: true, activity: data });
  } catch (err) {
    console.error("User Activity Error:", err);
    res.status(500).json({ success: false, message: err.message || "Server error" });
  }
});



module.exports = router;
