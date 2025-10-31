const express = require('express');
const router = express.Router();
const Review = require('../Models/Review');

// POST /api/reviews
router.post("/", async (req, res) => {
  const { listingId, userId, userName, userEmail, rating, comment } = req.body;

  try {
    const review = new Review({
      listingId,
      userId: userId || null,
      userName,
      userEmail,
      rating,
      comment,
      isGuest: !userId,
      status: "pending"
    });

    await review.save();
    res.status(201).json({ message: "Review submitted for approval.", review });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
// PATCH /api/reviews/:id/status
router.patch("/:id/status", async (req, res) => {
  const { status, adminId } = req.body; // status = "approved" or "rejected"

  if (!["approved", "rejected"].includes(status)) {
    return res.status(400).json({ message: "Invalid status value." });
  }

  try {
    const review = await Review.findByIdAndUpdate(
      req.params.id,
      { 
        status, 
        reviewedBy: adminId, 
        reviewedAt: new Date() 
      },
      { new: true }
    );

    // Recalculate average only if approved
    if (status === "approved") {
      const avg = await Review.aggregate([
        { $match: { listingId: review.listingId, status: "approved" } },
        { $group: { _id: "$listingId", avgRating: { $avg: "$rating" } } }
      ]);

      await Listing.findByIdAndUpdate(
        review.listingId,
        { averageRating: avg[0]?.avgRating || 0 }
      );
    }

    res.json({ message: `Review ${status}.`, review });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
// GET /api/reviews/listing/:listingId
router.get("/:listingId", async (req, res) => {
  try {
    const reviews = await Review.find({ 
      listingId: req.params.listingId, 
      status: "approved" 
    })
    .populate("listingId", "shopName")
    .populate("userId", "name email")
    .sort({ created_at: -1 });
    
    res.json(reviews);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
// GET /api/reviews (fetch all reviews)
// ✅ Get all reviews (with listing name)
router.get("/", async (req, res) => {
  try {
    const reviews = await Review.find()
      .populate("listingId", "shopName") 
      .populate("userId", "name email")
      .sort({ created_at: -1 });

    res.json(reviews);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
router.get("/single/:id", async (req, res) => {
  try {
    const review = await Review.findById(req.params.id)
      .populate("listingId", "shopName city")
      .populate("userId", "name email");

    if (!review) {
      return res.status(404).json({ message: "Review not found" });
    }

    res.json(review);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


module.exports = router;