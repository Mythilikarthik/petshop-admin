const express = require("express");
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const Listing = require("../Models/Listing");
const Message = require("../Models/Message");
const Review = require("../Models/Review");
const User = require("../Models/User");
const {SECRET_KEY,verifyToken } = require("../middleware/authMiddleware");
const PetCategory = require("../Models/PetCategory");
const mongoose = require("mongoose");
const emailjs = require("@emailjs/nodejs");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");


const generateToken = (id, role) => {
  return jwt.sign({ id, role }, SECRET_KEY, { expiresIn: "7d" });
};


const sendOtpEmail = async (templateData) => {
  return emailjs.send(
    process.env.EMAILJS_SERVICE_ID_2,
    process.env.EMAILJS_TEMPLATE_ID_2,
    templateData,
    {
      publicKey: process.env.EMAILJS_PUBLIC_KEY_2,
      privateKey: process.env.EMAILJS_PRIVATE_KEY_2,
    }
  );
};

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


 const uploadDocDir = "uploads/documents";
if (!fs.existsSync(uploadDocDir)) fs.mkdirSync(uploadDocDir, { recursive: true });

// Multer config
const docStorage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadDocDir),
  filename: (req, file, cb) =>
    cb(null, Date.now() + path.extname(file.originalname)),
});
const docFileFilter = (req, file, cb) => {
  const allowedMime = [
    "application/msword",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    "application/pdf"
  ];

  const allowedExt = [".doc", ".docx", ".pdf"];
  const ext = path.extname(file.originalname).toLowerCase();

  if (!allowedMime.includes(file.mimetype) || !allowedExt.includes(ext)) {
    cb(new Error("Only doc, docx and pdf files are allowed"), false);
  } else {
    cb(null, true);
  }
};
const docUpload = multer({ 
  storage: docStorage,
  fileFilter: docFileFilter,
  limits: { fileSize: 5 * 1024 * 1024 },
 });
// router.post("/", verifyToken, upload.array("photos"), async (req, res) => {
//   try {
//     const { shopName, email, phone, address, city, country, mapUrl, description, categories, petCategories, metaTitle, metaKeyword, metaDescription } = req.body;
//     const status = req.userType === "admin" ? "approved" : "pending";
//     const user_id = req.userType === "user" ? req.userId : null;
//     const existing = await Listing.findOne(
//       { shopName, email, city }
//     ).collation({ locale: "en", strength: 2 });
//     if (existing) {
//       return res.status(400).json({ success: false, message: "Listing already exists" });
//     }

//     const newListing = new Listing({
//       shopName,
//       email,
//       phone,
//       address,
//       city,
//       country: country && country.trim() !== "" ? country : "India",
//       mapUrl,
//       description,
//       categories,
//       petCategories,
//       created_by_id: req.userId, 
//       created_by_type: req.userType, 
//       photos: req.files.map((file) => file.filename),
//       metaTitle,
//       metaKeyword,
//       metaDescription,
//       status,
//       user_id,
//     });

//     await newListing.save();
//     return res.json({ success: true, message: "Listing added successfully" });
//   } catch (err) {
//     if (err.code === 11000) {
//       return res
//         .status(400)
//         .json({ success: false, message: "Duplicate listing already exists" });
//     }
//     if (err instanceof multer.MulterError) {
//       if (err.code === "LIMIT_FILE_SIZE") {
//         return res
//           .status(400)
//           .json({ success: false, message: "File too large (max 2MB per image)" });
//       }
//     } else if (err.message.includes("Only JPG, PNG, and WEBP")) {
//       return res.status(400).json({ success: false, message: err.message });
//     }
//     console.error("Error saving listing:", err);
//     return res.status(500).json({ success: false, message: "Server error" });
//   }
// });
router.post(
  "/",
  verifyToken,
  upload.fields([
    { name: "bannerImage", maxCount: 1 },
    { name: "photos", maxCount: 10 }
  ]),
  async (req, res) => {
    try {
      const {
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
        specializedServices,
        metaTitle,
        metaKeyword,
        metaDescription
      } = req.body;

      const status = req.userType === "admin" ? "approved" : "pending";
      const user_id = req.userType === "user" ? req.userId : null;

      const existing = await Listing.findOne({ shopName, email, city })
        .collation({ locale: "en", strength: 2 });

      if (existing) {
        return res.status(400).json({
          success: false,
          message: "Listing already exists"
        });
      }

      const bannerFile = req.files?.bannerImage?.[0];
      const photoFiles = req.files?.photos || [];
      let parsedBusinessHours = [];

      if (req.body.businessHours) {
        try {
          parsedBusinessHours = JSON.parse(req.body.businessHours);
        } catch (err) {
          console.error("Invalid businessHours JSON");
          parsedBusinessHours = [];
        }
      }

      const newListing = new Listing({
        shopName,
        email,
        phone,
        businessHours: parsedBusinessHours,
        address,
        city,
        country: country?.trim() || "India",
        mapUrl,
        description,
        categories,
        petCategories,
        specializedServices,
        created_by_id: req.userId,
        created_by_type: req.userType,
        bannerImage: bannerFile ? `${uploadDir}/`+bannerFile.filename : null,
        photos: photoFiles.map(file => `${uploadDir}/`+file.filename),
        metaTitle,
        metaKeyword,
        metaDescription,
        status,
        user_id
      });

      await newListing.save();

      return res.json({
        success: true,
        message: "Listing added successfully"
      });

    } catch (err) {
      console.error("Error saving listing:", err);

      if (err.code === 11000) {
        return res.status(400).json({
          success: false,
          message: "Duplicate listing already exists"
        });
      }

      if (err instanceof multer.MulterError) {
        if (err.code === "LIMIT_FILE_SIZE") {
          return res.status(400).json({
            success: false,
            message: "File too large (max 2MB per image)"
          });
        }
      }

      return res.status(500).json({
        success: false,
        message: "Server error"
      });
    }
  }
);

// router.put("/claim/:id", verifyToken, async (req, res) => {
//   try {
//     const { id } = req.params;

//     const listing = await Listing.findByIdAndUpdate(
//       id,
//       {
//         isClaimed: true,
//         claimedBy: req.body.claimedBy,
//         claimedAt: new Date(),
//         user_id: req.body.claimedBy,
//       },
//       { new: true }
//     );

//     res.json({ success: true, message: "Listing claimed successfully!", listing });
//   } catch (err) {
//     res.json({ success: false, message: err.message });
//   }
// });
// router.put(
//   "/claim/:id",
//   verifyToken,
//   upload.array("documents"), // ✅ REQUIRED for FormData
//   async (req, res) => {
//     try {
//       const { id } = req.params;

//       const {
//         claimedBy,
//         claimRole,
//         verificationMethod,
//       } = req.body;

//       if (!claimedBy) {
//         return res.json({
//           success: false,
//           message: "claimedBy is required",
//         });
//       }

//       const verificationDocs = req.files
//         ? req.files.map((f) => f.path)
//         : [];

//       const listing = await Listing.findByIdAndUpdate(
//         id,
//         {
//           isClaimed: true,
//           claimedBy,
//           claimedAt: new Date(),
//           user_id: claimedBy,

//           claimRole,
//           verificationMethod,
//           verificationDocs,
//           claimStatus: "pending",

//           status: "pending",
//         },
//         { new: true }
//       );

//       res.json({
//         success: true,
//         message: "Claim submitted. Awaiting verification.",
//         listing,
//       });
//     } catch (err) {
//       res.json({ success: false, message: err.message });
//     }
//   }
// );

router.put(
  "/claim/:id",
  (req, res, next) => {
    docUpload.array("documents")(req, res, (err) => {
      if (err) {
        return res.status(400).json({
          success: false,
          message: err.message,
        });
      }
      next();
    });
  },
  async (req, res) => {
    try {
      const { id } = req.params;

      const {
        name,
        username,
        email,
        phone,
        password,
        claimRole,
        verificationMethod,
      } = req.body;

      // 1️⃣ Validate listing
      const listing = await Listing.findById(id);
      if (!listing) {
        return res.json({ success: false, message: "Listing not found" });
      }

      if (listing.isClaimed) {
        return res.json({
          success: false,
          message: "Listing already claimed",
        });
      }

      // 2️⃣ Check existing user
      const existingUser = await User.findOne({
        $or: [{ username }, { email }],
      });
console.log(username, email);
      if (existingUser) {
        return res.json({
          success: false,
          message: "User already exists",
        });
      }

      // 3️⃣ Create user
      const hashedPassword = await bcrypt.hash(password, 10);
      const otp = Math.floor(100000 + Math.random() * 900000).toString();

      const newUser = new User({
        name,
        username,
        email,
        phone,
        password: hashedPassword,
        otp,
        otpExpiresAt: new Date(Date.now() + 10 * 60 * 1000),
        isVerified: false,
      });

      await newUser.save();
      console.log("claimid", newUser._id);

      // 4️⃣ Update listing (pending verification)
      if (verificationMethod === "email") {
  listing.claimStatus = "otp_pending";
} else {
  listing.claimStatus = "pending"; // waiting for admin review
}

listing.isClaimed = true; // ❗ keep false until verified
      // listing.isClaimed = true;
      listing.claimedBy = newUser._id;
      listing.claimRole = claimRole;
      listing.verificationMethod = verificationMethod;
      // listing.claimStatus = "otp_pending";
      listing.status = "pending";
      listing.claimedAt = new Date();

      if (req.files?.length) {
        listing.verificationDocs = req.files.map((f) => f.path);
      }

      await listing.save();

      // 5️⃣ Send OTP if email verification
      // if (verificationMethod.toLowerCase() === "email") {
      //   await sendOtpEmail({
      //     email,
      //     name: username,
      //     otp,
      //   });
      // }
      if (verificationMethod.toLowerCase() === "email") {
        try {
          await sendOtpEmail({
            email,
            name: username,
            otp,
          });
        } catch (err) {
          console.error("Email failed:", err);

          return res.json({
            success: false,
            message: "Failed to send OTP email",
          });
        }
      }

      const token = generateToken(newUser._id, "user");

      res.json({
        success: true,
        message: "Claim initiated. OTP sent.",
        userId: newUser._id,
        token,
      });
    } catch (err) {
      console.error(err);
      res.status(500).json({ success: false, message: err.message });
    }
  }
);
// router.put(
//   "/claim/:id",
//   verifyToken,
//   (req, res, next) => {
//     docUpload.array("documents")(req, res, (err) => {
//       if (err) {
//         return res.status(400).json({
//           success: false,
//           message: err.message,
//         });
//       }
//       next();
//     });
//   },
//   async (req, res) => {
//     try {
//       const { id } = req.params;
//       const { claimRole, verificationMethod } = req.body;
//       const claimedBy = req.userId;

//       if (!claimRole || !verificationMethod) {
//         return res.json({ success: false, message: "Missing fields" });
//       }

//       const listing = await Listing.findById(id);
//       if (!listing) {
//         return res.json({ success: false, message: "Listing not found" });
//       }

//       if (listing.isClaimed) {
//         return res.json({
//           success: false,
//           message: "Listing already claimed and under verification",
//         });
//       }

//       listing.isClaimed = true;
//       listing.claimedBy = claimedBy;
//       listing.claimRole = claimRole;
//       listing.verificationMethod = verificationMethod;
//       listing.claimStatus = "pending";
//       listing.status = "pending";
//       listing.claimedAt = new Date();

//       if (req.files?.length) {
//         listing.verificationDocs = req.files.map((f) => f.path);
//       }

//       await listing.save();

//       const isEmail = verificationMethod.toLowerCase() === "email";

//       if (isEmail) {
//         const otp = Math.floor(100000 + Math.random() * 900000).toString();
//         const user = await User.findById(claimedBy);

//         if (!user) {
//           return res
//             .status(404)
//             .json({ success: false, message: "User not found" });
//         }

//         user.otp = otp;
//         user.otpExpiresAt = new Date(Date.now() + 10 * 60 * 1000);
//         await user.save();

//         await sendOtpEmail({
//           email: user.email,
//           name: user.username,
//           otp: otp,
//         });
//       }

//       res.json({
//         success: true,
//         requiresOtp: isEmail,
//         message: isEmail
//           ? "OTP sent to email"
//           : "Claim submitted for document verification",
//       });
//     } catch (err) {
//       console.error(err);
//       res.status(500).json({ success: false, message: err.message });
//     }
//   }
// );

// routes/listing.js (or controller file)

router.get("/claimed/pending-count", async (req, res) => {
  try {
    const count = await Listing.countDocuments({
      isClaimed: true,
      // claimStatus: "pending",
      status: "pending",
    });

    res.json({
      success: true,
      count,
    });
  } catch (err) {
    console.error("Claimed pending count error:", err);
    res.status(500).json({
      success: false,
      message: "Failed to fetch claimed pending count",
    });
  }
});
router.get("/signup/pending-count", async (req, res) => {
  try {
    const count = await Listing.countDocuments({
      isClaimed: false,
      created_by_type : "user",
      // claimStatus: "pending",
      status: "pending",
    });

    res.json({
      success: true,
      count,
    });
  } catch (err) {
    console.error("Signup pending count error:", err);
    res.status(500).json({
      success: false,
      message: "Failed to fetch signup pending count",
    });
  }
});




router.post("/simple", verifyToken, async (req, res) => {
  try {
    const newListing = new Listing({
      ...req.body,
      photos: [],
      country: req.body.country && req.body.country.trim() !== "" ? req.body.country : "India",
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
// GET Featured Pet Services [not randomly]
// router.get("/featured-services", async (req, res) => {
//   try {
//     const listings = await Listing.find({ status: "approved" })
//       .populate("city", "city")
//       .populate("categories", "categoryName")
//       .populate("petCategories", "categoryName")
//       .limit(3) // only 3 featured
//       .lean();

//     // Get rating for each listing
//     const listingIds = listings.map(l => l._id);

//     const reviews = await Review.aggregate([
//       { $match: { listingId: { $in: listingIds }, status: "approved" } },
//       {
//         $group: {
//           _id: "$listingId",
//           averageRating: { $avg: "$rating" },
//         }
//       }
//     ]);

//     // Map ratings
//     const ratingMap = {};
//     reviews.forEach(r => {
//       ratingMap[r._id.toString()] = Number(r.averageRating.toFixed(1));
//     });

//     // Combine listing + rating
//     const result = listings.map(listing => ({
//       id: listing._id,
//       title: listing.shopName,
//       phone: listing.phone,
//       email: listing.email,
//       category: listing.categories.map(p => p.categoryName),
//       description: listing.description,
//       location: listing.city?.city || "Unknown",
//       rating: ratingMap[listing._id.toString()] || 0,
//       tags: listing.petCategories.map(p => p.categoryName),
//       image: listing.photos?.[0] || null
//     }));

//     res.json({ success: true, services: result });

//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ success: false, message: "Server Error" });
//   }
// });




// shuffle randomly
router.get("/featured-services", async (req, res) => {
  try {
    // RANDOM 3 listings
    const listings = await Listing.aggregate([
      { $match: { status: "approved" } },
      { $sample: { size: 3 } }, // RANDOM 3
      {
        $lookup: {
          from: "cities",
          localField: "city",
          foreignField: "_id",
          as: "city"
        }
      },
      { $unwind: { path: "$city", preserveNullAndEmptyArrays: true } },
      {
        $lookup: {
          from: "categories",
          localField: "categories",
          foreignField: "_id",
          as: "categories"
        }
      },
      {
        $lookup: {
          from: "petcategories",
          localField: "petCategories",
          foreignField: "_id",
          as: "petCategories"
        }
      }
    ]);

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

    // rating map
    const ratingMap = {};
    reviews.forEach(r => {
      ratingMap[r._id.toString()] = Number(r.averageRating.toFixed(1));
    });

    // final output
    const result = listings.map(listing => ({
      id: listing._id,
      title: listing.shopName,
      phone: listing.phone,
      email: listing.email,
      category: listing.categories?.map(c => c.categoryName) || [],
      description: listing.description,
      location: listing.city?.city || "Unknown",
      rating: ratingMap[listing._id.toString()] || 0,
      tags: listing.petCategories?.map(c => c.categoryName) || [],
      image: listing.photos?.[0] || null,
      bannerImage: listing.bannerImage || null,
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
      petCategories: petCategory._id, status: "approved"
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
      status,
      country: "India",
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
      path: path.join(uploadDir + "/", file.filename),
    }));

    res.json({ success: true, files: uploadedFiles, message: "Images uploaded successfully" });
  } catch (err) {
    console.error("Upload error:", err);
    res.status(500).json({ success: false, message: "Server error", error: err.message });
  }
});

// READ (all)
// router.get("/", async (req, res) => {
//   try {
//     const listings = await Listing.find()
//     .populate("categories", "categoryName")
//       .populate("petCategories", "categoryName")
//       .populate("city", "city").sort({ created_at: -1 }); // <-- add lean()
//     res.json({ success: true, listings });
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ success: false, message: "Server error" });
//   }
// });


// READ (all) - randomly
router.get("/", async (req, res) => {
  try {
    const listings = await Listing.aggregate([
      { $match: {} }, // match everything

      // RANDOM SHUFFLE
      { $sample: { size: 50 } }, // pick 50 random; increase if needed

      // populate city
      {
        $lookup: {
          from: "cities",
          localField: "city",
          foreignField: "_id",
          as: "city"
        }
      },
      { $unwind: { path: "$city", preserveNullAndEmptyArrays: true } },

      // populate categories
      {
        $lookup: {
          from: "categories",
          localField: "categories",
          foreignField: "_id",
          as: "categories"
        }
      },

      // populate petCategories
      {
        $lookup: {
          from: "petcategories",
          localField: "petCategories",
          foreignField: "_id",
          as: "petCategories"
        }
      },
      {
        $lookup: {
          from: "specializedservices",
          localField: "specializedServices",
          foreignField: "_id",
          as: "specializedServices"
        }
      }
    ]);

    res.json({ success: true, listings });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

router.get("/approved", async (req, res) => {
  try {
    const listings = await Listing.aggregate([
      { $match: {status : "approved"} }, // match everything

      // RANDOM SHUFFLE
      { $sample: { size: 50 } }, // pick 50 random; increase if needed

      // populate city
      {
        $lookup: {
          from: "cities",
          localField: "city",
          foreignField: "_id",
          as: "city"
        }
      },
      { $unwind: { path: "$city", preserveNullAndEmptyArrays: true } },

      // populate categories
      {
        $lookup: {
          from: "categories",
          localField: "categories",
          foreignField: "_id",
          as: "categories"
        }
      },

      // populate petCategories
      {
        $lookup: {
          from: "petcategories",
          localField: "petCategories",
          foreignField: "_id",
          as: "petCategories"
        }
      }
    ]);

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

    // rating map
    const ratingMap = {};
    reviews.forEach(r => {
      ratingMap[r._id.toString()] = Number(r.averageRating.toFixed(1));
    });
    const listingsWithRating = listings.map(listing => ({
  ...listing.toObject?.() ?? listing,   // important if using Mongoose
  rating: ratingMap[listing._id.toString()] || 0
}));

    res.json({ success: true, listings : listingsWithRating });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Server error" });
  }
});
router.get("/directory/approved", async (req, res) => {
  try {
    const { pet, category } = req.query; 
    // pet = petCategoryId
    // category = categoryId (optional)

    const matchStage = {
      status: "approved",
      $or: [
        { isClaimed: false },
        { isClaimed: true, claimStatus: "approved" }
      ]
    };

    // ✅ Filter by petCategory if provided
    if (pet) {
      matchStage.petCategories = { $in: [new mongoose.Types.ObjectId(pet)] };
    }

    // ✅ Filter by category if provided
    if (category) {
      matchStage.categories = { $in: [new mongoose.Types.ObjectId(category)] };
    }

    const listings = await Listing.aggregate([
      { $match: matchStage },

      // 🔗 USER
      {
        $lookup: {
          from: "users",
          localField: "user_id",
          foreignField: "_id",
          as: "user"
        }
      },
      { $unwind: { path: "$user", preserveNullAndEmptyArrays: true } },

      // 🔗 REVIEWS
      {
        $lookup: {
          from: "reviews",
          let: { listingId: "$_id" },
          pipeline: [
            {
              $match: {
                $expr: {
                  $and: [
                    { $eq: ["$listingId", "$$listingId"] },
                    { $eq: ["$status", "approved"] }
                  ]
                }
              }
            }
          ],
          as: "reviews"
        }
      },

      // ⭐ Rating
      {
        $addFields: {
          rating: {
            $round: [{ $ifNull: [{ $avg: "$reviews.rating" }, 0] }, 1]
          }
        }
      },

      // 💰 Premium logic
      {
        $addFields: {
          isPaid: {
            $cond: [
              {
                $and: [
                  { $eq: ["$user.isPremium", true] },
                  { $gte: ["$user.premiumEndDate", new Date()] }
                ]
              },
              1,
              0
            ]
          },
          randomSort: { $rand: {} }
        }
      },

      // 🔗 CATEGORY
      {
        $lookup: {
          from: "categories",
          localField: "categories",
          foreignField: "_id",
          as: "categories"
        }
      },

      // 🔗 PET CATEGORY
      {
        $lookup: {
          from: "petcategories",
          localField: "petCategories",
          foreignField: "_id",
          as: "petCategories"
        }
      },

      // 🔗 CITY
      {
        $lookup: {
          from: "cities",
          localField: "city",
          foreignField: "_id",
          as: "city"
        }
      },
      { $unwind: { path: "$city", preserveNullAndEmptyArrays: true } },

      // 🔗 SPECIALIZED SERVICES
      {
        $lookup: {
          from: "specializedservices",
          localField: "specializedServices",
          foreignField: "_id",
          as: "specializedServices"
        }
      },

      // 📊 Sorting
      {
        $sort: {
          isPaid: -1,
          rating: -1,
          randomSort: 1
        }
      }
    ]);

    // ============================================
    // ✅ DERIVE FILTER DATA BASED ON LISTINGS
    // ============================================

    const categoriesMap = new Map();
    const citiesMap = new Map();
    const servicesMap = new Map();

    listings.forEach(l => {
      // Categories
      (l.categories || []).forEach(c => {
        if (c.show) categoriesMap.set(c._id.toString(), c);
      });

      // Cities
      if (l.city && l.city.show) {
        citiesMap.set(l.city._id.toString(), l.city);
      }

      // Services
      (l.specializedServices || []).forEach(s => {
        if (s.show) servicesMap.set(s._id.toString(), s);
      });
    });

    res.json({
      success: true,
      listings,

      // ✅ send filtered options
      filters: {
        categories: Array.from(categoriesMap.values()),
        cities: Array.from(citiesMap.values()),
        specializedServices: Array.from(servicesMap.values())
      }
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({
      success: false,
      message: "Server error"
    });
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
    const listing = await Listing.findOne({
  $or: [
    { user_id: req.params.id },
    { claimedBy: req.params.id }
  ]
})
    .populate("categories", "categoryName")
      .populate("petCategories", "categoryName")
      .populate("city", "city").sort({ created_at: -1 }); 
      console.log(req.params.id);
      if (!listing) {
      return res.status(404).json({
        success: false,
        message: "Listing not found"
      });
    }
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
      .populate("city", "city")
      .populate("user_id", "name");
    if (!listing) return res.status(404).json({ success: false, message: "Not found" });
    const response = {
      ...listing.toObject(),
      user_id: listing.created_by_type === "user" ? listing.user_id : null
    };
    res.json({ success: true, listing: response });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Server error" });
  }
});
router.get("/incviews/:id", async (req, res) => {
  try {
    const ip =
      req.headers["x-forwarded-for"]?.split(",")[0].trim() ||
      req.socket.remoteAddress;

    let listing = await Listing.findById(req.params.id)
      .populate("categories", "categoryName")
      .populate("petCategories", "categoryName")
      .populate("city", "city");

    if (!listing) {
      return res.status(404).json({
        success: false,
        message: "Not found"
      });
    }

    // If IP not found → increment view
    if (!listing.viewedIPs.includes(ip)) {
      listing.views += 1;
      listing.viewedIPs.push(ip);
      await listing.save();
    }

    res.json({ success: true, listing });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      success: false,
      message: "Server error"
    });
  }
});
router.get("/incviewsslug/:slugId", async (req, res) => {
  try {
    const { slugId } = req.params;

    const id = slugId.split("-").pop();

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid listing ID",
      });
    }

    const ip =
      req.headers["x-forwarded-for"]?.split(",")[0]?.trim() ||
      req.socket.remoteAddress;

    const listing = await Listing.findOne({
      _id: id,
      status: "approved", // remove if needed for testing
    })
      .populate("categories", "categoryName")
      .populate("petCategories", "categoryName")
      .populate("city", "city");

    if (!listing) {
      return res.status(404).json({
        success: false,
        message: "Listing not found or not approved",
      });
    }

    if (!listing.viewedIPs.includes(ip)) {
      listing.views += 1;
      listing.viewedIPs.push(ip);
      await listing.save();
    }

    res.json({ success: true, listing });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: err.message });
  }
});






// UPDATE
// router.put(
//   "/:id",
//   verifyToken,
//   upload.fields([
//     { name: "bannerImage", maxCount: 1 },
//     { name: "photos", maxCount: 10 }
//   ]),
//   async (req, res) => {
//   try {
//     const data = req.body;
//     console.log("Update data received:", data);

//     // Parse categories
//     if (data["categories[]"]) {
//       data.categories = Array.isArray(data["categories[]"])
//         ? data["categories[]"]
//         : [data["categories[]"]];
//     }

//     // Parse existing photos
//     let existingPhotos = [];
//     if (data["existingPhotos[]"]) {
//       existingPhotos = Array.isArray(data["existingPhotos[]"])
//         ? data["existingPhotos[]"]
//         : [data["existingPhotos[]"]];
//     }

//     // Uploaded photos
//     const uploadedPhotos = req.files.map(f => `/uploads/listings/${f.filename}`);

//     // If nothing sent, preserve old photos
//     if (!uploadedPhotos.length && !existingPhotos.length) {
//       const currentListing = await Listing.findById(req.params.id);
//       existingPhotos = currentListing?.photos || [];
//     }

//     // Merge photos
//     data.photos = [...existingPhotos, ...uploadedPhotos];

//     if (data.status) data.status = data.status.toString();

//     const listing = await Listing.findByIdAndUpdate(req.params.id, data, { new: true });
//     res.json({ success: true, listing });
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ success: false, message: "Update failed" });
//   }
// });
router.put(
  "/:id",
  verifyToken,
  upload.fields([
    { name: "bannerImage", maxCount: 1 },
    { name: "photos", maxCount: 10 }
  ]),
  async (req, res) => {
    try {
      const data = req.body;
      console.log("Update data received:", data);

      /* -------------------- Verified toggle -------------------- */
      if (typeof data.isVerified !== "undefined") {
        data.isVerified = data.isVerified === "true" || data.isVerified === true;

        if (data.isVerified) {
          data.verifiedAt = new Date();
          data.verifiedBy = req.userType === "admin" ? req.userId : null;
        } else {
          data.verifiedAt = null;
          data.verifiedBy = null;
        }
      }
      /* -------------------- claim verified toggle -------------------- */
      // if (data.claimStatus) data.claimStatus = data.claimStatus.toString();
      if (data.claimStatus === "approved" && req.userType !== "admin") {
  return res.status(403).json({ message: "Not authorized" });
}
      if (data.claimStatus && ["approved", "pending"].includes(data.claimStatus)) {
  data.claimStatus = data.claimStatus;
}
if (data.claimStatus === "approved") {
  const listing = await Listing.findById(req.params.id);

  if (listing && listing.claimedBy) {
    await User.findByIdAndUpdate(listing.claimedBy, {
      isVerified: true
    });

    listing.isVerified = true;
    listing.verifiedAt = new Date();

    await listing.save();
  }
  
}
if (data.isVerified === true) {
    const listing = await Listing.findById(req.params.id);

    if (listing && listing.user_id) {
      await User.findByIdAndUpdate(listing.user_id, {
        isVerified: true
      });
    }
  }

      /* -------------------- Parse categories -------------------- */
      if (data["categories[]"]) {
        data.categories = Array.isArray(data["categories[]"])
          ? data["categories[]"]
          : [data["categories[]"]];
      }

      /* -------------------- Parse existing photos -------------------- */
      let existingPhotos = [];
      if (data["existingPhotos[]"]) {
        existingPhotos = Array.isArray(data["existingPhotos[]"])
          ? data["existingPhotos[]"]
          : [data["existingPhotos[]"]];
      }

      /* -------------------- Uploaded photos -------------------- */
      let uploadedPhotos = [];
      if (req.files?.photos) {
        uploadedPhotos = req.files.photos.map(
          f => `${uploadDir}/${f.filename}`
        );
      }

      /* -------------------- Preserve old photos if nothing sent -------------------- */
      if (!uploadedPhotos.length && !existingPhotos.length) {
        const currentListing = await Listing.findById(req.params.id);
        existingPhotos = currentListing?.photos || [];
      }

      /* -------------------- Merge photos -------------------- */
      data.photos = [...existingPhotos, ...uploadedPhotos];

      /* -------------------- Banner Image (IMPORTANT FIX) -------------------- */
      if (req.files?.bannerImage?.[0]) {
        // New banner uploaded → replace
        data.bannerImage = `${uploadDir}/${req.files.bannerImage[0].filename}`;
      } else {
        // No new banner → keep existing
        const currentListing = await Listing.findById(req.params.id);
        data.bannerImage = currentListing?.bannerImage || null;
      }

      /* -------------------- Status safety -------------------- */
      if (data.status) data.status = data.status.toString();

      /* -------------------- Parse business hours -------------------- */
if (data.businessHours) {
  try {
    data.businessHours = JSON.parse(data.businessHours);
  } catch (err) {
    console.error("Invalid businessHours JSON");
    data.businessHours = [];
  }
}

      /* -------------------- Update listing -------------------- */
      const listing = await Listing.findByIdAndUpdate(
        req.params.id,
        data,
        { new: true }
      );

      res.json({ success: true, listing });

    } catch (err) {
      console.error("Update error:", err);
      res.status(500).json({ success: false, message: "Update failed" });
    }
  }
);

// router.put("/user/:id", verifyToken, upload.array("photos", 10), async (req, res) => {
//   try {
//     const userId = req.params.id;
//     const data = req.body;
//     const status = req.userType === "admin" ? "approved" : "pending";

//     console.log("Update or create listing for user:", userId, data);

//     // Parse categories properly
//     if (data["categories[]"]) {
//       data.categories = Array.isArray(data["categories[]"])
//         ? data["categories[]"]
//         : [data["categories[]"]];
//     }

//     if (data["petCategories[]"]) {
//       data.petCategories = Array.isArray(data["petCategories[]"])
//         ? data["petCategories[]"]
//         : [data["petCategories[]"]];
//     }

//     // Existing photos
//     let existingPhotos = [];
//     if (data["existingPhotos[]"]) {
//       existingPhotos = Array.isArray(data["existingPhotos[]"])
//         ? data["existingPhotos[]"]
//         : [data["existingPhotos[]"]];
//     }

//     // Uploaded photos
//     const uploadedPhotos = req.files.map(f => `/uploads/listings/${f.filename}`);

//     // If nothing sent, preserve old photos (if listing exists)
//     const currentListing = await Listing.findOne({ user_id: userId });
//     if (!uploadedPhotos.length && !existingPhotos.length && currentListing) {
//       existingPhotos = currentListing.photos || [];
//     }

//     // Merge photos
//     data.photos = [...existingPhotos, ...uploadedPhotos];

//     // --- Find and Update ---
//     let listing = await Listing.findOneAndUpdate(
//       { user_id: userId },
//       {
//         ...data,
//         status,
//         user_id: userId,
//         created_by_id: req.userId,
//         created_by_type: req.userType,
//       },
//       { new: true }
//     );

// await listing.save();
//     // --- If found and updated ---
//     return res.json({ success: true, message: "Listing updated successfully", listing });
//   } catch (err) {
//     console.error("Error in listing update/create:", err);
//     res.status(500).json({ success: false, message: "Server error", error: err.message });
//   }
// });
router.put(
  "/user/:id",
  verifyToken,
  upload.fields([
    { name: "photos", maxCount: 10 },
    { name: "bannerImage", maxCount: 1 }
  ]),
  async (req, res) => {
    try {
      const userId = req.params.id;
      const data = req.body;
      const status = req.userType === "admin" ? "approved" : "pending";

      console.log("Update or create listing for user:", userId, data);

      // --- Parse categories ---
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

      // --- Existing photos ---
      let existingPhotos = [];
      if (data["existingPhotos[]"]) {
        existingPhotos = Array.isArray(data["existingPhotos[]"])
          ? data["existingPhotos[]"]
          : [data["existingPhotos[]"]];
      }

      // --- Uploaded photos ---
      let uploadedPhotos = [];
      if (req.files && req.files.photos) {
        uploadedPhotos = req.files.photos.map(f => `${uploadDir}/${f.filename}`);
      }

      // --- Preserve old photos if nothing sent ---
      const currentListing = await Listing.findOne({ user_id: userId });
      if (!uploadedPhotos.length && !existingPhotos.length && currentListing) {
        existingPhotos = currentListing.photos || [];
      }

      // --- Merge photos ---
      data.photos = [...existingPhotos, ...uploadedPhotos];

      // --- Handle banner image ---
      if (req.files && req.files.bannerImage && req.files.bannerImage[0]) {
        data.bannerImage = `${uploadDir}/${req.files.bannerImage[0].filename}`;
      } else if (currentListing && !data.bannerImage) {
        // preserve old banner if exists
        data.bannerImage = currentListing.bannerImage || null;
      }
       /* -------------------- Parse business hours -------------------- */
      if (data.businessHours) {
        try {
          data.businessHours = JSON.parse(data.businessHours);
        } catch (err) {
          console.error("Invalid businessHours JSON");
          data.businessHours = [];
        }
      }

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
        { new: true, upsert: true } // upsert in case listing doesn't exist
      );

      return res.json({
        success: true,
        message: "Listing updated successfully",
        listing
      });
    } catch (err) {
      console.error("Error in listing update/create:", err);
      res.status(500).json({
        success: false,
        message: "Server error",
        error: err.message
      });
    }
  }
);


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
router.get("/new/shop-owners", async (req, res) => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const count = await Listing.countDocuments({
      created_by_type: "user",
      created_at: { $gte: today }
    });

    res.json({
      success: true,
      count
    });
  } catch (err) {
    console.error("New shop owner count error:", err);
    res.status(500).json({ success: false, message: err.message });
  }
});


module.exports = router;
