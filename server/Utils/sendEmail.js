require("dotenv").config();
const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  service: "gmail", 
  auth: {
    user: process.env.SMTP_USER, // Your email address
    pass: process.env.SMTP_PASS  // Your email App Password
  }
});

const sendApprovalEmail = async (toEmail, shopName) => {
  try {
    const mailOptions = {
      from: `"Your Business Directory" <${process.env.SMTP_USER}>`,
      to: toEmail,
      subject: `Listing Approved: ${shopName}!`,
      text: `Hello,\n\nGreat news! Your business listing for "${shopName}" has been officially reviewed and approved by our team. It is now live on our platform.\n\nThank you for listing with us!`,
      html: `
        <div style="font-family: Arial, sans-serif; padding: 20px; color: #333;">
          <h2 style="color: #28a745;">Congratulations!</h2>
          <p>Your business listing for <strong>${shopName}</strong> has been officially approved and is now live on our platform.</p>
          <br />
          <p>Best regards,<br /><strong>Vet and Pets Directory Team</strong></p>
        </div>
      `
    };

    await transporter.sendMail(mailOptions);
    console.log(`Approval email successfully sent to ${toEmail}`);
  } catch (error) {
    console.error("Error sending approval email:", error);
  }
};

module.exports = sendApprovalEmail;