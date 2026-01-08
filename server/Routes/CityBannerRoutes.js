const express = require("express");
const router = express.Router();
const CityBanner = require("../Models/CityBanner");
const City = require("../Models/City");
const multer = require("multer");
const path = require("path");
const fs = require("fs");

// Upload config
const uploadDir = "uploads/city-banners";
if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });

const storage = multer.diskStorage({
  destination: uploadDir,
  filename: (req, file, cb) => {
    cb(null, `city-${Date.now()}${path.extname(file.originalname)}`);
  },
});

const upload = multer({ storage });

/**
 * GET all city banners
 */
router.get("/", async (req, res) => {
  const banners = await CityBanner.find().populate("city", "city");
  res.json({ success: true, listings: banners });
});

/**
 * GET single city banner by city ID (for edit)
 */
router.get("/:cityId", async (req, res) => {
  const banner = await CityBanner.findOne({ city: req.params.cityId });
  res.json({ success: true, banner });
});

// router.get("/name/:city", async (req, res) => {
//   const banner = await CityBanner.findOne({ 
//     city: { $regex: `^${req.params.city}$`, $options: "i" } 
//   }); 
//   res.json({ success: true, banner });
// });
router.get("/name/:city", async (req, res) => {
  try {
    const cityDoc = await City.findOne({
      city: new RegExp(`^${req.params.city}$`, "i")
    });

    if (!cityDoc) {
      return res.status(404).json({ success: false, message: "City not found" });
    }

    const banner = await CityBanner.findOne({ city: cityDoc._id })
      .populate("city", "city");

    if (!banner) {
      return res.status(404).json({ success: false, message: "Banner not found" });
    }

    res.json({ success: true, banner });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: err.message });
  }
});



/**
 * CREATE or UPDATE banner (UPSERT)
 */
// router.post("/", upload.single("banner"), async (req, res) => {
//   try {
//     const { city } = req.body;
//     if (!city || !req.file) {
//       return res.status(400).json({ message: "City & banner required" });
//     }

//     const bannerPath = `/uploads/city-banners/${req.file.filename}`;

//     const existing = await CityBanner.findOne({ city });

//     if (existing) {
//       // remove old file
//       if (existing.banner && fs.existsSync("." + existing.banner)) {
//         fs.unlinkSync("." + existing.banner);
//       }

//       existing.banner = bannerPath;
//       await existing.save();

//       return res.json({ success: true, message: "Banner updated" });
//     }

//     await CityBanner.create({ city, banner: bannerPath });

//     res.json({ success: true, message: "Banner added" });
//   } catch (err) {
//     if (err.code === 11000) {
//       return res.status(400).json({ message: "City already has a banner" });
//     }
//     res.status(500).json({ message: "Server error" });
//   }
// });

router.post("/", upload.single("banner"), async (req, res) => {
  try {
    const { city } = req.body;

    if (!city)
      return res.status(400).json({ message: "City is required" });

    // 🔴 CHECK if banner already exists
    const existing = await CityBanner.findOne({ city });
    if (existing) {
      return res.status(409).json({
        message: "Banner already exists for this city",
      });
    }

    const bannerPath = `${uploadDir}/${req.file.filename}`;

    const newBanner = new CityBanner({
      city,
      banner: bannerPath,
    });

    await newBanner.save();

    res.json({
      success: true,
      message: "City banner added successfully",
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});
router.put("/:cityId", upload.single("banner"), async (req, res) => {
  try {
    const { cityId } = req.params;

    const banner = await CityBanner.findOne({ city: cityId });
    if (!banner)
      return res.status(404).json({ message: "Banner not found" });

    if (req.file) {
      banner.banner = `${uploadDir}/${req.file.filename}`;
    }

    await banner.save();

    res.json({
      success: true,
      message: "City banner updated successfully",
    });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});


/**
 * DELETE banner
 */
router.delete("/delete/:id", async (req, res) => {
  const banner = await CityBanner.findById(req.params.id);
  if (!banner) return res.status(404).json({ message: "Not found" });

  if (fs.existsSync("." + banner.banner)) {
    fs.unlinkSync("." + banner.banner);
  }

  await banner.deleteOne();
  res.json({ success: true });
});

module.exports = router;
