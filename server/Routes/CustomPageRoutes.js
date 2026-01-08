const express = require("express");
const router = express.Router();
const CustomPage = require("../Models/CustomPage");
const multer = require("multer");
const path = require("path");
const fs = require("fs");

const dir = "uploads/page-banners";
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    
    cb(null, dir);
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    const filename = `${Date.now()}${ext}`;
    cb(null, filename);
  }
});

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
  fileFilter: (req, file, cb) => {
    const allowed = /jpeg|jpg|png|webp/;
    const ext = path.extname(file.originalname).toLowerCase();
    if (allowed.test(ext)) cb(null, true);
    else cb(new Error("Only images are allowed"));
  }
});

// ✅ Create a new custom page
// router.post("/", async (req, res) => {
//   try {
//     const {
//       page,
//       category,
//       city,
//       pageTitle,
//       metaKeyword,
//       metaDescription,
//       content,
//     } = req.body;
//     page = page.replace(/\s+/g, "").toLowerCase();
//     // Basic validation
//     if (!page || !pageTitle) {
//       return res.status(400).json({ success: false, message: "Page and Title are required" });
//     }

//     const newPage = new CustomPage({
//       page,
//       category,
//       city,
//       pageTitle,
//       metaKeyword,
//       metaDescription,
//       content,
//     });

//     await newPage.save();
//     res.status(201).json({ success: true, message: "Page created successfully", page: newPage });
//   } catch (err) {
//     if(err.code === 11000) {
//       res.status(400).json({ success: false, message: "Duplicate Page already exists" })
//     }
//     console.error("Error creating page:", err);
//     res.status(500).json({ error: err.message });
//   }
// });

router.post("/", upload.single("banner"), async (req, res) => {
  try {
    let { page, category, city, pageTitle, metaKeyword, metaDescription, content } = req.body;
    page = page.replace(/\s+/g, "").toLowerCase();

    if (!page || !pageTitle) return res.status(400).json({ success: false, message: "Page and Title are required" });

    // Check if banner already exists for this page+city
    const existing = await CustomPage.findOne({ page, city });
    if (existing && existing.banner) {
      return res.status(409).json({ success: false, message: "Banner already exists for this page and city" });
    }

    const newPage = new CustomPage({
      page,
      category,
      city,
      pageTitle,
      metaKeyword,
      metaDescription,
      content,
      banner: req.file ? `${dir}/${req.file.filename}` : null
    });

    await newPage.save();
    res.status(201).json({ success: true, message: "Page created successfully", page: newPage });

  } catch (err) {
    console.error("Error creating page:", err);
    res.status(500).json({ success: false, message: err.message });
  }
});

// -------------------- Update Page --------------------
// router.patch("/:id", upload.single("banner"), async (req, res) => {
//   try {
//     const updateData = { ...req.body };

//     if (updateData.page) {
//       updateData.page = updateData.page.replace(/\s+/g, "").toLowerCase();
//     }

//     // Handle banner
//     if (req.file) {
//       updateData.banner = `/uploads/page-banners/${req.file.filename}`;
//     }

//     // Optional: Prevent overwriting banner if it already exists for the page+city
//     if (updateData.page && updateData.city) {
//       const existing = await CustomPage.findOne({ page: updateData.page, city: updateData.city });
//       if (existing && existing._id.toString() !== req.params.id && existing.banner) {
//         return res.status(409).json({ success: false, message: "Banner already exists for this page and city" });
//       }
//     }

//     const updated = await CustomPage.findByIdAndUpdate(req.params.id, updateData, { new: true });
//     if (!updated) return res.status(404).json({ success: false, message: "Page not found" });

//     res.json({ success: true, message: "Page updated successfully", page: updated });

//   } catch (err) {
//     console.error("Error updating page:", err);
//     res.status(500).json({ success: false, message: err.message });
//   }
// });
router.patch("/:id", upload.single("banner"), async (req, res) => {
  try {
    const page = await CustomPage.findById(req.params.id);
    if (!page) return res.status(404).json({ success: false });

    // Remove banner
    if (req.body.removeBanner === "true" && page.banner) {
      const filePath = "." + page.banner;
      if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
      page.banner = null;
    }

    // Replace banner
    if (req.file) {
      if (page.banner) {
        const old = "." + page.banner;
        if (fs.existsSync(old)) fs.unlinkSync(old);
      }
      page.banner = `${dir}/${req.file.filename}`;
    }

    Object.assign(page, req.body);
    page.page = page.page.replace(/\s+/g, "").toLowerCase();

    await page.save();
    res.json({ success: true, page });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});


// ✅ Get all pages
router.get("/", async (req, res) => {
  try {
    const pages = await CustomPage.find().sort({ createdAt: -1 });
    res.status(201).json({ success: true, pages});
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ✅ Get single page by ID
router.get("/:id", async (req, res) => {
  try {
    const page = await CustomPage.findById(req.params.id);
    if (!page) return res.status(404).json({ message: "Page not found" });
    res.json({success: true, page});
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
router.get("/slug/:pagename", async (req, res) => {
  try {
    const page = await CustomPage.findOne({ page : req.params.pagename});
    if (page.length === 0) return res.status(404).json({ message: "Page not found" });
    res.json({success: true, page});
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ✅ Update page
// router.patch("/:id", async (req, res) => {
//   try {
//     if (req.body.page) {
//       req.body.page = req.body.page.replace(/\s+/g, "").toLowerCase();
//     }
//     const updated = await CustomPage.findByIdAndUpdate(req.params.id, req.body, {
//       new: true,
//     });
//     if (!updated) return res.status(404).json({ message: "Page not found" });
//     res.json({ success: true, message: "Page updated successfully", page: updated });
//   } catch (err) {
//     res.status(500).json({ error: err.message });
//   }
// });

// ✅ Delete page
router.delete("/:id", async (req, res) => {
  try {
    const deleted = await CustomPage.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ message: "Page not found" });
    res.json({ message: "Page deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
