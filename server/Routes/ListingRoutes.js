const express = require("express");
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const Listing = require("../Models/Listing");
const { verifyToken } = require("../middleware/authMiddleware");

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
const fileFilter = (req, file, cb) => {
  const allowed = ["image/jpeg", "image/png", "image/webp"];
  if (!allowed.includes(file.mimetype)) {
    cb(new Error("Only JPG, PNG, and WEBP images are allowed"));
  } else {
    cb(null, true);
  }
};
const upload = multer({ 
  storage,
  fileFilter,
  limits: { fileSize: 2 * 1024 * 1024 },
 });

router.post("/", verifyToken, upload.array("photos"), async (req, res) => {
  try {
    const { shopName, email, phone, address, city, country, mapUrl, description, categories, petCategories, metaTitle, metaKeyword, metaDescription } = req.body;
    const status = req.userType === "admin" ? "approved" : "pending";

    const newListing = new Listing({
      shopName,
      email,
      phone,
      address,
      city,
      country,
      mapUrl,
      description,
      categories,
      petCategories,
      created_by_id: req.userId, 
      created_by_type: req.userType, 
      photos: req.files.map((file) => file.filename),
      metaTitle,
      metaKeyword,
      metaDescription,
      status,
    });

    await newListing.save();
    return res.json({ success: true, message: "Listing added successfully" });
  } catch (err) {
    if (err.code === 11000) {
      return res
        .status(400)
        .json({ success: false, message: "Duplicate listing already exists" });
    }
    if (err instanceof multer.MulterError) {
      if (err.code === "LIMIT_FILE_SIZE") {
        return res
          .status(400)
          .json({ success: false, message: "File too large (max 2MB per image)" });
      }
    } else if (err.message.includes("Only JPG, PNG, and WEBP")) {
      return res.status(400).json({ success: false, message: err.message });
    }
    console.error("Error saving listing:", err);
    return res.status(500).json({ success: false, message: "Server error" });
  }
});


// ...existing code...
router.post("/bulk", verifyToken, upload.array("photos", 100), async (req, res) => {
  try {
    let listings = req.body.listings;

    if (!listings) return res.status(400).json({ success: false, message: "No listings provided" });
    if (typeof listings === "string") listings = JSON.parse(listings);
    if (!Array.isArray(listings) || listings.length === 0)
      return res.status(400).json({ success: false, message: "No listings provided" });

    const files = req.files || [];
    const fileMap = new Map(files.map((f) => [f.originalname, `/uploads/listings/${f.filename}`]));

    const docs = listings.map((item) => {
      const shopName = (item.shopName || item.shopname || "").trim();
      const email = (item.email || "").trim();

      const categories = Array.isArray(item.categories)
        ? item.categories
        : typeof item.categories === "string"
        ? item.categories.split(/[,;|]/).map((s) => s.trim()).filter(Boolean)
        : [];

      const petCategories = Array.isArray(item.petCategories)
        ? item.petCategories
        : typeof item.petCategories === "string"
        ? item.petCategories.split(/[,;|]/).map((s) => s.trim()).filter(Boolean)
        : [];

      const photos = [];
      const imageFilename = (item.imageFilename || "").trim();
      if (fileMap.has(imageFilename)) photos.push(fileMap.get(imageFilename));
      if (item.imageUrl) photos.push(item.imageUrl);

      return {
        shopName,
        email,
        phone: item.phone || "",
        address: item.address || "",
        categories,
        petCategories,
        photos,
        status: req.userType === "admin" ? "approved" : "pending",
        created_by_type: req.userType,
        created_by_id: req.userId,
      };
    });

    const created = await Listing.insertMany(docs);
    res.json({ success: true, created });
  } catch (err) {
    console.error("Bulk insert error details:", err);
    res.status(500).json({
      success: false,
      message: "Server error during bulk import",
      error: err.message || err,
    });
  }
});

// ...existing code...
router.post("/image", upload.array("image", 10), (req, res) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ success: false, message: "No image uploaded" });
    }

    // Prepare the list of uploaded file paths
    const uploadedFiles = req.files.map((file) => ({
      filename: file.filename,
      path: path.join("uploads/listings", file.filename),
    }));

    res.json({ success: true, files: uploadedFiles, message: "Images uploaded successfully" });
  } catch (err) {
    console.error("Upload error:", err);
    res.status(500).json({ success: false, message: "Server error", error: err.message });
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
    console.log("Update data received:", data);

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
