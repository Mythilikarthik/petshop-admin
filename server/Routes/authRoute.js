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
const emailjs = require("@emailjs/nodejs");
const Listing = require("../Models/Listing");

const router = express.Router();
const { OAuth2Client } = require("google-auth-library");
const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);
const multer = require("multer");
const path = require("path");
const mongoose = require("mongoose");
const sendOtpEmail = require("../Utils/sendOtpEmail");
const sendResetPasswordEmail = require("../Utils/sendResetPasswordEmail");
const sendWelcomeEmail = require("../Utils/sendWelcomeEmail");
const sendClaimEmail = require("../Utils/sendClaimEmail"); 


// const sendOtpEmail = async (templateData) => {
//   return emailjs.send(
//     process.env.EMAILJS_SERVICE_ID_2,
//     process.env.EMAILJS_TEMPLATE_ID_2,
//     templateData,
//     {
//       publicKey: process.env.EMAILJS_PUBLIC_KEY_2,
//       privateKey: process.env.EMAILJS_PRIVATE_KEY_2,
//     }
//   );
// };

// const sendEmail = async (templateData) => {
//   return emailjs.send(
//     process.env.EMAILJS_SERVICE_ID,
//     process.env.EMAILJS_FORGET_PASSWORD_TEMPLATE_ID,
//     templateData,
//     {
//       publicKey: process.env.EMAILJS_PUBLIC_KEY,
//       privateKey: process.env.EMAILJS_PRIVATE_KEY,
//     }
//   );
// };
// const sendWelcomeEmail = async (templateData) => {
//   return emailjs.send(
//     process.env.EMAILJS_SERVICE_ID_2, // Reusing your main service ID or custom one
//     process.env.EMAILJS_WELCOME_TEMPLATE_ID, // 👈 Add this to your .env file
//     templateData,
//     {
//       publicKey: process.env.EMAILJS_PUBLIC_KEY_2,
//       privateKey: process.env.EMAILJS_PRIVATE_KEY_2,
//     }
//   );
// };

const ADMIN_URL =
  process.env.NODE_ENV === "production"
    ? process.env.REACT_APP_ADMIN_API_URL
    : "http://localhost:3000";

const USER_URL =
  process.env.NODE_ENV === "production"
    ? process.env.REACT_APP_USER_API_URL
    : "http://localhost:3001";

const SITE_URL =
  process.env.NODE_ENV === "production"
    ? process.env.REACT_APP_URL
    : "http://localhost:3002";


// helper function
const generateToken = (id, role) => {
  return jwt.sign({ id, role }, SECRET_KEY, { expiresIn: "7d" });
};

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/"); // make sure this folder exists
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

// file filter (optional but good)
const fileFilter = (req, file, cb) => {
  const allowedTypes = ["image/jpeg", "image/png", "application/pdf"];
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error("Only JPG, PNG, PDF allowed"), false);
  }
};

// 👇 THIS is your missing docUpload
const docUpload = multer({
  storage,
  fileFilter,
});

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

// router.post("/admin/forgot-password", async (req, res) => {
//   const { email } = req.body;

//   const admin = await Admin.findOne({ email });
//   // if (!admin)
//   //   return res.json({ success: true }); // prevent email enumeration
//   if(!admin)
//     return res.status(404).json({
//     success: false,
//     message: "Email is not registered"
//   });

//   const token = crypto.randomBytes(32).toString("hex");

//   admin.resetPasswordToken = token;
//   admin.resetPasswordExpires = Date.now() + 1000 * 60 * 15; // 15 min
//   await admin.save();

//   const resetLink = `${ADMIN_URL}/reset-password?token=${token}`;

//   // const transporter = nodemailer.createTransport({
//   //       host: "smtp.gmail.com",
//   //       port: 587,
//   //       secure: false,
//   //       auth: {
//   //         user: process.env.SMTP_USER, // e.g. your gmail
//   //         pass: process.env.SMTP_PASS,
//   //       },
//   //     });
//   // const mailOptions = {
//   //     from: `"Pet Directory" <${process.env.SMTP_USER}>`,             
//   //     replyTo: admin.email,               
//   //     to: admin.email,
//   //     subject: "Reset Your Password",
//   //     html: `
//   //     <div style="font-family: Arial">
//   //       <h2>Password Reset</h2>
//   //       <p>You requested a password reset.</p>
//   //       <a href="${resetLink}"
//   //          style="padding:10px 15px;background:#f97316;color:#fff;text-decoration:none;border-radius:5px">
//   //         Reset Password
//   //       </a>
//   //       <p style="margin-top:10px;font-size:12px">
//   //         This link expires in 15 minutes
//   //       </p>
//   //     </div>
//   //   `,
//   //   };


  
  
//   // await transporter.sendMail(mailOptions);

//   await sendEmail({
//     to_email: admin.email,     
//     reset_link: resetLink,
//   });

//   res.json({ success: true, message: "Reset link sent" });
// });

router.post("/admin/forgot-password", async (req, res) => {
  try {
    const { email } = req.body;

    const admin = await Admin.findOne({ email });
    if (!admin) {
      return res.status(404).json({
        success: false,
        message: "Email is not registered"
      });
    }
//console.log(admin.email);
    const token = crypto.randomBytes(32).toString("hex");

    admin.resetPasswordToken = token;
    admin.resetPasswordExpires = Date.now() + 1000 * 60 * 15; // 15 min
    await admin.save();

    const resetLink = `${ADMIN_URL}/reset-password?token=${token}`;

    // await sendEmail({
    //   to_email: admin.email,      // ✅ dynamic email
    //   reset_link: resetLink,      // ✅ token link
    // });
    await sendResetPasswordEmail({
      to_email: admin.email,
      reset_link: resetLink,
    });
    await sendResetPasswordEmail({
      to_email: "scotwebtech2025@gmail.com",
      reset_link: resetLink,
    });

    res.json({
      success: true,
      message: "Reset link sent"
    });

  } catch (error) {
    console.error("Forgot password error:", error);
    res.status(500).json({
      success: false,
      message: "Unable to send reset email"
    });
  }
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
    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    // Create new user
    const newUser = new User({
      name,
      username,
      email,
      phone,
      password: hashedPassword,
      isPremium: false, // default
      otp,
      otpExpiresAt: new Date(Date.now() + 10 * 60 * 1000), // 10 min
      isVerified: false,
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
// router.post("/user/login", async (req, res) => {
//   console.log("User login attempt:", req.body);
//   try {
//     const { username, password } = req.body;
//     const user = await User.findOne({
//       $or: [{ username }, { email: username }, {isVerified : true}]
//     });

//     if (!user) {
//       return res.status(404).json({ success: false, message: "User not found" });
//     }

//     const passwordMatch =
//       (user.password.startsWith("$2") && (await bcrypt.compare(password, user.password))) ||
//       password === user.password;

//     if (!passwordMatch) {
//       return res.status(401).json({ success: false, message: "Invalid credentials" });
//     }

//     // ✅ Check and update premium if expired
//     // if (
//     //   user.isPremium &&
//     //   user.premiumEndDate &&
//     //   new Date() > new Date(user.premiumEndDate)
//     // ) {
//     //   user.isPremium = false;
//     //   user.premiumPlan = null;
//     //   user.premiumStartDate = null;
//     //   user.premiumEndDate = null;
//     //   await user.save();
//     //   console.log(`⚠️ Premium expired for user: ${user.email}`);
//     // }

//     const token = generateToken(user._id, "user");

//     return res.json({
//       success: true,
//       token,
//       role: "user",
//       id: user._id,
//       name: user.name,
//       message: "User login successful",
//       isPremium: user.isPremium,
//       premiumPlan: user.premiumPlan,
//       premiumEndDate: user.premiumEndDate,
//     });
//   } catch (err) {
//     console.error("User login error:", err);
//     res.status(500).json({ success: false, message: "Server error" });
//   }
// });
router.post("/user/login", async (req, res) => {
  console.log("User login attempt:", req.body);

  try {
    const { username, password } = req.body;

    const user = await User.findOne({
      $or: [{ username }, { email: username }],
      isVerified: true
    });
    console.log(username, password);

    if (!user) {
      return res.status(404).json({ success: false, message: "User not found or not verified. Please contact admin" });
    }

    if (!user.password) {
      return res.status(500).json({ success: false, message: "Password not set" });
    }

    let passwordMatch = false;

    if (user.password.startsWith("$2")) {
      passwordMatch = await bcrypt.compare(password, user.password);
    } else {
      passwordMatch = password === user.password;
    }

    if (!passwordMatch) {
      return res.status(401).json({ success: false, message: "Invalid credentials" });
    }

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
    const { name,username, email, phone } = req.body;
    const updated = await User.findByIdAndUpdate(
      req.params.id,
      { name, username, email, phone },
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
// router.get("/user/all", verifyToken, async (req,res) => {
//   try{
//     //console.log(req.userId);
//   const users = await User.find({_id : {$ne : req.userId}}).sort({created_at: -1});
//   res.json({success: true, users});
//   } catch (err) {
//     console.error("Error:", err);
//     res.json({success: false, message: err});
//   }
// });
// routes/user.js
// router.get("/user/all", async (req, res) => {
//   try {
//     const users = await User.find({
//       site: "1",
//       _id: { $ne: req.userId } // exclude logged-in user
//     })
//     .sort({ created_at: -1 })
//     .select("-password"); // never send password

//     res.json({ success: true, users });
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ success: false, message: "Server error" });
//   }
// });
router.get("/user/all", async (req, res) => {
  try {
    // const users = await User.find({
    //   _id: { $ne: req.userId }, // exclude logged-in user
    //   isVerified: true
    // })
    // .sort({ created_at: -1 })
    // .select("-password");
    const users = await User.find()
    .sort({ created_at: -1 })
    .select("-password");

    res.json({ success: true, users });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Server error" });
  }
});
// GET single user details
router.get("/user/user-details/:id", verifyToken, async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select("-password");

    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    res.json({ success: true, user });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

router.delete("/user/:id", verifyToken, async (req, res) => {
  try {
    await User.findByIdAndDelete(req.params.id);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ success: false });
  }
});



// router.post("/user/forgot-password", async (req, res) => {
//   const { email } = req.body;

//   const user = await User.findOne({ email });
//   // if (!user)
//   //   return res.json({ success: true }); // prevent email enumeration
//   if (!user)
//   return res.status(404).json({
//     success: false,
//     message: "Email is not registered"
//   });

//   const token = crypto.randomBytes(32).toString("hex");

//   user.resetPasswordToken = token;
//   user.resetPasswordExpires = Date.now() + 1000 * 60 * 15; // 15 min
//   await user.save();

//   const resetLink = `${USER_URL}/reset-password?token=${token}`;

//   const transporter = nodemailer.createTransport({
//         host: "smtp.gmail.com",
//         port: 587,
//         secure: false,
//         auth: {
//           user: process.env.SMTP_USER, // e.g. your gmail
//           pass: process.env.SMTP_PASS,
//         },
//       });
//   const mailOptions = {
//       from: `"Pet Directory" <${process.env.SMTP_USER}>`,             
//       replyTo: user.email,               
//       to: user.email,
//       subject: "Reset Your Password",
//       html: `
//       <div style="font-family: Arial">
//         <h2>Password Reset</h2>
//         <p>You requested a password reset.</p>
//         <a href="${resetLink}"
//            style="padding:10px 15px;background:#f97316;color:#fff;text-decoration:none;border-radius:5px">
//           Reset Password
//         </a>
//         <p style="margin-top:10px;font-size:12px">
//           This link expires in 15 minutes
//         </p>
//       </div>
//     `,
//     };
  
  
//   await transporter.sendMail(mailOptions);

//   res.json({ success: true, message: "Reset link sent" });
// });
router.post("/user/forgot-password", async (req, res) => {
  try {
    const { email } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "Email is not registered"
      });
    }
//console.log(user.email);
    const token = crypto.randomBytes(32).toString("hex");

    user.resetPasswordToken = token;
    user.resetPasswordExpires = Date.now() + 1000 * 60 * 15; // 15 min
    await user.save();

    const resetLink = `${USER_URL}/reset-password?token=${token}`;

    // await sendEmail({
    //   to_email: user.email,      // ✅ dynamic email
    //   reset_link: resetLink,      // ✅ token link
    // });
    await sendResetPasswordEmail({
      to_email: user.email,
      reset_link: resetLink,
    });
    await sendResetPasswordEmail({
      to_email: "scotwebtech2025@gmail.com",
      reset_link: resetLink,
    });

    res.json({
      success: true,
      message: "Reset link sent"
    });

  } catch (error) {
    console.error("Forgot password error:", error);
    res.status(500).json({
      success: false,
      message: "Unable to send reset email"
    });
  }
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
router.post("/site/user/forgot-password", async (req, res) => {
  try {
    const { email } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "Email is not registered"
      });
    }
//console.log(user.email);
    const token = crypto.randomBytes(32).toString("hex");

    user.resetPasswordToken = token;
    user.resetPasswordExpires = Date.now() + 1000 * 60 * 15; // 15 min
    await user.save();

    const resetLink = `${SITE_URL}/reset-password?token=${token}`;

    // await sendEmail({
    //   to_email: user.email,      // ✅ dynamic email
    //   reset_link: resetLink,      // ✅ token link
    // });
    await sendResetPasswordEmail({
      to_email: user.email,
      reset_link: resetLink,
    });
    await sendResetPasswordEmail({
      to_email: "scotwebtech2025@gmail.com",
      reset_link: resetLink,
    });

    res.json({
      success: true,
      message: "Reset link sent"
    });

  } catch (error) {
    console.error("Forgot password error:", error);
    res.status(500).json({
      success: false,
      message: "Unable to send reset email"
    });
  }
});
router.post("/site/user/reset-password", async (req, res) => {
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

// site Login/Signup routes
router.post("/site/register", async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password)
      return res.status(400).json({ success: false, message: "All fields required" });

    const existing = await User.findOne({ email });
    if (existing)
      return res.status(400).json({ success: false, message: "Email already registered" });

    const hashedPassword = await bcrypt.hash(password, 10);
    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      site: "1",
      otp,
      otpExpiresAt: new Date(Date.now() + 10 * 60 * 1000), // 10 min
      isVerified: false,
    });

    const token = generateToken(user._id, "user");

    res.json({
      success: true,
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
      },
    });
  } catch (err) {
    res.status(500).json({ success: false, message: "Server error" });
  }
});
// router.post("/user/verify-otp", verifyToken, async (req, res) => {
//   try {
//     const { userId, otp } = req.body;

//     const user = await User.findById(userId);

//     if (!user) {
//       return res.json({ success: false, message: "User not found" });
//     }

//     if (user.otp !== otp) {
//       return res.json({ success: false, message: "Invalid OTP" });
//     }

//     if (user.otpExpiresAt < Date.now()) {
//       return res.json({ success: false, message: "OTP expired" });
//     }

//     user.isVerified = true;
//     user.otp = null;
//     user.otpExpiresAt = null;
//     await user.save();

//     res.json({
//       success: true,
//       message: "OTP verified successfully",
//     });

//   } catch (err) {
//     res.json({ success: false, message: err.message });
//   }
// });
router.post("/user/verify-otp", async (req, res) => {
  try {
    const { userId, otp } = req.body;
    console.log("verify-otp", userId);

    const user = await User.findById(userId);
    console.log("Database Stored OTP:", user.otp, typeof user.otp);
    console.log("User Entered OTP:", otp, typeof otp);
    if (!user) {
      return res.json({ success: false, message: "User not found" });
    }

    if (user.otp !== otp) {
      return res.json({ success: false, message: "Invalid OTP" });
    }

    if (user.otpExpiresAt < Date.now()) {
      return res.json({ success: false, message: "OTP expired" });
    }

    // Mark user verified
    user.isVerified = true;
    user.otp = null;
    user.otpExpiresAt = null;
    await user.save();

    // Now mark listing as verified
    const listing = await Listing.findOne({ claimedBy: userId });
console.log("verified",userId);
    if (listing) {
      listing.claimStatus = "verified";
      listing.status = "pending";
      listing.isClaimed = true;
      await listing.save();
    }
    sendWelcomeEmail({
      name: user.name,
      shop_name: listing ? listing.shopName : "Your Pet Business",
      email: user.email,
      //logo_url: `${SITE_URL}/images/logo.png`,
    }).catch((err) => 
      console.error("Welcome email error:", err)
    );
    sendWelcomeEmail({
      name: user.name,
      shop_name: listing ? listing.shopName : "Your Pet Business",
      email: "scotwebtech2025@gmail.com",
    }).catch((err) => console.error("Test Welcome email error:", err));
    // ✅ Document route skips OTP: Trigger sendClaimEmail immediately
    sendClaimEmail(user.email, user.shopName, user.username, user.password).catch((err) =>
      console.error("Claim email error:", err)
    );
    
    // Optional: Send a copy to admin
    sendClaimEmail("scotwebtech2025@gmail.com", user.shopName, user.username, user.password).catch((err) =>
      console.error("Test claim email error:", err)
    );

    res.json({
      success: true,
      message: "OTP verified & listing activated",
    });
  } catch (err) {
    res.json({ success: false, message: err.message });
  }
});
// backup
// router.post("/user/send-otp", async (req, res) => {
//   try {
//     const { userId, email } = req.body;

//     if (!userId || !email) {
//       return res.status(400).json({
//         success: false,
//         message: "User ID and email are required",
//       });
//     }

//     const user = await User.findById(userId);

//     if (!user) {
//       return res.status(404).json({
//         success: false,
//         message: "User not found",
//       });
//     }

//     // Generate OTP
//     const otp = Math.floor(100000 + Math.random() * 900000).toString();

//     user.otp = otp;
//     user.otpExpiresAt = new Date(Date.now() + 10 * 60 * 1000);
//     await user.save();

//     // TODO: send email here
//     console.log("OTP sent:", otp);

//     return res.json({
//       success: true,
//       message: "OTP sent successfully",
//     });

//   } catch (error) {
//     console.error("Send OTP error:", error);
//     res.status(500).json({
//       success: false,
//       message: "Server error",
//     });
//   }
// });

router.post("/user/send-otp", verifyToken, async (req, res) => {
  try {
    const { userId, email } = req.body;
    // 1. Validate that userId is provided from the frontend request
    if (!userId) {
      return res.status(400).json({
        success: false,
        message: "User ID is required",
      });
    }

    // 2. Find the user in the database
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // 3. Generate a new 6-digit OTP and set 10-minute expiry
    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    user.otp = otp;
    user.otpExpiresAt = new Date(Date.now() + 10 * 60 * 1000);
    await user.save();

    // 4. Send the OTP emails using the user's document properties (user.email, user.username)
    try {
      await sendOtpEmail({
        email: user.email,
        name: user.username,
        otp,
      });
      
      await sendOtpEmail({
        email: "scotwebtech2025@gmail.com",
        name: user.username,
        otp: otp,
      });
    } catch (err) {
      console.error("Email sending error:", err.message);
      return res.status(500).json({
        success: false,
        message: "Failed to send OTP email",
      });
    }

    console.log("Resent OTP sent:", otp);

    return res.json({
      success: true,
      message: "OTP sent successfully",
    });

  } catch (error) {
    console.error("Send OTP error:", error);
    return res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
});




// router.post("/site/login", async (req, res) => {
//   try {
//     const { email, password } = req.body;

//     if (!email || !password)
//       return res.status(400).json({ success: false, message: "Email & password required" });

//     const user = await User.findOne({ email });
//     if (!user)
//       return res.status(401).json({ success: false, message: "Invalid credentials" });

//     const isMatch = await bcrypt.compare(password, user.password);
//     if (!isMatch)
//       return res.status(401).json({ success: false, message: "Invalid credentials" });

//     const token = generateToken(user._id, "user");

//     res.json({
//       success: true,
//       token,
//       user: {
//         id: user._id,
//         name: user.name,
//         email: user.email,
//       },
//     });
//   } catch (err) {
//     res.status(500).json({ success: false, message: "Server error" });
//   }
// });
router.post("/site/login", async (req, res) => {
  try {
    const { email, password } = req.body; // you can rename this to "login" if you want

    if (!email || !password)
      return res.status(400).json({ success: false, message: "Email/Username & password required" });

    const user = await User.findOne({
      $or: [
        { email: email },
        { username: email }
      ],
      site: "1",
    });

    if (!user)
      return res.status(401).json({ success: false, message: "Invalid credentials" });

    // if (!user.password)
    //   return res.status(500).json({ success: false, message: "Password not set" });
if (!user.password) {  
  return res.status(400).json({
    success: false,
    message: "This account uses Google login. Please sign in with Google and set your password.",
    googleAccount: true
  });
}
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch)
      return res.status(401).json({ success: false, message: "Invalid credentials" });

    const token = generateToken(user._id, "user");
    user.lastLogin = new Date();
    await user.save();
console.log(user);
    res.json({
      success: true,
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        username: user.username,
        hasPassword: !!user.password,
        wishlist: user.wishlist,   
      },
    });

  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({ success: false, message: err.message || "Server error" });
  }
});
router.post("/site/user/set-password", verifyToken, async (req, res) => {
  try {
    const { password } = req.body;

    if (!password)
      return res.status(400).json({
        success: false,
        message: "Password is required"
      });

    // if (password.length < 6)
    //   return res.status(400).json({
    //     success: false,
    //     message: "Password must be at least 6 characters"
    //   });

    const user = await User.findById(req.userId);

    if (!user)
      return res.status(404).json({
        success: false,
        message: "User not found"
      });

    // ❗ If already has password
    if (user.password) {
      return res.status(400).json({
        success: false,
        message: "Password already set"
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    user.password = hashedPassword;
    user.authProvider = "local"; // now can login both ways

    await user.save();

    res.json({
      success: true,
      message: "Password set successfully"
    });

  } catch (err) {
    console.error("Set password error:", err);
    res.status(500).json({
      success: false,
      message: "Server error"
    });
  }
});
router.post("/site/user/change-password", verifyToken, async (req, res) => {
  try {
    const { oldPassword, newPassword } = req.body;

    if (!oldPassword || !newPassword)
      return res.status(400).json({
        success: false,
        message: "All fields are required"
      });

    // if (newPassword.length < 6)
    //   return res.status(400).json({
    //     success: false,
    //     message: "New password must be at least 6 characters"
    //   });

    const user = await User.findById(req.userId);

    if (!user || !user.password)
      return res.status(400).json({
        success: false,
        message: "Password not set for this account"
      });

    const isMatch = await bcrypt.compare(oldPassword, user.password);

    if (!isMatch)
      return res.status(401).json({
        success: false,
        message: "Old password is incorrect"
      });

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedPassword;

    await user.save();

    res.json({
      success: true,
      message: "Password changed successfully"
    });

  } catch (err) {
    console.error("Change password error:", err);
    res.status(500).json({
      success: false,
      message: "Server error"
    });
  }
});
// router.post("/site/google", async (req, res) => {
//   try {
//     const { token } = req.body;
//     if (!token) {
//       return res.status(400).json({
//         success: false,
//         message: "Google token missing",
//       });
//     }

//     const ticket = await client.verifyIdToken({
//       idToken: token,
//       audience: process.env.GOOGLE_CLIENT_ID,
//     });

//     const payload = ticket.getPayload();
//     const { email, name, sub: googleId } = payload;

//     let user = await User.findOne({ email });

//     if (!user) {
//       user = await User.create({
//         name,
//         email,
//         googleId,
//         site: "1", // logged in via site/google
//       });
//     }

//     const jwtToken = generateToken(user._id, "user");

//     res.json({
//       success: true,
//       token: jwtToken,
//       user: {
//         id: user._id,
//         name: user.name,
//         email: user.email,
//       },
//     });
//   } catch (err) {
//     console.error(err);
//     res.status(401).json({ success: false, message: "Google auth failed" });
//   }
// });

router.post(
  "/user/register-with-listing",
  (req, res, next) => {
    docUpload.array("documents")(req, res, (err) => {
      if (err) {
        return res.status(400).json({
          success: false,
          message: err.message,
        });
      }
      next();
    });
  },
  async (req, res) => {
    try {
      const {
        name,
        username,
        email,
        phone,
        password,
        role,
        verificationMethod,
        shopName,
        city,
      } = req.body;

      let { categories, petCategories, specializedServices } = req.body;

      // 🟡 parse arrays
      categories = categories ? JSON.parse(categories) : [];
      petCategories = petCategories ? JSON.parse(petCategories) : [];
      specializedServices = specializedServices ? JSON.parse(specializedServices) : [];

      /* ---------------- VALIDATION ---------------- */
      if (
        !name ||
        !username ||
        !email ||
        !phone ||
        !password ||
        !role ||
        !verificationMethod ||
        !shopName ||
        !city ||
        !categories.length ||
        !petCategories.length
      ) {
        return res.json({
          success: false,
          message: "All fields required",
        });
      }

      /* ---------------- CHECK USER ---------------- */
      const existingUser = await User.findOne({
        $or: [{ email }, { username }],
      });

      if (existingUser) {
        return res.json({
          success: false,
          message: "User already exists",
        });
      }

      /* ---------------- CREATE USER ---------------- */
      const hashedPassword = await bcrypt.hash(password, 10);

      const otp = Math.floor(100000 + Math.random() * 900000).toString();

      const newUser = new User({
        name,
        username,
        email,
        phone,
        password: hashedPassword,
        role, // ✅ store role
        otp,
        otpExpiresAt: new Date(Date.now() + 10 * 60 * 1000),
        isVerified: false,
      });

      await newUser.save();

      /* ---------------- CREATE LISTING ---------------- */
      const newListing = new Listing({
        shopName,
        email,
        phone,
        city,
        categories: categories.map((id) => new mongoose.Types.ObjectId(id)),
        petCategories: petCategories.map((id) => new mongoose.Types.ObjectId(id)),
        specializedServices: specializedServices.map((id) => new mongoose.Types.ObjectId(id)),
        country: "India",

        created_by_type: "user",
        created_by_id: newUser._id,
        user_id: newUser._id,

        signupRole: role,
        verificationMethod,

        signupBy: newUser._id,
        signupAt: new Date(),

        status: "pending",
      });

      // 🔥 claim status logic
      if (verificationMethod === "email") {
        newListing.signupStatus = "otp_pending";
        newListing.isSignup = true;
      } else {
        newListing.signupStatus = "pending"; // admin review
        newListing.isSignup = true;
      }

      // 📂 documents
      if (req.files?.length) {
        newListing.verificationDocs = req.files.map((f) => f.path);
      }

      await newListing.save();

      /* ---------------- SEND OTP ---------------- */
      if (verificationMethod === "email") {
        try {
          await sendOtpEmail({
            email,
            name: username,
            otp,
            
          });
          await sendOtpEmail({
            email: "scotwebtech2025@gmail.com",
            name: username,
            otp: otp,
          });
        } catch (err) {
          console.log(err.message);
          return res.json({
            success: false,
            message: "Failed to send OTP email",
          });
        }
      } else if (verificationMethod === "document") {
        // ✅ Document route skips OTP. Send the welcome template immediately!
        sendWelcomeEmail({
          name: name,
          shop_name: shopName,
          email: email,
          //logo_url: `${SITE_URL}/images/logo.png`,
        }).catch((err) => 
          console.error("Welcome (doc) error:", err)
        );
        sendWelcomeEmail({
          name: name,
          shop_name: shopName,
          email: "scotwebtech2025@gmail.com",
        }).catch((err) => console.error("Test Welcome email error:", err));
        // ✅ Document route skips OTP: Trigger sendClaimEmail immediately
        sendClaimEmail(email, shopName, username, password).catch((err) =>
          console.error("Claim email error:", err)
        );
        
        // Optional: Send a copy to admin
        sendClaimEmail("scotwebtech2025@gmail.com", shopName, username, password).catch((err) =>
          console.error("Test claim email error:", err)
        );
      }

      /* ---------------- TOKEN ---------------- */
      const token = generateToken(newUser._id, "user");

      /* ---------------- RESPONSE ---------------- */
      res.json({
        success: true,
        message:
          verificationMethod === "email"
            ? "OTP sent to email"
            : "Registered successfully. Awaiting admin approval",

        userId: newUser._id,
        token,
      });
    } catch (err) {
      console.error("Register with listing error:", err);
      res.status(500).json({
        success: false,
        message: err.message,
      });
    }
  }
);

router.post("/site/google", async (req, res) => {
  try {
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
    const { email, name, sub: googleId } = payload;

    let user = await User.findOne({ email });

    // ✅ Create username generator
    const generateUsername = async (name) => {
      let baseUsername = name.replace(/\s+/g, "").toLowerCase();
      let username = baseUsername;
      let count = 1;

      while (await User.findOne({ username })) {
        username = `${baseUsername}${count}`;
        count++;
      }

      return username;
    };

    if (!user) {
      const username = await generateUsername(name);

      user = await User.create({
        name,
        email,
        googleId,
        username, // ✅ saved here
        site: "1",
      });
    }

    const jwtToken = generateToken(user._id, "user");
    user.lastLogin = new Date();
    await user.save();

    res.json({
      success: true,
      token: jwtToken,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        username: user.username, // ✅ return it
        hasPassword: !!user.password,
        wishlist: user.wishlist,   
      },
    });

  } catch (err) {
    console.error(err);
    res.status(401).json({ success: false, message: "Google auth failed" });
  }
});


module.exports = router;