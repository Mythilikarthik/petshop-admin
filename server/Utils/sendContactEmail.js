require("dotenv").config();
const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS
  }
});

const sendContactEmail = async ({ title, name, email, phone, message, admin_email }) => {
  try {
    const mailOptions = {
      from: `"Vet and Pets Directory" <${process.env.SMTP_USER}>`,
      to: admin_email, // Send inquiry to the admin or shop owner
      replyTo: email,  // Clicking reply will go directly to the sender's email
      subject: title || `New Contact Message from ${name}`,
      text: `You received a new contact message.\n\nFrom: ${name}\nEmail: ${email}\nPhone: ${phone || 'N/A'}\n\nMessage:\n${message}\n\nBest regards,\nVet and Pets Directory Team`,
      html: `
        <div style="font-family: Arial, sans-serif; padding: 20px; color: #333; max-width: 600px; border: 1px solid #e0e0e0; border-radius: 8px;">
          <h2 style="color: #007bff; text-align: center;">New Contact Message</h2>
          <p><strong>Subject:</strong> ${title || 'Inquiry'}</p>
          <hr style="border: none; border-top: 1px solid #eee;" />
          
          <p><strong>Sender Name:</strong> ${name}</p>
          <p><strong>Sender Email:</strong> <a href="mailto:${email}">${email}</a></p>
          <p><strong>Phone Number:</strong> ${phone || 'Not provided'}</p>
          
          <div style="margin: 20px 0; padding: 15px; background-color: #f8f9fa; border-left: 4px solid #007bff; border-radius: 4px;">
            <p style="margin: 0; font-weight: bold;">Message:</p>
            <p style="margin-top: 5px; white-space: pre-wrap;">${message}</p>
          </div>

          <br />
          <hr style="border: none; border-top: 1px solid #eee;" />
          <p style="font-size: 12px; color: #888;">This message was generated from your directory contact form. You can reply directly to this email to respond to ${name}.</p>
        </div>
      `
    };

    await transporter.sendMail(mailOptions);
    console.log(`Contact email successfully sent to ${admin_email}`);
  } catch (error) {
    console.error("Error sending contact email:", error);
    throw new Error("Failed to send contact email");
  }
};

module.exports = sendContactEmail;