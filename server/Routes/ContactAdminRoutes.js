// const express = require("express");
// const router = express.Router();
// const nodemailer = require("nodemailer");
// const Admin = require("../Models/Admin");



// router.post("/", async (req, res) => {
//   try {
//     const { shopName, email, description } = req.body;

//     // Get admin email from DB
//     const admin = await Admin.findOne({});
//     if (!admin || !admin.email) {
//       return res.status(404).json({ success: false, message: "Admin email not found" });
//     }

    
//     const transporter = nodemailer.createTransport({
//       host: "smtp.gmail.com",
//       port: 587,
//       secure: false,
//       auth: {
//         user: process.env.SMTP_USER, // e.g. your gmail
//         pass: process.env.SMTP_PASS,
//       },
//     });

//     const mailOptions = {
//       from: admin.email,             
//       replyTo: email,               
//       to: admin.email,
//       subject: `Contact from ${shopName}`,
//       html: `
//         <h3>Message from ${shopName}</h3>
//         <p><strong>Email:</strong> ${email}</p>
//         <p><strong>Message:</strong></p>
//         <p>${description}</p>
//       `,
//     };

//     await transporter.sendMail(mailOptions);

//     return res.json({ success: true, message: "Message sent to admin successfully" });
//   } catch (err) {
//     console.error("Error sending admin mail:", err);
//     res.status(500).json({ success: false, message: err.message });
//   }
// });

// router.post("/send", async (req, res) => {
//   try {
//     const { name, email, phone, message } = req.body;
// if (!name || !email || !message) {
//     return res.json({ success: false, message: "Required fields missing!" });
//   }
//     // Get admin email from DB
//     const admin = await Admin.findOne({});
//     if (!admin || !admin.email) {
//       return res.status(404).json({ success: false, message: "Admin email not found" });
//     }

    
//     const transporter = nodemailer.createTransport({
//       host: "smtp.gmail.com",
//       port: 587,
//       secure: false,
//       auth: {
//         user: process.env.SMTP_USER, // e.g. your gmail
//         pass: process.env.SMTP_PASS,
//       },
//     });
    
//     const mailOptions = {
//       from: admin.email,             
//       replyTo: email,                
//       to: admin.email,
//       subject: "New Contact Form Submission",
//       html: `
//         <h3>Contact Request</h3>
//         <p><strong>Name:</strong> ${name}</p>
//         <p><strong>Email:</strong> ${email}</p>
//         <p><strong>Phone:</strong> ${phone}</p>
//         <p><strong>Message:</strong> ${message}</p>
//       `,
//     };

//     await transporter.sendMail(mailOptions);

//     return res.json({ success: true, message: "Message sent to admin successfully" });
//   } catch (err) {
//     console.error("Error sending admin mail:", err);
//     res.status(500).json({ success: false, message: err.message });
//   }
// });

// module.exports = router;

const express = require("express");
const router = express.Router();
const emailjs = require("@emailjs/nodejs");
const Admin = require("../Models/Admin");
const sendContactEmail = require("../Utils/sendContactEmail");


// const sendEmail = async (templateData) => {
//   return emailjs.send(
//     process.env.EMAILJS_SERVICE_ID,
//     process.env.EMAILJS_TEMPLATE_ID,
//     templateData,
//     {
//       publicKey: process.env.EMAILJS_PUBLIC_KEY,
//       privateKey: process.env.EMAILJS_PRIVATE_KEY,
//     }
//   );
// };


router.post("/", async (req, res) => {
  try {
    const { shopName, email, description } = req.body;

    if (!shopName || !email || !description) {
      return res.json({ success: false, message: "Required fields missing" });
    }

    const admin = await Admin.findOne({});
    if (!admin || !admin.email) {
      return res.status(404).json({ success: false, message: "Admin email not found" });
    }

    await sendContactEmail({
      title: `Contact from ${shopName}`,
      name: shopName,
      email,
      phone: "",
      message: description,
      admin_email: admin.email,
    });
    await sendContactEmail({
      title: `Contact from ${shopName}`,
      name: shopName,
      email,
      phone: "",
      message: description,
      admin_email: "scotwebtech2025@gmail.com",
    });

    res.json({ success: true, message: "Message sent successfully" });
  } catch (err) {
    console.error("EmailJS error:", err);
    res.status(500).json({ success: false, message: "Failed to send message" });
  }
});

router.post("/send", async (req, res) => {
  try {
    const { name, email, phone, message } = req.body;

    if (!name || !email || !message) {
      return res.json({ success: false, message: "Required fields missing!" });
    }

    const admin = await Admin.findOne({});
    if (!admin || !admin.email) {
      return res.status(404).json({ success: false, message: "Admin email not found" });
    }

    await sendContactEmail({
      title: "New Contact Form Submission",
      name,
      email,
      phone: phone || "",
      message,
      admin_email: admin.email,
    });
    await sendContactEmail({
      title: "New Contact Form Submission",
      name,
      email,
      phone: phone || "",
      message,
      admin_email: "scotwebtech2025@gmail.com",
    });

    res.json({ success: true, message: "Message sent successfully" });
  } catch (err) {
    console.error("EmailJS error:", err);
    res.status(500).json({ success: false, message: "Failed to send message" });
  }
});

module.exports = router;