const express = require("express");
const router = express.Router();
const HomePage = require("../Models/HomePage");
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const sharp = require("sharp");

// ------------------------------
// MULTER STORAGE CONFIG
// ------------------------------
const uploadDir = "uploads/homepage/";
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}
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

// File filter
const fileFilter = (req, file, cb) => {
  const allowed = ["image/png", "image/jpeg", "image/jpg", "image/webp"];
  if (allowed.includes(file.mimetype)) cb(null, true);
  else cb(new Error("Invalid file type! Only images allowed."));
};

const upload = multer({ storage, fileFilter });

// ------------------------------
// GET HOMEPAGE DETAILS
// ------------------------------
router.get("/", async (req, res) => {
  try {
    const home = await HomePage.findOne();
    res.json({ success: true, home });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// ------------------------------
// CREATE OR UPDATE HOMEPAGE
// ------------------------------
router.post(
  "/",
  upload.fields([
    { name: "siteLogoDark", maxCount: 1 },
    { name: "siteLogoLight", maxCount: 1 },
    { name: "bannerImages", maxCount: 10 }
  ]),
  async (req, res) => {
    try {
      const body = req.body;

      // Prepare image paths
      if (req.files?.siteLogoDark) {
        body.siteLogoDark = `${uploadDir}${req.files.siteLogoDark[0].filename}`;
      }

      if (req.files?.siteLogoLight) {
        body.siteLogoLight = `${uploadDir}${req.files.siteLogoLight[0].filename}`;
      }
      // Handle banner slider images
      if (req.files?.bannerImages) {
        body.bannerImages = req.files.bannerImages.map(
          file => `${uploadDir}${file.filename}`
        );
      }
      // if (req.files?.bannerImages) {
      //   body.bannerImages = [];

      //   for (const file of req.files.bannerImages) {
      //     const filename = `banner-${Date.now()}-${file.originalname}`;
      //     const filepath = `${uploadDir}${filename}`;

      //     await sharp(file.buffer)
      //       .resize(1200, 300)
      //       .toFile(filepath);

      //     body.bannerImages.push(filepath);
      //   }
      // }   


      const existing = await HomePage.findOne();

      // ------------------------------
      // IF UPDATING EXISTING DOCUMENT
      // ------------------------------
      if (existing && req.files?.bannerImages && existing.bannerImages?.length) {
        existing.bannerImages.forEach(img => {
          if (fs.existsSync(img)) fs.unlinkSync(img);
        });
      }
      if (existing) {

        // Delete replaced logo images
        if (req.files?.siteLogoDark && existing.siteLogoDark) {
          const oldPath = existing.siteLogoDark.replace("/", "");
          if (fs.existsSync(oldPath)) fs.unlinkSync(oldPath);
        }

        if (req.files?.siteLogoLight && existing.siteLogoLight) {
          const oldPath = existing.siteLogoLight.replace("/", "");
          if (fs.existsSync(oldPath)) fs.unlinkSync(oldPath);
        }

        const updated = await HomePage.findByIdAndUpdate(
          existing._id,
          body,
          { new: true }
        );

        return res.json({
          success: true,
          message: "Homepage updated",
          home: updated
        });
      }

      // ------------------------------
      // CREATE NEW DOCUMENT
      // ------------------------------
      const created = await HomePage.create(body);

      res.json({
        success: true,
        message: "Homepage created",
        home: created
      });

    } catch (err) {
      console.error(err);
      res.status(500).json({ success: false, message: err.message });
    }
  }
);

module.exports = router;
