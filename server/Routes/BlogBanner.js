const express = require("express");
const router = express.Router();
const BlogBanner = require("../Models/BlogBanner");
const multer = require("multer");
const path = require("path");
const fs = require("fs");

const uploadDir = "uploads/blog-banners";
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
      let banner = await BlogBanner.findOne();

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
        banner = new BlogBanner({ banner: bannerPath });
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
  const banner = await BlogBanner.findOne();
  res.json({ success: true, banner });
});

router.delete("/delete", async (req, res) => {
  try {
    const banner = await BlogBanner.findOne();
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
    await BlogBanner.deleteMany();

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
