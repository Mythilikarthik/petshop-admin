const express = require("express");
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const Listing = require("../Models/Listing");

const router = express.Router();

// ensure upload directory exists
const uploadDir = "uploads/listings";
if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });

// Multer config
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadDir),
  filename: (req, file, cb) =>
    cb(null, Date.now() + path.extname(file.originalname)),
});

const upload = multer({ storage });

router.post("/", upload.array("photos", 10), async (req, res) => {
  try {
    const data = req.body;
    const photoPaths = req.files.map((f) => `/uploads/listings/${f.filename}`);

    // Accept either `categories` or `categories[]`
    const categories = data.categories || data["categories[]"] || [];
    
    const listing = new Listing({
      ...data,
      categories,
      photos: photoPaths
    });

    await listing.save();
    res.json({ success: true, listing });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Server error" });
  }
});



// READ (all)
router.get("/", async (req, res) => {
  try {
    const listings = await Listing.find().sort({ created_at: -1 }).lean(); // <-- add lean()
    res.json({ success: true, listings });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

// READ (one)
router.get("/:id", async (req, res) => {
  try {
    const listing = await Listing.findById(req.params.id).lean();
    if (!listing) return res.status(404).json({ success: false, message: "Not found" });
    res.json({ success: true, listing });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Server error" });
  }
});


// UPDATE
router.put("/:id", upload.array("photos", 10), async (req, res) => {
  try {
    const data = req.body;

    // Parse categories
    if (data["categories[]"]) {
      data.categories = Array.isArray(data["categories[]"])
        ? data["categories[]"]
        : [data["categories[]"]];
    }

    // Parse existing photos
    let existingPhotos = [];
    if (data["existingPhotos[]"]) {
      existingPhotos = Array.isArray(data["existingPhotos[]"])
        ? data["existingPhotos[]"]
        : [data["existingPhotos[]"]];
    }

    // Uploaded photos
    const uploadedPhotos = req.files.map(f => `/uploads/listings/${f.filename}`);

    // If nothing sent, preserve old photos
    if (!uploadedPhotos.length && !existingPhotos.length) {
      const currentListing = await Listing.findById(req.params.id);
      existingPhotos = currentListing?.photos || [];
    }

    // Merge photos
    data.photos = [...existingPhotos, ...uploadedPhotos];

    if (data.status) data.status = data.status.toString();

    const listing = await Listing.findByIdAndUpdate(req.params.id, data, { new: true });
    res.json({ success: true, listing });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Update failed" });
  }
});


// DELETE
router.delete("/:id", async (req, res) => {
  try {
    const listing = await Listing.findByIdAndDelete(req.params.id);
    if (!listing) return res.status(404).json({ success: false, message: "Not found" });

    // Optional: delete images from filesystem
    listing.photos.forEach((pathStr) => {
      const filePath = path.resolve("." + pathStr);
      if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
    });

    res.json({ success: true, message: "Listing deleted" });
  } catch (err) {
    res.status(500).json({ success: false, message: "Delete failed" });
  }
});

module.exports = router;
