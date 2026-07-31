require("dotenv").config();
const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS
  }
});

const sendResetPasswordEmail = async ({ to_email, reset_link }) => {
  try {
    const mailOptions = {
      from: `"Vet and Pets Directory" <${process.env.SMTP_USER}>`,
      to: to_email,
      subject: "Password Reset Request",
      text: `Hello,\n\nYou requested a password reset. Please use the following link to reset your password:\n\n${reset_link}\n\nIf you did not request this, please ignore this email.\n\nBest regards,\nVet and Pets Directory Team`,
      html: `
        <div style="font-family: Arial, sans-serif; padding: 20px; color: #333; max-width: 600px; border: 1px solid #e0e0e0; border-radius: 8px;">
          <h2 style="color: #dc3545; text-align: center;">Reset Your Password</h2>
          <p>Hello,</p>
          <p>We received a request to reset your password. Click the button below to proceed:</p>
          
          <div style="text-align: center; margin: 30px 0;">
            <a href="${reset_link}" style="background-color: #dc3545; color: #ffffff; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: bold; display: inline-block;">
              Reset Password
            </a>
          </div>

          <p style="font-size: 13px; color: #666;">Or copy and paste this link into your browser:</p>
          <p style="font-size: 12px; color: #007bff; word-break: break-all;">${reset_link}</p>
          
          <br />
          <hr style="border: none; border-top: 1px solid #eee;" />
          <p style="font-size: 12px; color: #888;">If you didn't request a password reset, you can safely ignore this email.</p>
        </div>
      `
    };

    await transporter.sendMail(mailOptions);
    console.log(`Password reset email successfully sent to ${to_email}`);
  } catch (error) {
    console.error("Error sending password reset email:", error);
    throw new Error("Failed to send password reset email");
  }
};

module.exports = sendResetPasswordEmail;