const express = require("express");
const router = express.Router();
const multer = require("multer");
const fs = require("fs");
const path = require("path");
const Ad = require("../Models/Ad");
const AdSetting = require("../Models/AdSetting");

// Upload setup
const uploadDir = "uploads/ads";
if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadDir),
  filename: (req, file, cb) =>
    cb(null, file.fieldname + "-" + Date.now() + path.extname(file.originalname))
});
const upload = multer({ storage, limits: { fileSize: 2 * 1024 * 1024 } });
const uploadSingleWithError = (fieldName) => (req, res, next) => {
  upload.single(fieldName)(req, res, (err) => {
    if (err instanceof multer.MulterError) {
      if (err.code === "LIMIT_FILE_SIZE") {
        return res.status(400).json({
          success: false,
          message: "Image too large (max 2MB allowed)"
        });
      }

      return res.status(400).json({
        success: false,
        message: err.message
      });
    }

    if (err) {
      return res.status(400).json({
        success: false,
        message: err.message || "Image upload failed"
      });
    }

    next();
  });
};


// 🧠 Custom Ad Settings
router.get("/settings", async (req, res) => {
  const setting = await AdSetting.findOne() || new AdSetting();
  res.json({ success: true, setting });
});

router.post("/settings", async (req, res) => {
  try {
    const { slideInterval, maxImages } = req.body;
    let setting = await AdSetting.findOne();
    if (setting) {
      setting.slideInterval = slideInterval;
      setting.maxImages = maxImages;
      await setting.save();
    } else {
      setting = await AdSetting.create({ slideInterval, maxImages });
    }
    res.json({ success: true, setting });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Failed to update settings" });
  }
});


// 🖼️ Ad CRUD
router.get("/", async (req, res) => {
  try {
    const ads = await Ad.find()
      .populate("category", "categoryName")
      .populate("city", "city");
    res.json({ success: true, ads });
  } catch (err) {
    console.error("Error fetching ads:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
});
router.get("/:id", async (req, res) => {
  try {
    const ad = await Ad.findById(req.params.id)
      .populate("category", "categoryName")
      .populate("city", "city");

    if (!ad) return res.status(404).json({ success: false, message: "Ad not found" });

    res.json({ success: true, ad });
  } catch (err) {
    console.error("Error fetching ad:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
});


router.post("/", uploadSingleWithError("image"), async (req, res) => {
  try {
    console.log("📩 Incoming ad data:", req.body);
    console.log("📷 Uploaded file:", req.file);

    const { category, city, position, url, page, fromDate, toDate } = req.body;

    // 🔍 Validation checks
    if (!position) {
      return res.status(400).json({ success: false, message: "Position is required" });
    }
    if (!req.file) {
      return res.status(400).json({ success: false, message: "Image is required" });
    }

    const image = `uploads/ads/${req.file.filename}`;
    const ad = new Ad({ category, city, position, url, image , page, fromDate: fromDate || null, toDate: toDate || null });

    await ad.save();

    console.log("✅ Ad saved successfully:", ad);
    res.json({ success: true, ad });
  } catch (err) {
    console.error("❌ Error saving ad:", err.message);
    console.error(err.stack);
    res.status(500).json({ success: false, message: err.message || "Server error" });
  }
});


router.patch("/:id", uploadSingleWithError("image"), async (req, res) => {
  try {
    const updateData = {};

    // Add only non-empty fields
    ["category", "city", "position", "url", "page","fromDate","toDate"].forEach((field) => {
      if (req.body[field] && req.body[field] !== "") {
        updateData[field] = req.body[field];
      }
    });

    // Handle file upload
    if (req.file) {
      updateData.image = `uploads/ads/${req.file.filename}`;
    }

    const updated = await Ad.findByIdAndUpdate(req.params.id, updateData, {
      new: true,
    });

    res.json({ success: true, ad: updated });
  } catch (err) {
    console.error("Error updating ad:", err.message);
    res.status(500).json({ success: false, message: err.message });
  }
});


router.delete("/:id", async (req, res) => {
  try {
    await Ad.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: "Ad deleted" });
  } catch (err) {
    console.error("Error deleting ad:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
});
// Increment ad impression
router.patch("/:id/impression", async (req, res) => {
  try {
    const ad = await Ad.findByIdAndUpdate(
      req.params.id,
      { $inc: { impressions: 1 } },
      { new: true }
    );
    res.json({ success: true, impressions: ad.impressions });
  } catch (err) {
    console.error("Impression error:", err);
    res.status(500).json({ success: false });
  }
});
// useEffect(() => {
//   ads.forEach(ad => {
//     fetch(`${API_BASE}/api/ads/${ad._id}/impression`, { method: "PATCH" });
//   });
// }, [ads]);
//Working click routes
// router.get("/:id/click", async (req, res) => {
//   try {
//     const ad = await Ad.findById(req.params.id);
//     if (!ad) return res.status(404).send("Ad not found");

//     ad.clicks += 1;
//     await ad.save();

//     // redirect to actual ad URL
//     res.redirect(ad.url);
//   } catch (err) {
//     console.error("Click tracking error:", err);
//     res.status(500).send("Server error");
//   }
// });
//update click routes
router.get("/:id/click", async (req, res) => {
  try {
    const ad = await Ad.findById(req.params.id);
    if (!ad) return res.status(404).send("Ad not found");

    ad.clicks += 1;
    await ad.save();

    res.redirect(ad.url); // redirect to actual ad
  } catch (err) {
    console.error("Click tracking error:", err);
    res.status(500).send("Server error");
  }
});
{/* <a href={`${API_BASE}/api/ads/${ad._id}/click`} target="_blank" rel="noopener noreferrer">
  <img src={ad.image} alt="Ad banner" />
</a> */}

// router.patch("/:id/click-track", async (req, res) => {
//   try {
//     await Ad.findByIdAndUpdate(req.params.id, {
//       $inc: { clicks: 1 }
//     });

//     res.json({ success: true });
//   } catch (err) {
//     console.error("Click tracking error:", err);
//     res.status(500).json({ success: false });
//   }
// });
router.patch("/:id/click-track", async (req, res) => {
  try {
    await Ad.findByIdAndUpdate(req.params.id, {
      $inc: { clicks: 1 }
    });

    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ success: false });
  }
});
router.get("/earnings/:id", async (req, res) => {
  const ad = await Ad.findById(req.params.id);
  const CPM_RATE = 2.5; // ₹2.5 per 1000 views
  const CPC_RATE = 1.0; // ₹1 per click
  const earnings = (ad.impressions / 1000) * CPM_RATE + ad.clicks * CPC_RATE;
  res.json({ earnings });
});





// without shuffle
// router.get("/top/:pgname", async (req, res) => {
//   try {
//     const {pgname } = req.params;
//     const ads = await Ad.find({ page: pgname, position: "top" })
//       .populate("category", "categoryName")
//       .populate("city", "city");

//     const setting = await AdSetting.findOne() || { slideInterval: 5, maxImages: 5 };

//     res.json({
//       success: true,
//       ads,
//       settings: setting
//     });
//   } catch (err) {
//     console.error("Error loading home ads:", err);
//     res.status(500).json({ success: false, message: "Server error" });
//   }
// });
// router.get("/bottom/:pgname", async (req, res) => {
//   try {
//     const {pgname } = req.params;
//     const ads = await Ad.find({ page: pgname, position: "bottom" })
//       .populate("category", "categoryName")
//       .populate("city", "city");

//     const setting = await AdSetting.findOne() || { slideInterval: 5, maxImages: 5 };

//     res.json({
//       success: true,
//       ads,
//       settings: setting
//     });
//   } catch (err) {
//     console.error("Error loading home ads:", err);
//     res.status(500).json({ success: false, message: "Server error" });
//   }
// });
// router.get("/middle/:pgname", async (req, res) => {
//   try {
//     const {pgname } = req.params;
//     const ads = await Ad.find({ page: pgname, position: "middle" })
//       .populate("category", "categoryName")
//       .populate("city", "city");

//     const setting = await AdSetting.findOne() || { slideInterval: 5, maxImages: 5 };

//     res.json({
//       success: true,
//       ads,
//       settings: setting
//     });
//   } catch (err) {
//     console.error("Error loading home ads:", err);
//     res.status(500).json({ success: false, message: "Server error" });
//   }
// });

// with shuffle
router.get("/top/:pgname", async (req, res) => {
  try {
    const { pgname } = req.params;

    // const ads = await Ad.aggregate([
    //   { $match: { page: pgname, position: "top" } },
    //   { $sample: { size: 50 } } // adjust size if needed
    // ]);
    const today = new Date();

    const ads = await Ad.aggregate([
    {
    $match:{
    page: pgname,
    position:"top",

    $or:[
    { fromDate: null, toDate: null },   // always show
    {
    fromDate:{ $lte: today },
    toDate:{ $gte: today }
    }
    ]
    }
    },
    { $sample:{ size:50 } }
    ]);

    const populatedAds = await Ad.populate(ads, [
      { path: "category", select: "categoryName" },
      { path: "city", select: "city" }
    ]);

    const setting =
      (await AdSetting.findOne()) || { slideInterval: 5, maxImages: 5 };

    res.json({
      success: true,
      ads: populatedAds,
      settings: setting
    });
  } catch (err) {
    console.error("Error loading top ads:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
});
router.get("/bottom/:pgname", async (req, res) => {
  try {
    const { pgname } = req.params;

    // const ads = await Ad.aggregate([
    //   { $match: { page: pgname, position: "bottom" } },
    //   { $sample: { size: 50 } } // adjust size if needed
    // ]);
    const today = new Date();

    const ads = await Ad.aggregate([
    {
    $match:{
    page: pgname,
    position:"bottom",

    $or:[
    { fromDate: null, toDate: null },   // always show
    {
    fromDate:{ $lte: today },
    toDate:{ $gte: today }
    }
    ]
    }
    },
    { $sample:{ size:50 } }
    ]);

    const populatedAds = await Ad.populate(ads, [
      { path: "category", select: "categoryName" },
      { path: "city", select: "city" }
    ]);

    const setting =
      (await AdSetting.findOne()) || { slideInterval: 5, maxImages: 5 };

    res.json({
      success: true,
      ads: populatedAds,
      settings: setting
    });
  } catch (err) {
    console.error("Error loading top ads:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
});
router.get("/middle/:pgname", async (req, res) => {
  try {
    const { pgname } = req.params;

    // const ads = await Ad.aggregate([
    //   { $match: { page: pgname, position: "middle" } },
    //   { $sample: { size: 50 } } // adjust size if needed
    // ]);
    const today = new Date();

    const ads = await Ad.aggregate([
    {
    $match:{
    page: pgname,
    position:"middle",

    $or:[
    { fromDate: null, toDate: null },   // always show
    {
    fromDate:{ $lte: today },
    toDate:{ $gte: today }
    }
    ]
    }
    },
    { $sample:{ size:50 } }
    ]);

    const populatedAds = await Ad.populate(ads, [
      { path: "category", select: "categoryName" },
      { path: "city", select: "city" }
    ]);

    const setting =
      (await AdSetting.findOne()) || { slideInterval: 5, maxImages: 5 };

    res.json({
      success: true,
      ads: populatedAds,
      settings: setting
    });
  } catch (err) {
    console.error("Error loading top ads:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
});




module.exports = router;
