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

// router.post("/", upload.single("banner"), async (req, res) => {
//   try {
//     const { city } = req.body;

//     if (!city)
//       return res.status(400).json({ message: "City is required" });

//     // 🔴 CHECK if banner already exists
//     const existing = await CityBanner.findOne({ city });
//     if (existing) {
//       return res.status(409).json({
//         message: "Banner already exists for this city",
//       });
//     }

//     const bannerPath = `${uploadDir}/${req.file.filename}`;

//     const newBanner = new CityBanner({
//       city,
//       banner: bannerPath,
//     });

//     await newBanner.save();

//     res.json({
//       success: true,
//       message: "City banner added successfully",
//     });
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ message: "Server error" });
//   }
// });
// lastedited
// router.post("/", upload.single("banner"), async (req, res) => {
//   try {
//     const {
//       city,
//       content,
//       metaTitle,
//       metaDescription,
//       metaKeywords,
//     } = req.body;

//     if (!city)
//       return res.status(400).json({ message: "City is required" });

//     const existing = await CityBanner.findOne({ city });

//     if (existing) {
//       return res.status(409).json({
//         message: "Banner already exists for this city",
//       });
//     }

//     let bannerPath = "";

//     if (req.file) {
//       bannerPath = `${uploadDir}/${req.file.filename}`;
//     }

//     const newBanner = new CityBanner({
//       city,
//       banner: bannerPath,
//       content,
//       metaTitle,
//       metaDescription,
//       metaKeywords,
//     });

//     await newBanner.save();

//     res.json({
//       success: true,
//       message: "City banner added successfully",
//     });
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ message: "Server error" });
//   }
// });
// router.post("/", upload.array("newImages", 20), async (req, res) => {
//   try {
//     const {
//       city,
//       content,
//       metaTitle,
//       metaDescription,
//       metaKeywords,
//     } = req.body;

//     if (!city) {
//       return res.status(400).json({
//         message: "City is required",
//       });
//     }
//     if (!req.files || req.files.length === 0) {
//       return res.status(400).json({
//         message: "Please upload at least one image",
//       });
//     }

//     const existing = await CityBanner.findOne({ city });

//     if (existing) {
//       return res.status(409).json({
//         message: "Banner already exists for this city",
//       });
//     }

//     const images = [];

//     if (req.files?.length) {
//       req.files.forEach((file, index) => {
//         images.push({
//           image: `${uploadDir}/${file.filename}`,
//           alt: req.body.altTexts?.[index] || "",
//         });
//       });
//     }

//     const banner = new CityBanner({
//       city,
//       images,
//       content,
//       metaTitle,
//       metaDescription,
//       metaKeywords,
//     });

//     await banner.save();

//     res.json({
//       success: true,
//       message: "City banner added successfully",
//     });
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({
//       message: "Server error",
//     });
//   }
// });
router.post("/", upload.array("newImages", 20), async (req, res) => {
  try {
    const {
      city,
      content,
      metaTitle,
      metaDescription,
      metaKeywords,
    } = req.body;

    if (!city) {
      return res.status(400).json({ message: "City is required" });
    }
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ message: "Please upload at least one image" });
    }

    const existing = await CityBanner.findOne({ city });
    if (existing) {
      return res.status(409).json({ message: "Banner already exists for this city" });
    }

    const images = [];

    if (req.files && req.files.length > 0) {
      req.files.forEach((file, index) => {
        let altValue = "";

        // Normalize altTexts: can be an Array, a Single String, or undefined
        if (Array.isArray(req.body.altTexts)) {
          altValue = req.body.altTexts[index] || "";
        } else if (typeof req.body.altTexts === "string") {
          // If only 1 image was uploaded, req.body.altTexts is just a flat string
          altValue = index === 0 ? req.body.altTexts : "";
        }

        images.push({
          image: `${uploadDir}/${file.filename}`,
          alt: altValue,
        });
      });
    }

    const banner = new CityBanner({
      city,
      images, // Saved straight into your array of subdocuments
      content,
      metaTitle,
      metaDescription,
      metaKeywords,
    });

    await banner.save();

    res.json({
      success: true,
      message: "City banner added successfully with alt tags!",
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});
// router.put("/:cityId", upload.single("banner"), async (req, res) => {
//   try {
//     const { cityId } = req.params;

//     const banner = await CityBanner.findOne({ city: cityId });
//     if (!banner)
//       return res.status(404).json({ message: "Banner not found" });

//     if (req.file) {
//       banner.banner = `${uploadDir}/${req.file.filename}`;
//     }

//     await banner.save();

//     res.json({
//       success: true,
//       message: "City banner updated successfully",
//     });
//   } catch (err) {
//     res.status(500).json({ message: "Server error" });
//   }
// });
// last edited
// router.put("/:cityId", upload.single("banner"), async (req, res) => {
//   try {
//     const { cityId } = req.params;

//     const {
//       content,
//       metaTitle,
//       metaDescription,
//       metaKeywords,
//     } = req.body;

//     const banner = await CityBanner.findOne({ city: cityId });

//     if (!banner)
//       return res.status(404).json({ message: "Banner not found" });

//     if (req.file) {
//       banner.banner = `${uploadDir}/${req.file.filename}`;
//     }

//     banner.content = content;
//     banner.metaTitle = metaTitle;
//     banner.metaDescription = metaDescription;
//     banner.metaKeywords = metaKeywords;

//     await banner.save();

//     res.json({
//       success: true,
//       message: "City banner updated successfully",
//     });
//   } catch (err) {
//     res.status(500).json({ message: "Server error" });
//   }
// });
// router.put("/:cityId", upload.array("images", 20), async (req, res) => {
//   try {
//     const { cityId } = req.params;

//     const {
//       content,
//       metaTitle,
//       metaDescription,
//       metaKeywords,
//     } = req.body;

//     const banner = await CityBanner.findOne({ city: cityId });

//     if (!banner) {
//       return res.status(404).json({
//         message: "Banner not found",
//       });
//     }

//     // -----------------------------
//     // Existing Images
//     // -----------------------------

//     let existingImages = [];

//     if (req.body.existingImages) {
//       existingImages = JSON.parse(req.body.existingImages);
//     }

//     // -----------------------------
//     // Deleted Images
//     // -----------------------------

//     let deletedImages = [];

//     if (req.body.deletedImages) {
//       deletedImages = JSON.parse(req.body.deletedImages);
//     }

//     // -----------------------------
//     // Delete removed files
//     // -----------------------------

//     if (deletedImages.length > 0) {

//       deletedImages.forEach((id) => {

//         const oldImage = banner.images.find(
//           (img) => img._id.toString() === id
//         );

//         if (oldImage) {

//           if (fs.existsSync(oldImage.image)) {
//             fs.unlinkSync(oldImage.image);
//           }

//         }

//       });

//     }

//     // -----------------------------
//     // Keep remaining images
//     // -----------------------------

//     banner.images = existingImages;

//     // -----------------------------
//     // Add newly uploaded images
//     // -----------------------------

//     if (req.files && req.files.length > 0) {

//       req.files.forEach((file, index) => {

//         let alt = "";

//         if (Array.isArray(req.body.alt)) {
//           alt = req.body.alt[index] || "";
//         } else {
//           alt = req.body.alt || "";
//         }

//         banner.images.push({
//           image: `${uploadDir}/${file.filename}`,
//           alt,
//         });

//       });

//     }

//     // -----------------------------

//     banner.content = content;
//     banner.metaTitle = metaTitle;
//     banner.metaDescription = metaDescription;
//     banner.metaKeywords = metaKeywords;

//     await banner.save();

//     res.json({
//       success: true,
//       message: "City banner updated successfully",
//     });

//   } catch (err) {

//     console.error(err);

//     res.status(500).json({
//       message: "Server error",
//     });

//   }
// });
/* -------------------- Updated Backend PUT Route -------------------- */
router.put("/:cityId", upload.array("images", 20), async (req, res) => {
  try {
    const { cityId } = req.params;
    const {
      content,
      metaTitle,
      metaDescription,
      metaKeywords,
    } = req.body;

    const banner = await CityBanner.findOne({ city: cityId });

    if (!banner) {
      return res.status(404).json({ message: "Banner not found" });
    }

    // 1. Existing Images Configuration
    let existingImages = [];
    if (req.body.existingImages) {
      existingImages = JSON.parse(req.body.existingImages);
    }

    // 2. Deleted Images Management
    let deletedImages = [];
    if (req.body.deletedImages) {
      deletedImages = JSON.parse(req.body.deletedImages);
    }

    // Remove deleted files from disk storage
    if (deletedImages.length > 0) {
      deletedImages.forEach((id) => {
        const oldImage = banner.images.find(
          (img) => img._id.toString() === id
        );
        if (oldImage && oldImage.image) {
          if (fs.existsSync(oldImage.image)) {
            fs.unlinkSync(oldImage.image);
          }
        }
      });
    }

    // Sync baseline collection items
    banner.images = existingImages;

    // 3. Process Newly Appended Uploads
    if (req.files && req.files.length > 0) {
      req.files.forEach((file, index) => {
        let altValue = "";

        // ✅ FIXED: Now reads 'altTexts' securely to match frontend key definition
        if (Array.isArray(req.body.altTexts)) {
          altValue = req.body.altTexts[index] || "";
        } else if (typeof req.body.altTexts === "string") {
          // Fallback if exactly 1 image gets appended during edit mode setup
          altValue = index === 0 ? req.body.altTexts : "";
        }

        banner.images.push({
          image: `${uploadDir}/${file.filename}`,
          alt: altValue,
        });
      });
    }

    // 4. Update metadata tracking properties
    banner.content = content;
    banner.metaTitle = metaTitle;
    banner.metaDescription = metaDescription;
    banner.metaKeywords = metaKeywords;

    await banner.save();

    res.json({
      success: true,
      message: "City banner updated successfully",
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});
router.delete("/image/:bannerId/:index", async (req, res) => {
  try {
    const { bannerId, index } = req.params;

    const banner = await CityBanner.findById(bannerId);

    if (!banner) {
      return res.status(404).json({
        message: "Banner not found",
      });
    }

    const img = banner.images[index];

    if (!img) {
      return res.status(404).json({
        message: "Image not found",
      });
    }

    if (
      img.image &&
      fs.existsSync(img.image)
    ) {
      fs.unlinkSync(img.image);
    }

    banner.images.splice(index, 1);

    await banner.save();

    res.json({
      success: true,
      message: "Image deleted",
    });
  } catch (err) {
    console.error(err);

    res.status(500).json({
      message: "Server error",
    });
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
