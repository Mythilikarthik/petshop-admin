const express = require("express");
const router = express.Router();
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const CategoryPage = require("../Models/CategoryPage");

const uploadDir = "uploads/categorypages";
if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });


// ⚙️ Multer setup
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    cb(
      null,
      file.fieldname + "-" + Date.now() + path.extname(file.originalname)
    );
  },
});
const upload = multer({ storage });
// ✅ Get all category pages
router.get("/", async (req, res) => {
  try {
    const pages = await CategoryPage.find().populate("category", "categoryName");
    res.json({ success: true, pages });
  } catch (err) {
    console.error("Error fetching category pages:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

// ✅ Get category page by category ID
router.get("/:id", async (req, res) => {
  try {
    const page = await CategoryPage.findOne({ _id: req.params.id }).populate("category", "categoryName");
    if (!page) return res.status(404).json({ success: false, message: "Category page not found" });
    res.json({ success: true, page });
  } catch (err) {
    console.error("Error fetching category page:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

router.post("/", upload.single("image"), async (req, res) => {
  try {
    const {
      category,
      displayName,
      description,
      metaTitle,
      metaDescription,
      metaKeywords,
    } = req.body;

    const services = req.body.services ? JSON.parse(req.body.services) : [];
    const image = req.file ? `/uploads/categorypages/${req.file.filename}` : "";

    const data = {
      category,
      displayName,
      description,
      image,
      services,
      metaTitle,
      metaDescription,
      metaKeywords,
    };

    const existing = await CategoryPage.findOne({ category });
    let saved;

    if (existing) {
      saved = await CategoryPage.findByIdAndUpdate(existing._id, data, { new: true });
    } else {
      const newPage = new CategoryPage(data);
      saved = await newPage.save();
    }

    res.json({ success: true, page: saved });
  } catch (err) {
    console.error("Error saving category page:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

// ✅ Delete a category page
router.delete("/:id", async (req, res) => {
  try {
    await CategoryPage.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: "Category page deleted" });
  } catch (err) {
    console.error("Error deleting category page:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
});
router.patch("/:id", upload.single("image"), async (req, res) => {
  try {
    const {
      displayName,
      description,
      metaTitle,
      metaDescription,
      metaKeywords
    } = req.body;

    const services = req.body.services ? JSON.parse(req.body.services) : [];
    const updateData = {
      displayName,
      description,
      services,
      metaTitle,
      metaDescription,
      metaKeywords
    };

    if (req.file) {
      updateData.image = `/uploads/categorypages/${req.file.filename}`;
    }

    const updated = await CategoryPage.findByIdAndUpdate(req.params.id, updateData, { new: true });
    res.json({ success: true, page: updated });
  } catch (err) {
    console.error("Error updating category page:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

module.exports = router;
