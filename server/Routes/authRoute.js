// backend/Routes/authRoute.js
const express = require("express");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const Admin = require("../Models/Admin");
const User = require("../Models/User");
const { SECRET_KEY, verifyToken } = require("../middleware/authMiddleware");
const checkPremium = require("../middleware/checkPremium");
const nodemailer = require("nodemailer");
const crypto = require("crypto");

const router = express.Router();
const { OAuth2Client } = require("google-auth-library");
const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);
const ADMIN_URL =
  process.env.NODE_ENV === "production"
    ? "https://petshop-admin-frontend.onrender.com"
    : "http://localhost:3000";

const USER_URL =
  process.env.NODE_ENV === "production"
    ? "https://petshop-user.onrender.com"
    : "http://localhost:3001";


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

router.post("/admin/forgot-password", async (req, res) => {
  const { email } = req.body;

  const admin = await Admin.findOne({ email });
  if (!admin)
    return res.json({ success: true }); // prevent email enumeration

  const token = crypto.randomBytes(32).toString("hex");

  admin.resetPasswordToken = token;
  admin.resetPasswordExpires = Date.now() + 1000 * 60 * 15; // 15 min
  await admin.save();

  const resetLink = `${ADMIN_URL}/reset-password?token=${token}`;

  const transporter = nodemailer.createTransport({
        host: "smtp.gmail.com",
        port: 587,
        secure: false,
        auth: {
          user: process.env.SMTP_USER, // e.g. your gmail
          pass: process.env.SMTP_PASS,
        },
      });
  const mailOptions = {
      from: `"Pet Directory" <${process.env.SMTP_USER}>`,             
      replyTo: admin.email,               
      to: admin.email,
      subject: "Reset Your Password",
      html: `
      <div style="font-family: Arial">
        <h2>Password Reset</h2>
        <p>You requested a password reset.</p>
        <a href="${resetLink}"
           style="padding:10px 15px;background:#f97316;color:#fff;text-decoration:none;border-radius:5px">
          Reset Password
        </a>
        <p style="margin-top:10px;font-size:12px">
          This link expires in 15 minutes
        </p>
      </div>
    `,
    };
  
  
  await transporter.sendMail(mailOptions);

  res.json({ success: true, message: "Reset link sent" });
});
router.post("/admin/reset-password", async (req, res) => {
  const { token, password } = req.body;

  const admin = await Admin.findOne({
    resetPasswordToken: token,
    resetPasswordExpires: { $gt: Date.now() },
  });

  if (!admin)
    return res
      .status(400)
      .json({ success: false, message: "Invalid or expired token" });

  admin.password = await bcrypt.hash(password, 10);
  admin.resetPasswordToken = undefined;
  admin.resetPasswordExpires = undefined;

  await admin.save();

  res.json({ success: true, message: "Password reset successful" });
});

// ------------------ User Register ------------------
router.post("/user/register", async (req, res) => {
  console.log("User register attempt:", req.body);

  try {
    const { name, username, email, phone, password } = req.body;

    // Validate required fields
    if (!name || !username || !email || !phone || !password) {
      return res.status(400).json({ 
        success: false, 
        message: "All fields are required" 
      });
    }

    // Check if username exists
    const existingUsername = await User.findOne({ username });
    if (existingUsername) {
      return res.status(400).json({
        success: false,
        message: "Username already taken"
      });
    }

    // Check if email exists
    const existingEmail = await User.findOne({ email });
    if (existingEmail) {
      return res.status(400).json({
        success: false,
        message: "Email already registered"
      });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create new user
    const newUser = new User({
      name,
      username,
      email,
      phone,
      password: hashedPassword,
      isPremium: false, // default
    });

    await newUser.save();

    // Generate token
    const token = generateToken(newUser._id, "user");

    res.status(201).json({
      success: true,
      message: "Registration successful",
      token,
      id: newUser._id,
      role: "user"
    });

  } catch (err) {
    console.error("User register error:", err);
    res.status(500).json({ 
      success: false, 
      message: "Server error" 
    });
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
      name: user.name,
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


router.post("/user/forgot-password", async (req, res) => {
  const { email } = req.body;

  const user = await User.findOne({ email });
  if (!user)
    return res.json({ success: true }); // prevent email enumeration

  const token = crypto.randomBytes(32).toString("hex");

  user.resetPasswordToken = token;
  user.resetPasswordExpires = Date.now() + 1000 * 60 * 15; // 15 min
  await user.save();

  const resetLink = `${USER_URL}/reset-password?token=${token}`;

  const transporter = nodemailer.createTransport({
        host: "smtp.gmail.com",
        port: 587,
        secure: false,
        auth: {
          user: process.env.SMTP_USER, // e.g. your gmail
          pass: process.env.SMTP_PASS,
        },
      });
  const mailOptions = {
      from: `"Pet Directory" <${process.env.SMTP_USER}>`,             
      replyTo: user.email,               
      to: user.email,
      subject: "Reset Your Password",
      html: `
      <div style="font-family: Arial">
        <h2>Password Reset</h2>
        <p>You requested a password reset.</p>
        <a href="${resetLink}"
           style="padding:10px 15px;background:#f97316;color:#fff;text-decoration:none;border-radius:5px">
          Reset Password
        </a>
        <p style="margin-top:10px;font-size:12px">
          This link expires in 15 minutes
        </p>
      </div>
    `,
    };
  
  
  await transporter.sendMail(mailOptions);

  res.json({ success: true, message: "Reset link sent" });
});
router.post("/user/reset-password", async (req, res) => {
  const { token, password } = req.body;

  const user = await User.findOne({
    resetPasswordToken: token,
    resetPasswordExpires: { $gt: Date.now() },
  });

  if (!user)
    return res
      .status(400)
      .json({ success: false, message: "Invalid or expired token" });

  user.password = await bcrypt.hash(password, 10);
  user.resetPasswordToken = undefined;
  user.resetPasswordExpires = undefined;

  await user.save();

  res.json({ success: true, message: "Password reset successful" });
});
router.post("/user/google", async (req, res) => {
  try {
    console.log("Google login body:", req.body);

    const { token } = req.body;
    if (!token) {
      return res.status(400).json({
        success: false,
        message: "Google token missing",
      });
    }

    const ticket = await client.verifyIdToken({
      idToken: token,
      audience: process.env.GOOGLE_CLIENT_ID,
    });

    const payload = ticket.getPayload();
    const { email, name, sub } = payload;

    let user = await User.findOne({ email });

    // if (!user) {
    //   user = await User.create({
    //     name,
    //     email,
    //     username: email,          // IMPORTANT (matches normal login)
    //     googleId: sub,
    //     authProvider: "google",
    //     isPremium: false,
    //   });
    // }
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }
    const jwtToken = generateToken(user._id, "user");

    return res.json({
      success: true,
      token: jwtToken,
      role: "user",
      id: user._id,
      name: user.name,
      message: "Google login successful",
      isPremium: user.isPremium,
      premiumPlan: user.premiumPlan,
      premiumEndDate: user.premiumEndDate,
    });
  } catch (err) {
    console.error("Google auth error:", err);
    return res.status(401).json({
      success: false,
      message: "Google auth failed",
    });
  }
});

module.exports = router;
