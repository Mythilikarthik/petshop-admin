const express = require("express");
const router = express.Router();
const DirectoryBanner = require("../Models/DirectoryBanner");
const City = require("../Models/City");
const multer = require("multer");
const path = require("path");
const fs = require("fs");

const uploadDir = "uploads/directory-banners";
if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    cb(
      null,
      "directory-banner" + path.extname(file.originalname)
    );
  },
});

const uploadBanner = multer({
  storage,
  limits: { fileSize: 2 * 1024 * 1024 }, // 2MB
});


// CREATE / UPDATE
router.post(
  "/",
  uploadBanner.single("banner"),
  async (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({ message: "Banner image required" });
      }

      const bannerPath = `${uploadDir}/${req.file.filename}`;

      // Check if banner already exists
      let banner = await DirectoryBanner.findOne();

      if (banner) {
        // UPDATE
        banner.banner = bannerPath;
        await banner.save();

        return res.json({
          success: true,
          message: "Banner updated successfully",
          banner,
        });
      } else {
        // CREATE
        banner = new DirectoryBanner({ banner: bannerPath });
        await banner.save();

        return res.json({
          success: true,
          message: "Banner added successfully",
          banner,
        });
      }
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: "Server error" });
    }
  }
);

// GET banner (for edit preview)
router.get("/", async (req, res) => {
  const banner = await DirectoryBanner.findOne();
  res.json({ success: true, banner });
});
router.get("/name/:city", async (req, res) => {
  try {
    const cityDoc = await City.findOne({
      city: new RegExp(`^${req.params.city}$`, "i")
    });

    if (!cityDoc) {
      return res.status(404).json({ success: false, message: "City not found" });
    }

    const banner = await DirectoryBanner.findOne({ city: cityDoc._id })
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

router.delete("/delete", async (req, res) => {
  try {
    const banner = await DirectoryBanner.findOne();
    if (!banner) {
      return res.status(404).json({ message: "No banner found" });
    }

    // delete file from server
    const filePath = path.join(
      __dirname,
      "..",
      banner.banner
    );

    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }

    // delete DB record
    await DirectoryBanner.deleteMany();

    res.json({
      success: true,
      message: "Banner deleted successfully",
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
