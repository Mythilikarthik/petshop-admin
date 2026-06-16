const express = require('express');
const router = express.Router();
const Blog = require('../Models/Blog'); 
const multer = require('multer');
const path = require('path'); 
const fs = require('fs');
const sharp = require("sharp");
const Category = require('../Models/Category');
const PetCategory = require('../Models/PetCategory');
// Create a new blog post

const uploadDir = "uploads/blogs/";
if(!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, {recursive:true});
}

const storage = multer.diskStorage({
  destination: function(req, file, cb) {
    cb(null, uploadDir);
  },
  filename: function(req,file,cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + path.extname(file.originalname) );
  }
})
const upload = multer({ storage });
router.post('/', upload.fields([
  { name: 'bannerImage', maxCount: 1 },
  { name: 'contentImage', maxCount: 1 }
]), async (req, res) => {
  try {
    if (req.files.bannerImage) {
      const metadata = await sharp(req.files.bannerImage[0].path).metadata();
      if (metadata.width !== 1200 || metadata.height !== 300) {
        return res.status(400).json({ success: false, message: "Banner image must be 1200x300 pixels" });
      }
    }
    if (req.files.contentImage) {
      const metadata = await sharp(req.files.contentImage[0].path).metadata();
      if (metadata.width !== 500 || metadata.height !== 500) {
        return res.status(400).json({ success: false, message: "Content image must be 500x500 pixels" });
      }
    }
    const { title, author, category, date, status, excerpt, content, metaTitle, metaDescription, metaKeyword } = req.body;

    // Duplicate title check (case-insensitive)
    const existing = await Blog.findOne({
      title: { $regex: `^${title}$`, $options: 'i' }
    });
    if (existing) {
      return res.status(400).json({ success: false, message: 'Blog title already exists' });
    }

    const bannerImage = req.files?.bannerImage?.[0]?.path || '';
    const contentImage = req.files?.contentImage?.[0]?.path || '';
if (!date) {
  date = undefined; // or null
}
let keywords = metaKeyword;
if (typeof keywords === "string") {
  keywords = keywords.split(",").map(k => k.trim());
}
    const newBlog = new Blog({
      title, author, category, date, status, excerpt, content,
      bannerImage, contentImage,metaTitle,
  metaDescription,
  metaKeyword: keywords,
    });

    await newBlog.save();
    res.status(201).json({ success: true, blog: newBlog });
  } catch (error) {
    console.error('Error creating blog:', error);
    res.status(500).json({ success: false, message: error.message || 'Server error' });
  }
});
router.post("/by-pet-category", async (req, res) => {
  try {
    const { categoryName } = req.body;

    if (!categoryName) {
      return res.status(400).json({ success: false, msg: "Provide categoryName" });
    }

    // 1. Find the PetCategory
    const petCategory = await PetCategory.findOne({
      categoryName: { $regex: new RegExp(`^${categoryName}$`, "i") }
    });

    if (!petCategory) {
      return res.json({ success: true, blogs: [] });
    }

    // 2. Find categories that contain this pet category
    const categories = await Category.find({
      petCategories: petCategory._id
    });

    if (categories.length === 0) {
      return res.json({ success: true, blogs: [] });
    }

    // 3. Extract category IDs
    const categoryIds = categories.map(c => c._id);

    // 4. Fetch blogs under those categories
    const blogs = await Blog.find({
      category: { $in: categoryIds }
    }).populate("category", "categoryName");

    res.json({ success: true, blogs });

  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});


// Get all blog posts
router.get('/', async (req, res) => {
  try { 
    const blogs = await Blog.find().populate('category', 'categoryName').sort({ date: -1 });
    res.json({ success: true, blogs });
  } catch (error) {
    console.error('Error fetching blogs:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});
router.get('/website', async (req, res) => {
  try { 
    const blogs = await Blog.find({status : "published"}).populate('category', 'categoryName').sort({ date: -1 });
    res.json({ success: true, blogs });
  } catch (error) {
    console.error('Error fetching blogs:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});
// Get a single blog post by ID
router.get('/:id', async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id).populate('category', 'categoryName');
    if (!blog) {
      return res.status(404).json({ success: false, message: 'Blog not found' });
    }
    res.json({ success: true, blog });
  } catch (error) {
    console.error('Error fetching blog:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});
router.get('/slug/:slug', async (req, res) => {
  try {

    const blog = await Blog.findOne({
      slug: req.params.slug
    }).populate('category', 'categoryName');

    if (!blog) {
      return res.status(404).json({
        success: false,
        message: 'Blog not found'
      });
    }

    res.json({
      success: true,
      blog
    });

  } catch (error) {

    console.error(error);

    res.status(500).json({
      success: false,
      message: error.message || 'Server error'
    });
  }
});
// Update a blog post by ID
router.put('/:id', upload.fields([
  { name: 'bannerImage', maxCount: 1 },
  { name: 'contentImage', maxCount: 1 }
]), async (req, res) => {
  try {
    if (req.files.bannerImage) {
      const metadata = await sharp(req.files.bannerImage[0].path).metadata();
      if (metadata.width !== 1200 || metadata.height !== 300) {
        return res.status(400).json({ success: false, message: "Banner image must be 1200x300 pixels" });
      }
    }
    if (req.files.contentImage) {
      const metadata = await sharp(req.files.contentImage[0].path).metadata();
      if (metadata.width !== 500 || metadata.height !== 500) {
        return res.status(400).json({ success: false, message: "Content image must be 500x500 pixels" });
      }
    }
    const { title } = req.body;

    // Duplicate check ignoring current blog
    const existing = await Blog.findOne({
      _id: { $ne: req.params.id },
      title: { $regex: `^${title}$`, $options: 'i' }
    });
    if (existing) {
      return res.status(400).json({ success: false, message: 'Blog title already exists' });
    }
let { metaKeyword } = req.body;

if (typeof metaKeyword === "string") {
  metaKeyword = metaKeyword.split(",").map(k => k.trim());
  req.body.metaKeyword = metaKeyword;
}

// fallback
if (!req.body.metaTitle && req.body.title) {
  req.body.metaTitle = req.body.title;
}
    const updateData = { ...req.body };
    if (!updateData.date) {
  delete updateData.date; // keeps existing OR uses default
}
    if (req.files?.bannerImage) updateData.bannerImage = req.files.bannerImage[0].path;
    if (req.files?.contentImage) updateData.contentImage = req.files.contentImage[0].path;

    // const updatedBlog = await Blog.findByIdAndUpdate(req.params.id, updateData, { new: true });
    // if (!updatedBlog) return res.status(404).json({ success: false, message: 'Blog not found' });

    // res.json({ success: true, blog: updatedBlog });
    const blog = await Blog.findById(req.params.id);

if (!blog) {
  return res.status(404).json({
    success: false,
    message: 'Blog not found'
  });
}

// update fields
Object.assign(blog, updateData);

// generate slug only if empty
if (!blog.slug && blog.title) {

  let baseSlug = require("slugify")(blog.title, {
    lower: true,
    strict: true
  });

  let slug = baseSlug;

  let counter = 1;

  while (
    await Blog.findOne({
      slug,
      _id: { $ne: blog._id }
    })
  ) {

    slug = `${baseSlug}-${counter}`;
    counter++;
  }

  blog.slug = slug;
}

// save
await blog.save();

res.json({
  success: true,
  blog
});
  } catch (error) {
    console.error('Error updating blog:', error);
    res.status(500).json({ success: false, message: error.message });
  }
});

// Delete a blog post by ID
router.delete('/:id', async (req, res) => {
  try {
    const deletedBlog = await Blog.findByIdAndDelete(req.params.id);
    if (!deletedBlog) {
      return res.status(404).json({ success: false, message: 'Blog not found' });
    }
    res.json({ success: true, message: 'Blog deleted successfully' });
  } catch (error) {
    console.error('Error deleting blog:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});
module.exports = router;