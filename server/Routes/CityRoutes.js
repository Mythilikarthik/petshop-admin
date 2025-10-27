const express = require('express');
const router = express.Router();
const City = require('../Models/City');

// Create a new city
router.post('/add', async (req, res) => {
  try {
    const {city} = req.body;
    const existing = await City.findOne({ city });
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
    const updated = await City.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!updated) return res.status(404).json({ error: "City not found" });

    res.status(200).json({ message: "City updated successfully", city: updated });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({ error: "City name already exists" });
    }
    console.error(error);
    res.status(500).json({ error: "Server error" });
  }
});


// Delete a city by ID
router.delete('/:id', async (req, res) => {
  try {
    const city = await City.findByIdAndDelete(req.params.id);
    if (!city) {
      return res.status(404).send();
    }
    res.status(200).send(city);
  } catch (error) {
    res.status(500).send(error);
  }
});

module.exports = router;