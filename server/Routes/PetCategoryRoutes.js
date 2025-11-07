const express = require('express');
const router = express.Router();
const PetCategory = require('../Models/PetCategory');


router.post('/add', async (req, res) => {
  try {
    const { categoryName, description, metaTitle, metaKeyword, metaDescription } = req.body;

    const existing = await PetCategory.findOne({ categoryName });
    if (existing) {
      return res.status(400).json({ success: false, message: 'Category already exists' });
    }

    const newCategory = new PetCategory({
      categoryName,
      description,
      metaTitle,
      metaKeyword,
      metaDescription,
    });

    await newCategory.save();
    res.json({ success: true, message: 'Category added successfully', category: newCategory });
  } catch (error) {
    console.error('Add Category Error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});
router.get('/', async (req, res) => {
  try {
    const petCategories = await PetCategory.find().sort({ created_at: -1 });
    res.json({ success: true, petCategories });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
});
router.get('/show', async (req, res) => {
  try {
    const petCategories = await PetCategory.find({ show : true }).sort({ created_at: -1 });
    res.json({ success: true, petCategories });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
});
router.put('/:id', async (req, res) => {
  try {
    const { categoryName, description, metaTitle, metaKeyword, metaDescription } = req.body;
    const category = await PetCategory.findByIdAndUpdate(
      req.params.id,
      { categoryName, description, metaTitle, metaKeyword, metaDescription },
      { new: true, runValidators: true } // returns the updated doc
    );

    if (!category) {
      return res.status(404).json({ success: false, message: 'Category not found' });
    }

    res.json({ success: true, message: 'Category updated successfully', category });
  } catch (err) {
    console.error('Update Category Error:', err);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});
router.delete('/:id', async (req, res) => {
  try {
    const category = await PetCategory.findByIdAndDelete(req.params.id);

    if (!category) {
      return res.status(404).json({ success: false, message: 'Category not found' });
    }

    res.json({ success: true, message: 'Category deleted successfully' });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
});
router.patch("/:id/toggle", async (req,res) => {
  try {
    const petCategories = await PetCategory.findById(req.params.id);
    if(!petCategories) {
      return res.status(404).json({ success: false, message: "Pet Type not found" });
      
    }
    petCategories.show = !petCategories.show;
    await petCategories.save();
    res.json({ success: true, message: "Pet Type visibility updated", show: petCategories.show });
  } catch (err) {
    console.error("Error:", err);
    res.status(500).json({ success : false, message: "Server error"});
  }
})


module.exports = router;
