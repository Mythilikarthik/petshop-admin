require("dotenv").config();
const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.SMTP_USER, // Your email address
    pass: process.env.SMTP_PASS  // Your email App Password
  }
});

const sendOtpEmail = async ({ email, name, otp }) => {
  try {
    const logoUrl = "https://www.vetandpets.in/images/logo.png";

    const mailOptions = {
      from: `"Vet and Pets" <${process.env.SMTP_USER}>`,
      to: email,
      subject: `${otp} is your verification code for VetandPets`,
      text: `Welcome to VetandPets!

Thank you for registering your business.

Verification Code:
${otp}

This OTP is valid for 10 minutes.

What happens next?
- Complete registration
- Admin review
- Listing goes live after approval

Need help?
care@vetandpets.in`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #e0e0e0; border-radius: 8px; padding: 30px; background-color: #ffffff; color: #333333; line-height: 1.6;">
          
          <!-- Logo -->
          <div style="text-align: center; margin-bottom: 20px;">
            <img src="${logoUrl}" alt="VetandPets Logo" style="max-width: 150px; height: auto;" />
          </div>

          <!-- Main Heading -->
          <h2 style="color: #2c3e50; text-align: center; margin-bottom: 10px;">
            Welcome to VetandPets!
          </h2>

          <p style="font-size: 15px; text-align: center; color: #555555; margin-bottom: 25px;">
            Thank you for registering your business.
          </p>

          <!-- Verification Code Box -->
          <div style="background-color: #f8f9fa; border: 1px dashed #007bff; border-radius: 8px; padding: 20px; text-align: center; margin: 25px 0;">
            <p style="font-size: 14px; text-transform: uppercase; letter-spacing: 1px; color: #666666; margin: 0 0 10px 0;">
              Verification Code
            </p>
            <span style="font-size: 32px; font-weight: bold; letter-spacing: 6px; color: #007bff; display: inline-block;">
              ${otp}
            </span>
          </div>

          <p style="font-size: 13px; color: #777777; text-align: center; margin-bottom: 25px;">
            This OTP is valid for 10 minutes.
          </p>

          <hr style="border: none; border-top: 1px solid #eeeeee; margin: 25px 0;" />

          <!-- What Happens Next Section -->
          <p style="font-size: 15px; font-weight: bold; color: #2c3e50; margin-bottom: 10px;">
            What happens next?
          </p>

          <ul style="list-style-type: disc; padding-left: 20px; font-size: 14px; color: #555555; line-height: 1.8; margin-top: 5px;">
            <li>Complete registration</li>
            <li>Admin review</li>
            <li>Listing goes live after approval</li>
          </ul>

          <hr style="border: none; border-top: 1px solid #eeeeee; margin: 25px 0;" />

          <!-- Need Help Section -->
          <p style="font-size: 14px; margin-bottom: 5px;">
            <strong>Need help?</strong>
          </p>
          <p style="font-size: 14px; margin-top: 0;">
            <a href="mailto:care@vetandpets.in" style="color: #007bff; text-decoration: none;">care@vetandpets.in</a>
          </p>

        </div>
      `
    };

    await transporter.sendMail(mailOptions);
    console.log(`OTP email successfully sent to ${email}`);
  } catch (error) {
    console.error("Error sending OTP email via Nodemailer:", error);
    throw new Error("Failed to send OTP email");
  }
};

module.exports = sendOtpEmail;