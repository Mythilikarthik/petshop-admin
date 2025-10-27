// backend/Routes/authRoute.js
const express = require("express");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const Admin = require("../Models/Admin");
const User = require("../Models/User");
const { SECRET_KEY } = require("../middleware/authMiddleware");

const router = express.Router();

// helper function
const generateToken = (id, role) => {
  return jwt.sign({ id, role }, SECRET_KEY, { expiresIn: "7d" });
};

// ------------------ Admin Login ------------------
router.post("/admin/login", async (req, res) => {
    console.log("Admin login attempt:", req.body);
  try {
    const { username, password } = req.body;
    const admin = await Admin.findOne({ username });

    if (!admin) {
      return res.status(404).json({ success: false, message: "Admin not found" });
    }

    const passwordMatch =
      (admin.password.startsWith("$2") && (await bcrypt.compare(password, admin.password))) ||
      password === admin.password; // fallback if not hashed yet

    if (!passwordMatch) {
      return res.status(401).json({ success: false, message: "Invalid credentials" });
    }

    const token = generateToken(admin._id, "admin");
    return res.json({
      success: true,
      token,
      role: "admin",
      id: admin._id,
      message: "Admin login successful",
    });
  } catch (err) {
    console.error("Admin login error:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

// ------------------ User Login ------------------
router.post("/user/login", async (req, res) => {
  try {
    const { username, password } = req.body;
    const user = await User.findOne({ username });

    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    const passwordMatch =
      (user.password.startsWith("$2") && (await bcrypt.compare(password, user.password))) ||
      password === user.password;

    if (!passwordMatch) {
      return res.status(401).json({ success: false, message: "Invalid credentials" });
    }

    const token = generateToken(user._id, "user");
    return res.json({
      success: true,
      token,
      role: "user",
      id: user._id,
      message: "User login successful",
    });
  } catch (err) {
    console.error("User login error:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

module.exports = router;
