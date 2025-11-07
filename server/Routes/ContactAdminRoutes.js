const express = require("express");
const router = express.Router();
const nodemailer = require("nodemailer");
const Admin = require("../Models/Admin");



router.post("/", async (req, res) => {
  try {
    const { shopName, email, description } = req.body;

    // Get admin email from DB
    const admin = await Admin.findOne({});
    if (!admin || !admin.email) {
      return res.status(404).json({ success: false, message: "Admin email not found" });
    }

    
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
      from: email,
      to: admin.email,
      subject: `Contact from ${shopName}`,
      html: `
        <h3>Message from ${shopName}</h3>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Message:</strong></p>
        <p>${description}</p>
      `,
    };

    await transporter.sendMail(mailOptions);

    return res.json({ success: true, message: "Message sent to admin successfully" });
  } catch (err) {
    console.error("Error sending admin mail:", err);
    res.status(500).json({ success: false, message: "Server error sending mail" });
  }
});

module.exports = router;
