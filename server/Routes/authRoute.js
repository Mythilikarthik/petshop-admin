// backend/Routes/authRoute.js
const express = require("express");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const Admin = require("../Models/Admin");
const User = require("../Models/User");
const { SECRET_KEY, verifyToken } = require("../middleware/authMiddleware");
const checkPremium = require("../middleware/checkPremium");

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
    const admin = await Admin.findOne({
      $or: [{ username }, { email: username }]
    });

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
router.get("/admin/profile/:id", async (req, res) => {
  try {
    const admin = await Admin.findById(req.params.id).select("-password"); // exclude password

    if (!admin) {
      return res.status(404).json({ success: false, message: "Admin not found" });
    }

    res.json({
      success: true,
      admin,
    });
  } catch (err) {
    console.error("Fetch profile error:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

// ------------------ Update Admin Profile ------------------
router.put("/admin/profile/:id", async (req, res) => {
  try {
    const { name, email, phone } = req.body;
    const updated = await Admin.findByIdAndUpdate(
      req.params.id,
      { name, email, phone },
      { new: true }
    );

    if (!updated) {
      return res.status(404).json({ success: false, message: "Admin not found" });
    }

    res.json({
      success: true,
      message: "Profile updated successfully",
      admin: updated,
    });
  } catch (err) {
    console.error("Profile update error:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

// ------------------ Change Password ------------------
router.put("/admin/change-password/:id", async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    const admin = await Admin.findById(req.params.id);

    if (!admin) {
      return res.status(404).json({ success: false, message: "Admin not found" });
    }

    const passwordMatch =
      (admin.password.startsWith("$2") && (await bcrypt.compare(currentPassword, admin.password))) ||
      currentPassword === admin.password;

    if (!passwordMatch) {
      return res.status(401).json({ success: false, message: "Current password is incorrect" });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    admin.password = hashedPassword;
    await admin.save();

    res.json({ success: true, message: "Password changed successfully" });
  } catch (err) {
    console.error("Change password error:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

// ------------------ User Login ------------------
router.post("/user/login", async (req, res) => {
  console.log("User login attempt:", req.body);
  try {
    const { username, password } = req.body;
    const user = await User.findOne({
      $or: [{ username }, { email: username }]
    });

    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    const passwordMatch =
      (user.password.startsWith("$2") && (await bcrypt.compare(password, user.password))) ||
      password === user.password;

    if (!passwordMatch) {
      return res.status(401).json({ success: false, message: "Invalid credentials" });
    }

    // ✅ Check and update premium if expired
    // if (
    //   user.isPremium &&
    //   user.premiumEndDate &&
    //   new Date() > new Date(user.premiumEndDate)
    // ) {
    //   user.isPremium = false;
    //   user.premiumPlan = null;
    //   user.premiumStartDate = null;
    //   user.premiumEndDate = null;
    //   await user.save();
    //   console.log(`⚠️ Premium expired for user: ${user.email}`);
    // }
 
    const token = generateToken(user._id, "user");

    return res.json({
      success: true,
      token,
      role: "user",
      id: user._id,
      message: "User login successful",
      isPremium: user.isPremium,
      premiumPlan: user.premiumPlan,
      premiumEndDate: user.premiumEndDate,
    });
  } catch (err) {
    console.error("User login error:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

router.get("/user/profile/:id", async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select("-password"); // exclude password

    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    res.json({
      success: true,
      user,
    });
  } catch (err) {
    console.error("Fetch profile error:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

// ------------------ Update User Profile ------------------
router.put("/user/profile/:id", async (req, res) => {
  try {
    const { name, email, phone } = req.body;
    const updated = await User.findByIdAndUpdate(
      req.params.id,
      { name, email, phone },
      { new: true }
    );

    if (!updated) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    res.json({
      success: true,
      message: "Profile updated successfully",
      user: updated,
    });
  } catch (err) {
    console.error("Profile update error:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

// ------------------ Change Password ------------------
router.put("/user/change-password/:id", async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    const passwordMatch =
      (user.password.startsWith("$2") && (await bcrypt.compare(currentPassword, user.password))) ||
      currentPassword === user.password;

    if (!passwordMatch) {
      return res.status(401).json({ success: false, message: "Current password is incorrect" });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedPassword;
    await user.save();

    res.json({ success: true, message: "Password changed successfully" });
  } catch (err) {
    console.error("Change password error:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
});
router.get("/user/all", verifyToken, async (req,res) => {
  try{
    //console.log(req.userId);
  const users = await User.find({_id : {$ne : req.userId}}).sort({created_at: -1});
  res.json({success: true, users});
  } catch (err) {
    console.error("Error:", err);
    res.json({success: false, message: err});
  }
});
module.exports = router;
