const express = require('express');
const router = express.Router();
const Blog = require('../Models/Blog'); 
const multer = require('multer');
const path = require('path'); 
const fs = require('fs');
const sharp = require("sharp");
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
      if (metadata.width !== 1200 || metadata.height !== 400) {
        return res.status(400).json({ success: false, message: "Banner image must be 1200x400 pixels" });
      }
    }
    if (req.files.contentImage) {
      const metadata = await sharp(req.files.contentImage[0].path).metadata();
      if (metadata.width !== 500 || metadata.height !== 500) {
        return res.status(400).json({ success: false, message: "Content image must be 500x500 pixels" });
      }
    }
    const { title, author, category, date, status, excerpt, content } = req.body;

    // Duplicate title check (case-insensitive)
    const existing = await Blog.findOne({
      title: { $regex: `^${title}$`, $options: 'i' }
    });
    if (existing) {
      return res.status(400).json({ success: false, message: 'Blog title already exists' });
    }

    const bannerImage = req.files?.bannerImage?.[0]?.path || '';
    const contentImage = req.files?.contentImage?.[0]?.path || '';

    const newBlog = new Blog({
      title, author, category, date, status, excerpt, content,
      bannerImage, contentImage
    });

    await newBlog.save();
    res.status(201).json({ success: true, blog: newBlog });
  } catch (error) {
    console.error('Error creating blog:', error);
    res.status(500).json({ success: false, message: 'Server error' });
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
// Get a single blog post by ID
router.get('/:id', async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id);
    if (!blog) {
      return res.status(404).json({ success: false, message: 'Blog not found' });
    }
    res.json({ success: true, blog });
  } catch (error) {
    console.error('Error fetching blog:', error);
    res.status(500).json({ success: false, message: 'Server error' });
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
      if (metadata.width !== 1200 || metadata.height !== 400) {
        return res.status(400).json({ success: false, message: "Banner image must be 1200x400 pixels" });
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

    const updateData = { ...req.body };
    if (req.files?.bannerImage) updateData.bannerImage = req.files.bannerImage[0].path;
    if (req.files?.contentImage) updateData.contentImage = req.files.contentImage[0].path;

    const updatedBlog = await Blog.findByIdAndUpdate(req.params.id, updateData, { new: true });
    if (!updatedBlog) return res.status(404).json({ success: false, message: 'Blog not found' });

    res.json({ success: true, blog: updatedBlog });
  } catch (error) {
    console.error('Error updating blog:', error);
    res.status(500).json({ success: false, message: 'Server error' });
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