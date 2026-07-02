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
      // "directory-banner" + path.extname(file.originalname)
      Date.now()+"-"+Math.round(Math.random()*99999)+path.extname(file.originalname)
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
  uploadBanner.array("banners",20),
  async (req, res) => {
    try {
      // if (!req.file) {
      //   return res.status(400).json({ message: "Banner image required" });
      // }

      // const bannerPath = `${uploadDir}/${req.file.filename}`;
      if (!req.files || req.files.length === 0) {
        return res.status(400).json({
          message: "Please upload at least one banner."
        });
      }

      const uploadedImages = req.files.map((file, index) => ({
        image: `${uploadDir}/${file.filename}`,
        alt: Array.isArray(req.body.alts)
          ? req.body.alts[index] || ""
          : req.body.alts || ""
      }));

      // Check if banner already exists
      let banner = await DirectoryBanner.findOne();

      if (banner) {
        // UPDATE
        // banner.banner = bannerPath;
        banner.banners.push(...uploadedImages);
        await banner.save();

        return res.json({
          success: true,
          message: "Banner updated successfully",
          banner,
        });
      } else {
        // CREATE
        // banner = new DirectoryBanner({ banner: bannerPath });
        banner = new DirectoryBanner({
    banners: uploadedImages
});
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
router.delete("/image/:id", async (req, res) => {
  try {

    const banner = await DirectoryBanner.findOne();

    if (!banner) {
      return res.status(404).json({
        message: "Banner not found"
      });
    }

    const image = banner.banners.id(req.params.id);

    if (!image) {
      return res.status(404).json({
        message: "Image not found"
      });
    }

    const filePath = path.join(
      __dirname,
      "..",
      image.image
    );

    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }

    image.deleteOne(); // or image.remove() if using an older Mongoose version

    await banner.save();

    res.json({
      success: true
    });

  } catch (err) {

    console.error(err);

    res.status(500).json({
      message: err.message
    });

  }
});

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
