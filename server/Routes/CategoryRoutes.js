const express = require('express');
const router = express.Router();
const Category = require('../Models/Category');
const Blog = require('../Models/Blog');
const mongoose = require("mongoose");

const PetCategory = require('../Models/PetCategory');

router.get('/blog/show', async (req, res) => {
  try {
    const categoriesWithCounts = await Category.aggregate([
      // 1. Only get active categories meant to be visible
      {
        $match: { show: true }
      },
      // 2. Correlate and search the blogs collection
      {
        $lookup: {
          from: 'blogs', // Ensure this perfectly matches your MongoDB collection name
          localField: '_id',
          foreignField: 'category',
          as: 'matchedBlogs'
        }
      },
      // 3. Map out a new field calculating the size of only PUBLISHED blogs
      {
        $addFields: {
          blogCount: {
            $size: {
              $filter: {
                input: '$matchedBlogs',
                as: 'b',
                cond: { $eq: ['$$b.status', 'published'] }
              }
            }
          }
        }
      },
      // 4. Drop the heavy array data payload so network responses stay fast
      {
        $project: {
          matchedBlogs: 0
        }
      },
      // 5. Keep your chronological ordering
      {
        $sort: { created_at: -1 }
      }
    ]);

    // 6. Populate petCategories relationship
    const populatedCategories = await Category.populate(categoriesWithCounts, {
      path: 'petCategories',
      select: 'categoryName'
    });

    res.json({ success: true, categories: populatedCategories });
  } catch (error) {
    console.error('Blog category count aggregation error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});
router.post('/add', async (req, res) => {
  try {
    const { categoryName, description, metaTitle, metaKeyword, metaDescription, petCategories } = req.body;

    const existing = await Category.findOne({ 
      categoryName: { $regex: `^${categoryName}$`, $options: 'i' }
     });
    if (existing) {
      return res.status(400).json({ success: false, message: 'Category already exists' });
    }

    const newCategory = new Category({
      categoryName,
      description,

      metaTitle,
      metaKeyword,
      metaDescription,
      petCategories
    });

    await newCategory.save();
    res.json({ success: true, message: 'Category added successfully', category: newCategory });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({ error: "Category name already exists" });
    }
    console.error('Add Category Error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});
// router.post("/byPetCategories", async (req, res) => {
//   try {
//     const { petCategories } = req.body; // array of petCategory IDs
//     if (!Array.isArray(petCategories) || petCategories.length === 0) {
//       return res.json({ success: true, categories: [] });
//     }

//     const categories = await Category.find({ petCategories: { $in: petCategories }, show: true });
//     res.json({ success: true, categories });
//   } catch (err) {
//     console.error("Category fetch error:", err);
//     res.status(500).json({ success: false, message: "Server error" });
//   }
// });
// router.post("/byPetCategories", async (req, res) => {
//   try {
//     let { petCategories } = req.body;

//     if (!Array.isArray(petCategories) || petCategories.length === 0) {
//       return res.json({ success: true, categories: [] });
//     }

//     // ✅ remove "all"
//     petCategories = petCategories.filter(id => id !== "all");

//     // ✅ convert to ObjectId
//     const objectIds = petCategories.map(id => new mongoose.Types.ObjectId(id));

//     const categories = await Category.aggregate([
//       {
//         $match: { show: true }
//       },
//       {
//         $addFields: {
//           isExactMatch: {
//             $setEquals: ["$petCategories", objectIds] // ✅ NOW WORKS
//           }
//         }
//       },
//       {
//         $match: { isExactMatch: true }
//       }
//     ]);

//     res.json({ success: true, categories });

//   } catch (err) {
//     console.error("Category fetch error:", err);
//     res.status(500).json({ success: false, message: "Server error" });
//   }
// });
router.post("/byPetCategories", async (req, res) => {
  try {
    let { petCategories } = req.body;

    if (!Array.isArray(petCategories) || petCategories.length === 0) {
      return res.json({
        success: true,
        categories: []
      });
    }

    // remove frontend "all"
    petCategories = petCategories.filter(
      id => id !== "all"
    );

    // convert to ObjectId
    const objectIds = petCategories.map(
      id => new mongoose.Types.ObjectId(id)
    );

    // total pet types count
    const totalPetTypes = await PetCategory.countDocuments({
      show: true
    });

    let matchCondition = {};
// ✅ SINGLE OR MULTI SELECT
matchCondition = {
  $or: [

    // selected pet types exist inside category
    {
      $expr: {
        $setIsSubset: [
          objectIds,
          "$petCategories"
        ]
      }
    },

    // all pet types category
    {
      $expr: {
        $eq: [
          { $size: "$petCategories" },
          totalPetTypes
        ]
      }
    }

  ]
};
    // ✅ SINGLE SELECT
    // if (objectIds.length === 1) {

    //   matchCondition = {
    //     $or: [

    //       // exact match
    //       {
    //         $expr: {
    //           $setEquals: [
    //             "$petCategories",
    //             objectIds
    //           ]
    //         }
    //       },

    //       // all pet types category
    //       {
    //         $expr: {
    //           $eq: [
    //             { $size: "$petCategories" },
    //             totalPetTypes
    //           ]
    //         }
    //       }
    //     ]
    //   };

    // } else {

    //   // ✅ MULTI SELECT = exact only
    //   matchCondition = {
    //     $expr: {
    //       $setEquals: [
    //         "$petCategories",
    //         objectIds
    //       ]
    //     }
    //   };
    // }

    const categories = await Category.aggregate([
      {
        $match: {
          show: true
        }
      },
      {
        $match: matchCondition
      }
    ]);

    res.json({
      success: true,
      categories
    });

  } catch (err) {

    console.error("Category fetch error:", err);

    res.status(500).json({
      success: false,
      message: "Server error"
    });
  }
});
router.post("/directory/byPetCategories", async (req, res) => {
  try {
    let { petCategories } = req.body;

    if (!Array.isArray(petCategories) || petCategories.length === 0) {
      return res.json({ success: true, categories: [] });
    }

    // remove "all"
    petCategories = petCategories.filter(id => id !== "all");

    const objectIds = petCategories.map(id => new mongoose.Types.ObjectId(id));

    const categories = await Category.find({
      petCategories: { $in: objectIds },
      show: true
    }).populate("petCategories", "categoryName");

    res.json({ success: true, categories });

  } catch (err) {
    console.error("Category fetch error:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

router.get('/', async (req, res) => {
  try {
    const categories = await Category.find().populate('petCategories', 'categoryName').sort({ created_at: -1 });
    res.json({ success: true, categories });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
});
router.get('/show', async (req, res) => {
  try {
    const categories = await Category.find({show : true}).populate('petCategories', 'categoryName').sort({ created_at: -1 });
    res.json({ success: true, categories });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
});
router.put('/:id', async (req, res) => {
  try {
    const { categoryName, description, metaTitle, metaKeyword, metaDescription, petCategories } = req.body;
    
    const existing = await Category.findOne({
      _id: { $ne: req.params.id },
      categoryName: { $regex: `^${categoryName}$`, $options: 'i' }
    });

    if (existing) {
      return res.status(400).json({ success: false, message: 'Category already exists' });
    }

    const category = await Category.findByIdAndUpdate(
      req.params.id,
      { categoryName, description, metaTitle, metaKeyword, metaDescription, petCategories },
      { new: true, runValidators: true } // returns the updated doc
    );

    if (!category) {
      return res.status(404).json({ success: false, message: 'Category not found' });
    }

    res.json({ success: true, message: 'Category updated successfully', category });
  } catch (err) {
    if (err.code === 11000) {
      return res.status(400).json({ error: "Category name already exists" });
    }
    console.error('Update Category Error:', err);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});
router.delete('/:id', async (req, res) => {
  try {
    const category = await Category.findByIdAndDelete(req.params.id);

    if (!category) {
      return res.status(404).json({ success: false, message: 'Category not found' });
    }

    res.json({ success: true, message: 'Category deleted successfully' });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
});
router.patch('/:id/toggle', async (req, res) => {
  try {
    const category = await Category.findById(req.params.id);
    if (!category) return res.status(404).json({ success: false, message: "Category not found" });

    category.show = !category.show; 
    await category.save();

    res.json({ success: true, message: "Category visibility updated", show: category.show });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Server error" });
  }
});


module.exports = router;
