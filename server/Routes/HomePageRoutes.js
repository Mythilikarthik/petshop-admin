const express = require("express");
const router = express.Router();
const HomePage = require("../Models/HomePage");

// ✅ Get homepage content
router.get("/", async (req, res) => {
  try {
    const home = await HomePage.findOne();
    res.json({ success: true, home });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// ✅ Create or Update homepage content
router.post("/", async (req, res) => {
  try {
    const existing = await HomePage.findOne();

    if (existing) {
      const updated = await HomePage.findByIdAndUpdate(existing._id, req.body, { new: true });
      return res.json({ success: true, message: "Home Page updated", home: updated });
    }

    const created = await HomePage.create(req.body);
    res.json({ success: true, message: "Home Page created", home: created });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;
