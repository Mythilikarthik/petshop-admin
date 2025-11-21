const express = require("express");
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const Listing = require("../Models/Listing");
const Message = require("../Models/Message");
const Review = require("../Models/Review");
const { verifyToken } = require("../middleware/authMiddleware");
const PetCategory = require("../Models/PetCategory");

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
    const user_id = req.userType === "user" ? req.userId : null;
    const existing = await Listing.findOne(
      { shopName, email, city }
    ).collation({ locale: "en", strength: 2 });
    if (existing) {
      return res.status(400).json({ success: false, message: "Listing already exists" });
    }

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
      user_id,
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
router.put("/claim/:id", verifyToken, async (req, res) => {
  try {
    const { id } = req.params;

    const listing = await Listing.findByIdAndUpdate(
      id,
      {
        isClaimed: true,
        claimedBy: req.body.claimedBy,
        claimedAt: new Date(),
        user_id: req.body.claimedBy,
      },
      { new: true }
    );

    res.json({ success: true, message: "Listing claimed successfully!", listing });
  } catch (err) {
    res.json({ success: false, message: err.message });
  }
});

router.post("/simple", verifyToken, async (req, res) => {
  try {
    const newListing = new Listing({
      ...req.body,
      photos: [],
      created_by_id: req.userId,
      created_by_type: req.userType,
      status: req.userType === "admin" ? "approved" : "pending",
    });

    await newListing.save();

    res.json({ success: true, message: "Listing created successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

router.post("/city", async (req, res) => {
  try {
    const {city} = req.body;
    const listings = await Listing.countDocuments({ city : { $in : [city]}});
    res.json({ success: true, listings });
  } catch (err) {
    console.error("Error fetching listings by city:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
})
// GET Featured Pet Services
router.get("/featured-services", async (req, res) => {
  try {
    const listings = await Listing.find({ status: "approved" })
      .populate("city", "city")
      .populate("categories", "categoryName")
      .populate("petCategories", "categoryName")
      .limit(3) // only 3 featured
      .lean();

    // Get rating for each listing
    const listingIds = listings.map(l => l._id);

    const reviews = await Review.aggregate([
      { $match: { listingId: { $in: listingIds }, status: "approved" } },
      {
        $group: {
          _id: "$listingId",
          averageRating: { $avg: "$rating" },
        }
      }
    ]);

    // Map ratings
    const ratingMap = {};
    reviews.forEach(r => {
      ratingMap[r._id.toString()] = Number(r.averageRating.toFixed(1));
    });

    // Combine listing + rating
    const result = listings.map(listing => ({
      id: listing._id,
      title: listing.shopName,
      phone: listing.phone,
      email: listing.email,
      category: listing.categories.map(p => p.categoryName),
      description: listing.description,
      location: listing.city?.city || "Unknown",
      rating: ratingMap[listing._id.toString()] || 0,
      tags: listing.petCategories.map(p => p.categoryName),
      image: listing.photos?.[0] || null
    }));

    res.json({ success: true, services: result });

  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Server Error" });
  }
});
// router.post("/by-pet-category", async (req, res) => {
//   try {
//     const { petCategoryIds } = req.body;  // array or single ID

//     if (!petCategoryIds || petCategoryIds.length === 0) {
//       return res.status(400).json({ success: false, msg: "Provide petCategoryIds" });
//     }

//     const listings = await Listing.find({
//       petCategories: { $in: petCategoryIds }
//     })
//       .populate("categories", "categoryName")
//       .populate("petCategories", "petCategoryName")
//       .populate("city", "city");

//     res.json({ success: true, listings });
//   } catch (error) {
//     res.status(500).json({ success: false, error: error.message });
//   }
// });
router.post("/by-pet-category", async (req, res) => {
  try {
    const { categoryName } = req.body;

    if (!categoryName) {
      return res.status(400).json({ success: false, msg: "Provide categoryName" });
    }

    // Find pet category ID from name
    const petCategory = await PetCategory.findOne({ 
      categoryName: { $regex: new RegExp(`^${categoryName}$`, "i") }
     });

    if (!petCategory) {
      return res.json({ success: true, listings: [petCategory, categoryName] });
    }

    const listings = await Listing.find({
      petCategories: petCategory._id
    })
      .populate("categories", "categoryName")
      .populate("petCategories", "petCategoryName")
      .populate("city", "city");

    res.json({ success: true, listings });

  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});


router.post("/bulk", verifyToken, async (req, res) => {
  try {
    const { listings } = req.body;
    const userId = req.userId;
    const userType = req.userType;
    const status = userType === "admin" ? "approved" : "pending";

    if (!userId || !userType) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized: missing user info"
      });
    }

    // 🧹 Clean _id + inject user info
    const cleanListings = listings.map(({ _id, ...rest }, idx) => ({
      ...rest,
      __row: idx + 2, // Excel row (assuming headers in row 1)
      created_by_id: userId,
      created_by_type: userType,
      status
    }));

    // ✅ Validate schema before proceeding
    for (const listing of cleanListings) {
      const doc = new Listing(listing);
      const error = doc.validateSync();
      if (error) {
        return res.status(400).json({
          success: false,
          message: `Row ${listing.__row}: Listing "${listing.shopName}" failed validation → ${error.message}`
        });
      }
    }

    // 🧩 Check duplicates *within* uploaded file
    const seenKeys = new Map();
    const internalDupes = [];

    for (const l of cleanListings) {
      const key = `${l.shopName.trim().toLowerCase()}|${l.email.trim().toLowerCase()}|${l.city}`;
      if (seenKeys.has(key)) {
        internalDupes.push(
          `Row ${l.__row}: "${l.shopName}" (${l.email}) matches Row ${seenKeys.get(key)}`
        );
      } else {
        seenKeys.set(key, l.__row);
      }
    }

    if (internalDupes.length) {
      return res.status(400).json({
        success: false,
        message: `Duplicate entries found within uploaded file:\n${internalDupes.map(d => "• " + d).join("\n")}\nPlease correct and re-upload.`
      });
    }
    const duplicateErrors = [];

    for (const listing of cleanListings) {
      // const existing = await Listing.findOne({
      //   shopName: { $regex: new RegExp(`^${listing.shopName.trim()}$`, "i") },
      //   email: { $regex: new RegExp(`^${listing.email.trim()}$`, "i") },
      //   city: listing.city
      // }).populate("city", "city");
      const existing = await Listing.findOne({
        shopName: listing.shopName, 
        email: listing.email,
        city: listing.city,
      }).populate("city", "city").collation({ locale: "en", strength: 2 });

      if (existing) {
        duplicateErrors.push(
          `Row ${listing.__row}: "${listing.shopName}" (${listing.email}) already exists in ${existing.city?.city || "this city"}`
        );
      }
    }

    if (duplicateErrors.length > 0) {
      return res.status(400).json({
        success: false,
        message: `Duplicate listings found in database:\n${duplicateErrors.map(d => "• " + d).join("\n")}\nImport stopped.`
      });
    }

    // ✅ Insert all if clean
    const created = await Listing.insertMany(cleanListings);
    res.json({ success: true, created });

  } catch (err) {
    console.error("Bulk insert error:", err);

    if (err.code === 11000) {
      return res.status(400).json({
        success: false,
        message: "Duplicate record detected during insertion. Please re-check your data."
      });
    }

    res.status(500).json({ success: false, message: "Bulk insert failed" });
  }
});




// router.post("/bulk", verifyToken, upload.array("photos", 100), async (req, res) => {
//   try {
//     let listings = req.body.listings;

//     if (!listings) return res.status(400).json({ success: false, message: "No listings provided" });
//     if (typeof listings === "string") listings = JSON.parse(listings);
//     if (!Array.isArray(listings) || listings.length === 0)
//       return res.status(400).json({ success: false, message: "No listings provided" });

//     const files = req.files || [];
//     const fileMap = new Map(files.map((f) => [f.originalname, `/uploads/listings/${f.filename}`]));

//     const docs = listings.map((item) => {
//       const shopName = (item.shopName || item.shopname || "").trim();
//       const email = (item.email || "").trim();

//       const categories = Array.isArray(item.categories)
//         ? item.categories
//         : typeof item.categories === "string"
//         ? item.categories.split(/[,;|]/).map((s) => s.trim()).filter(Boolean)
//         : [];

//       const petCategories = Array.isArray(item.petCategories)
//         ? item.petCategories
//         : typeof item.petCategories === "string"
//         ? item.petCategories.split(/[,;|]/).map((s) => s.trim()).filter(Boolean)
//         : [];

//       const photos = [];
//       const imageFilename = (item.imageFilename || "").trim();
//       if (fileMap.has(imageFilename)) photos.push(fileMap.get(imageFilename));
//       if (item.imageUrl) photos.push(item.imageUrl);

//       return {
//         shopName,
//         email,
//         phone: item.phone || "",
//         address: item.address || "",
//         categories,
//         petCategories,
//         photos,
//         status: req.userType === "admin" ? "approved" : "pending",
//         created_by_type: req.userType,
//         created_by_id: req.userId,
//       };
//     });

//     const created = await Listing.insertMany(docs);
//     res.json({ success: true, created });
//   } catch (err) {
//     console.error("Bulk insert error details:", err);
//     res.status(500).json({
//       success: false,
//       message: "Server error during bulk import",
//       error: err.message || err,
//     });
//   }
// });

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
    const listings = await Listing.find()
    .populate("categories", "categoryName")
      .populate("petCategories", "categoryName")
      .populate("city", "city").sort({ created_at: -1 }); // <-- add lean()
    res.json({ success: true, listings });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Server error" });
  }
});


router.get("/counts", verifyToken, async (req, res) => {
  try {
    const user_id = req.userId;
    const listings = await Listing.find({user_id, status: "approved" })
      .populate("categories", "categoryName")
      .populate("petCategories", "categoryName")
      .populate("city", "city")
      .populate("user_id", "name email")
      .sort({ created_at: -1 }); // lean for plain JS objects
      if(listings.length === 0) {
        return res.json({
        success: true,        
        counts: {
          views: 0,
          messages: 0,
          reviews: 0,
        },
      });
      }
const listing_id = listings[0]._id;
    const messageCount = await Message.countDocuments({ receiverId: user_id });

    // Get review count where this user is reviewed
    const reviewCount = await Review.countDocuments({ listingId: listing_id, status : "approved" });

    res.json({ success: true, counts: {
        views: listings[0].views,
        messages: messageCount,
        reviews: reviewCount,
      }, });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

router.get("/user/:id", async (req, res) => {
  try {
    const listing = await Listing.findOne({user_id : req.params.id})
    .populate("categories", "categoryName")
      .populate("petCategories", "categoryName")
      .populate("city", "city").sort({ created_at: -1 }); 
    res.json({ success: true, listing });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Server error" });
  }
});
router.get("/pending", async (req, res) => {
  try {
    const listings = await Listing.find({status : "pending"})
    .populate("categories", "categoryName")
      .populate("petCategories", "categoryName")
      .populate("city", "city").sort({ created_at: -1 });
    res.json({ success: true, listings });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

// READ (one)
router.get("/:id", async (req, res) => {
  try {
    const listing = await Listing.findById(req.params.id)
    .populate("categories", "categoryName")
      .populate("petCategories", "categoryName")
      .populate("city", "city");
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
router.put("/user/:id", verifyToken, upload.array("photos", 10), async (req, res) => {
  try {
    const userId = req.params.id;
    const data = req.body;
    const status = req.userType === "admin" ? "approved" : "pending";

    console.log("Update or create listing for user:", userId, data);

    // Parse categories properly
    if (data["categories[]"]) {
      data.categories = Array.isArray(data["categories[]"])
        ? data["categories[]"]
        : [data["categories[]"]];
    }

    if (data["petCategories[]"]) {
      data.petCategories = Array.isArray(data["petCategories[]"])
        ? data["petCategories[]"]
        : [data["petCategories[]"]];
    }

    // Existing photos
    let existingPhotos = [];
    if (data["existingPhotos[]"]) {
      existingPhotos = Array.isArray(data["existingPhotos[]"])
        ? data["existingPhotos[]"]
        : [data["existingPhotos[]"]];
    }

    // Uploaded photos
    const uploadedPhotos = req.files.map(f => `/uploads/listings/${f.filename}`);

    // If nothing sent, preserve old photos (if listing exists)
    const currentListing = await Listing.findOne({ user_id: userId });
    if (!uploadedPhotos.length && !existingPhotos.length && currentListing) {
      existingPhotos = currentListing.photos || [];
    }

    // Merge photos
    data.photos = [...existingPhotos, ...uploadedPhotos];

    // --- Find and Update ---
    let listing = await Listing.findOneAndUpdate(
      { user_id: userId },
      {
        ...data,
        status,
        user_id: userId,
        created_by_id: req.userId,
        created_by_type: req.userType,
      },
      { new: true }
    );

await listing.save();
    // --- If found and updated ---
    return res.json({ success: true, message: "Listing updated successfully", listing });
  } catch (err) {
    console.error("Error in listing update/create:", err);
    res.status(500).json({ success: false, message: "Server error", error: err.message });
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
