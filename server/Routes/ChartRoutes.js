const express = require('express');
const router = express.Router();
const Category = require('../Models/Category');
const Listing = require('../Models/Listing');

router.get('/categories', async (req, res) => {
  try {
    const data = await Category.aggregate([
      {
        $lookup: {
            from: "listings",
            let: { catName: "$categoryName" },
            pipeline: [
            { $match: { $expr: { $in: ["$$catName", "$categories"] }, status: "approved" } }
            ],
            as: "matchedListings"
        }
        },
      {
        $project: {
          name: "$categoryName",
          value: { $size: "$matchedListings" } // count how many listings matched
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

module.exports = router;
