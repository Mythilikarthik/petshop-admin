// require("dotenv").config();
// const nodemailer = require("nodemailer");

// const transporter = nodemailer.createTransport({
//   service: "gmail",
//   auth: {
//     user: process.env.SMTP_USER,
//     pass: process.env.SMTP_PASS
//   }
// });

// const sendWelcomeEmail = async ({ name, shop_name, email }) => {
//   try {
//     const mailOptions = {
//       from: `"Vet and Pets Directory" <${process.env.SMTP_USER}>`,
//       to: email,
//       subject: `Welcome to Vet and Pets Directory, ${name}! 🎉`,
//       text: `Hello ${name},\n\nWelcome to Vet and Pets Directory! We're excited to have "${shop_name || 'Your Pet Business'}" on board.\n\nThank you for registering with us!\n\nBest regards,\nVet and Pets Directory Team`,
//       html: `
//         <div style="font-family: Arial, sans-serif; padding: 20px; color: #333; max-width: 600px; border: 1px solid #e0e0e0; border-radius: 8px;">
//           <h2 style="color: #28a745; text-align: center;">Welcome Onboard! 🎉</h2>
//           <p>Hello <strong>${name}</strong>,</p>
//           <p>Welcome to <strong>Vet and Pets Directory</strong>! We are thrilled to have you and <strong>${shop_name || "Your Pet Business"}</strong> as part of our community.</p>
          
//           <p>Your account is set up and ready to go. You can now manage your listing, update your details, and connect with customers easily.</p>

//           <br />
//           <hr style="border: none; border-top: 1px solid #eee;" />
//           <p style="font-size: 12px; color: #888;">Best regards,<br /><strong>Vet and Pets Directory Team</strong></p>
//         </div>
//       `
//     };

//     await transporter.sendMail(mailOptions);
//     console.log(`Welcome email successfully sent to ${email}`);
//   } catch (error) {
//     console.error("Error sending welcome email:", error);
//   }
// };

// module.exports = sendWelcomeEmail;
require("dotenv").config();
const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS
  }
});

const sendWelcomeEmail = async ({ name, shop_name, email }) => {
  try {
    const logoUrl = "https://www.vetandpets.in/images/logo.png"; // 👈 Replace with your actual hosted logo URL

    const mailOptions = {
      from: `"Vet and Pets" <${process.env.SMTP_USER}>`,
      to: email,
      subject: `Welcome to Vet and Pets, ${name}!`,
      text: `Welcome to Vet and Pets!

Your account has been created successfully.

You can now:
- Explore verified businesses across India
- Build your personal list of trusted pet providers
- Stay updated with exclusive offers and events
- Learn from reviews shared by pet parents
- Give your furry friends the care they deserve

Start Exploring:
https://www.vetandpets.in

Need Help?
care@vetandpets.in

Team VetandPets
All your pet needs, in one place.`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #e0e0e0; border-radius: 8px; padding: 30px; background-color: #ffffff; color: #333333; line-height: 1.6;">
          
          <!-- Logo -->
          <div style="text-align: center; margin-bottom: 20px;">
            <img src="${logoUrl}" alt="Vet and Pets Logo" style="max-width: 150px; height: auto;" />
          </div>

          <!-- Main Heading -->
          <h2 style="color: #2c3e50; text-align: center; margin-bottom: 20px;">
            Welcome to Vet and Pets!
          </h2>

          <p style="font-size: 16px;">
            Your account has been created successfully.
          </p>

          <p style="font-size: 16px; font-weight: bold; margin-top: 20px;">
            You can now:
          </p>

          <!-- List -->
          <ul style="list-style-type: disc; padding-left: 20px; font-size: 15px; color: #555555;">
            <li style="margin-bottom: 8px;">Explore verified businesses across India</li>
            <li style="margin-bottom: 8px;">Build your personal list of trusted pet providers</li>
            <li style="margin-bottom: 8px;">Stay updated with exclusive offers and events</li>
            <li style="margin-bottom: 8px;">Learn from reviews shared by pet parents</li>
            <li style="margin-bottom: 8px;">Give your furry friends the care they deserve</li>
          </ul>

          <hr style="border: none; border-top: 1px solid #eeeeee; margin: 25px 0;" />

          <!-- CTA Section -->
          <div style="text-align: center; margin: 20px 0;">
            <p style="font-size: 16px; font-weight: bold; margin-bottom: 10px;">Start Exploring:</p>
            <a href="https://www.vetandpets.in" target="_blank" style="display: inline-block; background-color: #007bff; color: #ffffff; text-decoration: none; padding: 10px 20px; border-radius: 5px; font-weight: bold;">
              https://www.vetandpets.in
            </a>
          </div>

          <hr style="border: none; border-top: 1px solid #eeeeee; margin: 25px 0;" />

          <!-- Footer / Support -->
          <p style="font-size: 14px; margin-bottom: 5px;">
            <strong>Need Help?</strong>
          </p>
          <p style="font-size: 14px; margin-top: 0;">
            <a href="mailto:care@vetandpets.in" style="color: #007bff; text-decoration: none;">care@vetandpets.in</a>
          </p>

          <div style="margin-top: 30px; font-size: 14px; color: #666666;">
            <p style="margin: 0; font-weight: bold;">Team VetandPets</p>
            <p style="margin: 0; font-style: italic;">All your pet needs, in one place.</p>
          </div>

        </div>
      `
    };

    await transporter.sendMail(mailOptions);
    console.log(`Welcome email successfully sent to ${email}`);
  } catch (error) {
    console.error("Error sending welcome email:", error);
  }
};

module.exports = sendWelcomeEmail;