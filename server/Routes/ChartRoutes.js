const express = require('express');
const router = express.Router();
const Category = require('../Models/Category');
const Listing = require('../Models/Listing');
const Review = require("../Models/Review");
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
      {
        $group: {
          _id: "$user_id",
          listings: { $sum: 1 }   
        }
      },
      {
        $lookup: {
          from: "reviews",
          localField: "_id",
          foreignField: "user_id",
          pipeline: [
            {
              $lookup: {
                from: "listings",
                localField: "listing_id",
                foreignField: "_id",
                as: "listingData"
              }
            }
          ],
          as: "reviewData"
        }
      },
      {
        $lookup: {
          from: "users",
          localField: "_id",
          foreignField: "_id",
          as: "userData"
        }
      },
      {
        $unwind: "$userData"
      },
      {
        $project: {
          name: "$userData.name",
          listings: 1,
          reviews: { $size: "$reviewData" }
        }
      }
    ]);

    res.json({ success: true, activity: data });

  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

module.exports = router;
