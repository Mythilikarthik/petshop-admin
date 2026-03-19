// const express = require("express");
// const router = express.Router();
// const ListingEnquiry = require("../Models/ListingEnquiry");
// const Listing = require("../Models/Listing");
// const mongoose = require("mongoose");

// router.post("/", async (req, res) => {
//   try {
//     const { listingId, userName, userEmail, action } = req.body;

//     // ✅ Basic validation
//     if (!listingId || !userName || !userEmail) {
//       return res.status(400).json({
//         success: false,
//         message: "Missing required fields",
//       });
//     }

//     // ✅ Validate Mongo ObjectId
//     if (!mongoose.Types.ObjectId.isValid(listingId)) {
//       return res.status(400).json({
//         success: false,
//         message: "Invalid listing ID",
//       });
//     }

//     // ✅ Check listing exists
//     const listing = await Listing.findById(listingId);
//     if (!listing) {
//       return res.status(404).json({
//         success: false,
//         message: "Listing not found",
//       });
//     }

//     // ✅ Create enquiry
//     await ListingEnquiry.create({
//       listingId,
//       userName,
//       userEmail,
//       action: action || "view",
//       ip: req.headers["x-forwarded-for"] || req.socket.remoteAddress,
//     });

//     // ✅ Increment enquiry count safely
//     await Listing.findByIdAndUpdate(listingId, {
//       $inc: { enquiries: 1 },
//     });

//     return res.json({
//       success: true,
//       message: "Enquiry submitted successfully",
//     });
//   } catch (err) {
//     console.error("Enquiry error:", err);

//     if (err.code === 11000) {
//         return res.json({
//         success: true,
//         duplicate: true,
//         message: "Already recorded",
//         });
//     }
//     return res.status(500).json({
//       success: false,
//       message: "Server error",
//     });
//   }
// });

// module.exports = router;
const express = require("express");
const router = express.Router();
const ListingEnquiry = require("../Models/ListingEnquiry");
const Listing = require("../Models/Listing");
const mongoose = require("mongoose");

router.post("/", async (req, res) => {
  try {
    const { listingId, userName, userEmail, action } = req.body;

    if (!listingId || !userName || !userEmail) {
      return res.status(400).json({
        success: false,
        message: "Missing required fields",
      });
    }

    if (!mongoose.Types.ObjectId.isValid(listingId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid listing ID",
      });
    }

    const listing = await Listing.findById(listingId);
    if (!listing) {
      return res.status(404).json({
        success: false,
        message: "Listing not found",
      });
    }

    const enquiryAction = action || "phone_view";

    // ⏱️ 24 hours window
    const last24Hours = new Date(Date.now() - 24 * 60 * 60 * 1000);

    // 🔒 DUPLICATE CHECK
    const exists = await ListingEnquiry.findOne({
      listingId,
      userEmail,
      action: enquiryAction,
      createdAt: { $gte: last24Hours },
    });

    if (exists) {
      return res.json({
        success: true,
        duplicate: true,
        message: "Enquiry already recorded",
      });
    }

    // ✅ CREATE
    await ListingEnquiry.create({
      listingId,
      userName,
      userEmail,
      action: enquiryAction,
      ip: req.headers["x-forwarded-for"] || req.socket.remoteAddress,
    });

    await Listing.findByIdAndUpdate(listingId, {
      $inc: { enquiries: 1 },
    });

    return res.json({
      success: true,
      duplicate: false,
      message: "Enquiry submitted successfully",
    });
  } catch (err) {
    console.error("Enquiry error:", err);
    return res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
});
router.get("/", async (req, res) => {
  try {
    const enquiries = await ListingEnquiry.find()
      .populate("listingId", "shopName") // adjust fields
      .sort({ createdAt: -1 });

    res.json(enquiries);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ✅ Get single enquiry
router.get("/:id", async (req, res) => {
  try {
    const enquiry = await ListingEnquiry.findById(req.params.id)
      .populate("listingId", "shopName description");

    if (!enquiry) return res.status(404).json({ message: "Not found" });

    res.json(enquiry);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
router.put("/mark-seen", async (req, res) => {
  try {
    let { ids } = req.body;

    // ✅ Safety: handle wrong format
    if (!ids || !Array.isArray(ids)) {
      return res.status(400).json({
        success: false,
        message: "ids must be an array",
      });
    }

    // ✅ Filter valid ObjectIds only
    const validIds = ids.filter(id =>
      mongoose.Types.ObjectId.isValid(id)
    );

    if (validIds.length === 0) {
      return res.status(400).json({
        success: false,
        message: "No valid IDs provided",
      });
    }

    // ✅ Update
    const result = await ListingEnquiry.updateMany(
      { _id: { $in: validIds } },
      { $set: { isSeen: true } }
    );

    return res.json({
      success: true,
      matched: result.matchedCount,
      modified: result.modifiedCount,
    });

  } catch (err) {
    console.error("Mark seen error:", err);
    return res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
});
// ✅ Delete enquiry
router.delete("/:id", async (req, res) => {
  try {
    await ListingEnquiry.findByIdAndDelete(req.params.id);
    res.json({ message: "Enquiry deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
