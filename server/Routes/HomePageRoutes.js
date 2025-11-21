const express = require("express");
const router = express.Router();
const HomePage = require("../Models/HomePage");
const multer = require("multer");
const path = require("path");
const fs = require("fs");

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
    { name: "siteLogoLight", maxCount: 1 }
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

      const existing = await HomePage.findOne();

      // ------------------------------
      // IF UPDATING EXISTING DOCUMENT
      // ------------------------------
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
