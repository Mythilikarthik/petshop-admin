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
      // "directory-banner" + path.extname(file.originalname)
      Date.now() +
        "-" +
        Math.round(Math.random() * 1e9) +
        path.extname(file.originalname)
    );
  },
});

const uploadBanner = multer({
  storage,
  limits: { fileSize: 2 * 1024 * 1024 }, // 2MB
});


// CREATE / UPDATE
// router.post(
//   "/",
//   uploadBanner.array("banners", 20),
//   async (req, res) => {
//     try {
//       if (!req.file) {
//         return res.status(400).json({ message: "Banner image required" });
//       }

//       const bannerPath = `${uploadDir}/${req.file.filename}`;

//       // Check if banner already exists
//       let banner = await BlogBanner.findOne();

//       if (banner) {
//         // UPDATE
//         banner.banner = bannerPath;
//         await banner.save();

//         return res.json({
//           success: true,
//           message: "Banner updated successfully",
//           banner,
//         });
//       } else {
//         // CREATE
//         banner = new BlogBanner({ banner: bannerPath });
//         await banner.save();

//         return res.json({
//           success: true,
//           message: "Banner added successfully",
//           banner,
//         });
//       }
//     } catch (err) {
//       console.error(err);
//       res.status(500).json({ message: "Server error" });
//     }
//   }
// );
router.post("/", uploadBanner.array("banners", 20), async (req, res) => {
    try {

        if (!req.files?.length) {
            return res.status(400).json({
                success:false,
                message:"No images uploaded"
            });
        }

        let banner = await BlogBanner.findOne();

        const uploadedImages = req.files.map((file, index) => ({
            image:`${uploadDir}/${file.filename}`,
            alt:req.body.alts?.[index] || ""
        }));

        if (banner) {

            banner.banners.push(...uploadedImages);

            await banner.save();

        } else {

            banner = await BlogBanner.create({
                banners:uploadedImages
            });

        }

        res.json({
            success:true,
            banner
        });

    } catch(err){

        console.log(err);

        res.status(500).json({
            success:false,
            message:err.message
        });

    }
});

// GET banner (for edit preview)
router.get("/", async (req, res) => {
  const banner = await BlogBanner.findOne();
  res.json({ success: true, banner });
});

// router.delete("/delete", async (req, res) => {
//   try {
//     const banner = await BlogBanner.findOne();
//     if (!banner) {
//       return res.status(404).json({ message: "No banner found" });
//     }

//     // delete file from server
//     const filePath = path.join(
//       __dirname,
//       "..",
//       banner.banner
//     );

//     if (fs.existsSync(filePath)) {
//       fs.unlinkSync(filePath);
//     }

//     // delete DB record
//     await BlogBanner.deleteMany();

//     res.json({
//       success: true,
//       message: "Banner deleted successfully",
//     });
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ message: "Server error" });
//   }
// });
router.delete("/delete", async(req,res)=>{

    const banner=await BlogBanner.findOne();

    if(!banner)
        return res.status(404).json({message:"Not found"});

    banner.banners.forEach(img=>{

        const filePath=path.join(__dirname,"..",img.image);

        if(fs.existsSync(filePath))
            fs.unlinkSync(filePath);

    });

    await BlogBanner.deleteMany();

    res.json({
        success:true
    });

});
router.delete("/image/:id", async (req, res) => {

    try {

        const banner = await BlogBanner.findOne();

        if (!banner)
            return res.status(404).json({
                message: "Banner not found"
            });

        const image = banner.banners.id(req.params.id);

        if (!image)
            return res.status(404).json({
                message: "Image not found"
            });

        const filePath = path.join(__dirname, "..", image.image);

        if (fs.existsSync(filePath))
            fs.unlinkSync(filePath);

        image.deleteOne();

        await banner.save();

        res.json({
            success: true,
            message: "Image deleted"
        });

    } catch (err) {

        res.status(500).json({
            message: err.message
        });

    }

});

module.exports = router;
