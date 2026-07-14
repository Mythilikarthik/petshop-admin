const express = require('express');
const router = express.Router();
const Category = require('../Models/Category');
const Listing = require('../Models/Listing');
const Review = require("../Models/Review");
const User = require("../Models/User");
const Offer = require("../Models/Offers");
const { Types } = require("mongoose");

// router.get('/categories', async (req, res) => {
//   try {
//     const data = await Category.aggregate([
//       {
//         $match: { show: true } 
//       },
//       {
//         $lookup: {
//           from: "listings",
//           let: { catId: "$_id" },
//           pipeline: [
//             {
//               $match: {
//                 $expr: {
//                   $and: [
//                     { $in: ["$$catId", "$categories"] }  // match category ObjectId
//                   ]
//                 },
//                 status: "approved",  
//               }
//             }
//           ],
//           as: "matchedListings"
//         }
//       },
//       {
//         $project: {
//           name: "$categoryName",
//           value: { $size: "$matchedListings" }
//         }
//       },
//       { $sort: { value: -1 } }
//     ]);

//     res.json({ success: true, chartData: data });
//   } catch (err) {
//     console.error("Error fetching category stats:", err);
//     res.status(500).json({ success: false, message: "Server error" });
//   }
// });
router.get('/categories', async (req, res) => {
  try {
    const { city } = req.query;

    const listingMatch = {
      status: "approved"
    };

    // 🔹 If city is provided, filter by city
    if (city) {
      listingMatch.city = Types.ObjectId.isValid(city)
        ? new Types.ObjectId(city)
        : city;
    }

    const data = await Category.aggregate([
      { $match: { show: true } },

      {
        $lookup: {
          from: "listings",
          let: { catId: "$_id" },
          pipeline: [
            {
              $match: {
                $expr: { $in: ["$$catId", "$categories"] },
                ...listingMatch
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

      // 🔹 Remove zero-value categories
      { $match: { value: { $gt: 0 } } },

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
router.get("/listings", async (req, res) => {
  const { startDate, endDate } = req.query;
  const filter = {};

  if (startDate && endDate) {
    filter.created_at = {
      $gte: new Date(startDate),
      $lte: new Date(endDate),
    };
  }

  const count = await Listing.countDocuments(filter);
  res.json({ success: true, count });
});
router.get("/pending-listings", async (req, res) => {
  const { startDate, endDate } = req.query;
  const filter = { status: "pending" };

  if (startDate && endDate) {
    filter.created_at = {
      $gte: new Date(startDate),
      $lte: new Date(endDate),
    };
  }

  const count = await Listing.countDocuments(filter);
  res.json({ success: true, count });
});
router.get("/users", async (req, res) => {
  const { startDate, endDate } = req.query;
  const filter = {
    site: "1",
  };

  if (startDate && endDate) {
    filter.created_at = {
      $gte: new Date(startDate),
      $lte: new Date(endDate),
    };
  }

  const count = await User.countDocuments(filter);
  res.json({ success: true, count });
});
router.get("/reviews", async (req, res) => {
  const { startDate, endDate } = req.query;
  const filter = {};

  if (startDate && endDate) {
    filter.created_at = {
      $gte: new Date(startDate),
      $lte: new Date(endDate),
    };
  }

  const count = await Review.countDocuments(filter);
  res.json({ success: true, count });
});
router.get("/new-shop-owners", async (req, res) => {
  const { startDate, endDate } = req.query;

  const match = { created_by_type: "user" };

  if (startDate && endDate) {
    match.created_at = {
      $gte: new Date(startDate),
      $lte: new Date(endDate),
    };
  }

  const count = await Listing.distinct("user_id", match);
  res.json({ success: true, count: count.length });
});

router.get('/offers', async (req, res) => {
  try {
    const { startDate, endDate } = req.query;
    const now = new Date();
    const sevenDaysFromNow = new Date();
    sevenDaysFromNow.setDate(now.getDate() + 7);

    // 1. Build an optional date range match object for creation date filtering
    let dateFilter = {};
    if (startDate || endDate) {
      dateFilter.createdAt = {};
      if (startDate) dateFilter.createdAt.$gte = new Date(startDate);
      if (endDate) dateFilter.createdAt.$lte = new Date(endDate);
    }

    // 2. Execute Aggregation Pipeline
    const stats = await Offer.aggregate([
      { $match: dateFilter },
      {
        $group: {
          _id: null,
          // Sum total views across filtered items based on the length of array
          totalViews: { $sum: { $size: { $ifNull: ["$analytics.viewedByIPs", []] } } },
          // Sum total explicit saves from analytics schema field
          totalSaves: { $sum: { $ifNull: ["$analytics.saves", 0] } },
          // Count metrics where endDate is approaching but not past
          expiringSoon: {
            $sum: {
              $cond: [
                {
                  $and: [
                    { $gt: ["$endDate", now] },
                    { $lte: ["$endDate", sevenDaysFromNow] }
                  ]
                },
                1,
                0
              ]
            }
          }
        }
      }
    ]);

    // Handle empty database states cleanly
    const result = stats[0] || { totalViews: 0, totalSaves: 0, expiringSoon: 0 };

    return res.status(200).json({
      success: true,
      data: result
    });

  } catch (err) {
    console.error("Error computing Offer stats:", err);
    return res.status(500).json({ success: false, error: err.message });
  }
});



module.exports = router;
