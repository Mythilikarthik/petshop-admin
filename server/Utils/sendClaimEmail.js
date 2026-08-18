require("dotenv").config();
const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.SMTP_USER, // Your email address
    pass: process.env.SMTP_PASS  // Your email App Password
  }
});

const sendClaimEmail = async (toEmail, shopName, username, password) => {
  try {
    const mailOptions = {
      from: `"Vet and Pets Directory Team" <${process.env.SMTP_USER}>`,
      to: toEmail,
      subject: `Listing Claim Successful: ${shopName}!`,
      text: `Hello ${username},\n\nGreat news! Your claim for the business listing "${shopName}" has been successfully processed.\n\nHere are your login details:\nUsername: ${username}\nPassword: ${password}\n\nYou can now log in to manage your listing.\n\nThank you for choosing us!`,
      html: `
        <div style="font-family: Arial, sans-serif; padding: 20px; color: #333;">
          <h2 style="color: #28a745;">Claim Successful!</h2>
          <p>Hello <strong>${username}</strong>,</p>
          <p>Your business listing for <strong>${shopName}</strong> has been successfully claimed and registered.</p>
          <p>Here are your login credentials to access your dashboard:</p>
          
          <div style="background-color: #f8f9fa; border: 1px solid #dee2e6; padding: 15px; border-radius: 5px; margin: 20px 0;">
            <p style="margin: 5px 0;"><strong>Username:</strong> ${username}</p>
            <p style="margin: 5px 0;"><strong>Password:</strong> ${password}</p>
          </div>

          <p>Please keep these details secure and change your password after logging in if needed.</p>
          <br />
          <p>Best regards,<br /><strong>Vet and Pets Directory Team</strong></p>
        </div>
      `
    };

    await transporter.sendMail(mailOptions);
    console.log(`Claim details email successfully sent to ${toEmail}`);
  } catch (error) {
    console.error("Error sending claim email:", error);
  }
};

module.exports = sendClaimEmail;