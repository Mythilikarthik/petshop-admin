const express = require("express");
const router = express.Router();
const CustomPage = require("../Models/CustomPage");

// ✅ Create a new custom page
router.post("/", async (req, res) => {
  try {
    const {
      page,
      category,
      city,
      pageTitle,
      metaKeyword,
      metaDescription,
      content,
    } = req.body;

    // Basic validation
    if (!page || !pageTitle) {
      return res.status(400).json({ success: false, message: "Page and Title are required" });
    }

    const newPage = new CustomPage({
      page,
      category,
      city,
      pageTitle,
      metaKeyword,
      metaDescription,
      content,
    });

    await newPage.save();
    res.status(201).json({ success: true, message: "Page created successfully", page: newPage });
  } catch (err) {
    if(err.code === 11000) {
      res.status(400).json({ success: false, message: "Duplicate Page already exists" })
    }
    console.error("Error creating page:", err);
    res.status(500).json({ error: err.message });
  }
});

// ✅ Get all pages
router.get("/", async (req, res) => {
  try {
    const pages = await CustomPage.find().sort({ createdAt: -1 });
    res.status(201).json({ success: true, pages});
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ✅ Get single page by ID
router.get("/:id", async (req, res) => {
  try {
    const page = await CustomPage.findById(req.params.id);
    if (!page) return res.status(404).json({ message: "Page not found" });
    res.json({success: true, page});
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ✅ Update page
router.patch("/:id", async (req, res) => {
  try {
    const updated = await CustomPage.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    if (!updated) return res.status(404).json({ message: "Page not found" });
    res.json({ success: true, message: "Page updated successfully", page: updated });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ✅ Delete page
router.delete("/:id", async (req, res) => {
  try {
    const deleted = await CustomPage.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ message: "Page not found" });
    res.json({ message: "Page deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
