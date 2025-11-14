const express = require('express');
const router = express.Router();
const City = require('../Models/City');
const Listing = require('../Models/Listing');

// Create a new city
router.post('/add', async (req, res) => {
  try {
    const {city} = req.body;
    const existing = await City.findOne({ 
      city: { $regex: `^${city}$`, $options: 'i' }
     });
    if (existing) {
        return res.status(400).json({ success: false, message: 'City already exists' });
    }
    const newCity = new City({ city });
    await newCity.save();
    res.json({ success: true, message: 'City added successfully', city: newCity });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({ error: "City name already exists" });
    }
    res.json({ success: false, message: 'Server error' });
  }
});

// Get all cities
router.get('/', async (req, res) => {
  try {
    const cities = await City.find();
    res.json({ success: true, cities });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
});
router.get('/show', async (req, res) => {
  try {
    const cities = await City.find({ show : true });
    res.json({ success: true, cities });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// Get a city by ID
router.get('/:id', async (req, res) => {
  try {
    const city = await City.findById(req.params.id);
    if (!city) {
      return res.status(404).send();
    }
    res.status(200).send(city);
  } catch (error) {
    res.status(500).send(error);
  }
});

// Update a city by ID
router.patch('/:id', async (req, res) => {
  try {
    const { city } = req.body;

    if (!city || !city.trim()) {
      return res.status(400).json({ success: false, message: 'City name is required' });
    }

    // Case-insensitive duplicate check (exclude current city ID)
    const existing = await City.findOne({
      _id: { $ne: req.params.id },
      city: { $regex: `^${city}$`, $options: 'i' }
    });

    if (existing) {
      return res.status(400).json({ success: false, message: 'City already exists' });
    }

    // Proceed to update
    const updated = await City.findByIdAndUpdate(
      req.params.id,
      { city },
      { new: true, runValidators: true }
    );

    if (!updated) {
      return res.status(404).json({ success: false, message: 'City not found' });
    }

    res.status(200).json({
      success: true,
      message: 'City updated successfully',
      city: updated
    });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({ success: false, message: 'City name already exists' });
    }
    console.error(error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});



// Delete a city by ID
router.delete('/:id', async (req, res) => {
  try {
    const cityId = req.params.id;


    // ✅ Safe to delete
    const deletedCity = await City.findByIdAndDelete(cityId);
    if (!deletedCity) {
      return res.status(404).json({ success: false, message: "City not found" });
    }

    res.json({ success: true, message: "City deleted successfully" });
  } catch (err) {
    //console.error(error);
    res.status(400).json({ success: false, message: err.message });
  }
});

router.patch("/:id/toggle" , async(req, res) => {
  try {
    const city = await City.findById(req.params.id);
    if(!city) return res.status(404).json({ success: false, message: "city not found" });
    city.show = !city.show;
    await city.save();
    res.json({ success: true, message: "City visibility updated", show: city.show });
  } catch (err) {
    console.log("Error:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
})

module.exports = router;