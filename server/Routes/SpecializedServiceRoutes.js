const express = require("express");
const router = express.Router();
const SpecializedService = require("../Models/SpecializedService");

// CREATE
router.post("/", async (req, res) => {
  try {
    const service = await SpecializedService.create(req.body);
    res.status(201).json(service);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// GET ALL
router.get("/", async (req, res) => {
  try {
    const services = await SpecializedService.find()
      .populate("category", "categoryName")
      .populate("petCategory", "categoryName")
      .sort({ created_at: -1 });

    res.json(services);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.post("/byCategories", async (req, res) => {
  try {
    const { categories } = req.body;

    if (!categories || categories.length === 0) {
      return res.json({
        success: true,
        services: []
      });
    }

    const services = await SpecializedService.find({
      category: { $in: categories }
    }).select("_id serviceName category");

    res.json({
      success: true,
      services
    });

  } catch (error) {
    console.error("Error fetching services:", error);
    res.status(500).json({
      success: false,
      message: "Server error"
    });
  }
});

// GET ONE
router.get("/:id", async (req, res) => {
  try {
    const service = await SpecializedService.findById(req.params.id);
    res.json(service);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// UPDATE
router.put("/:id", async (req, res) => {
  try {
    const updated = await SpecializedService.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    res.json(updated);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// DELETE
router.delete("/:id", async (req, res) => {
  try {
    await SpecializedService.findOneAndDelete({ _id: req.params.id });
    res.json({ message: "Deleted successfully" });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});
router.put("/:id/toggle", async (req, res) => {
  try {
    const { show } = req.body;

    const service = await SpecializedService.findByIdAndUpdate(
      req.params.id,
      { show },
      { new: true }
    );

    res.json(service);
  } catch (err) {
    res.status(500).json({ message: "Update failed" });
  }
});
module.exports = router;