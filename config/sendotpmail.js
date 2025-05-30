const nodemailer = require("nodemailer");

const sendOtpEmail = async (to, otp) => {
  const transporter = nodemailer.createTransport({
    service: "gmail", // or use "Mailtrap", "SendGrid", etc.
    auth: {
      user: process.env.MAIL_USER,
      pass: process.env.MAIL_PASS, 
    },
  });

  const mailOptions = {
    from: `"Bucci Admin" <${process.env.MAIL_USER}>`,
    to,
    subject: "Your OTP for Password Reset",
    html: `
      <div style="font-family: Arial, sans-serif; padding: 20px; background-color: #f5f5f5;">
        <div style="max-width: 500px; margin: auto; background: #fff; border-radius: 8px; padding: 20px;">
          <h2 style="color: #333;">Hi,</h2>
          <p style="font-size: 16px; color: #444;">Here is your OTP to reset your password. It will expire in <strong>5 minutes</strong>.</p>
          <div style="text-align: center; margin: 20px 0;">
            <span style="font-size: 32px; color: #2c3e50; font-weight: bold;">${otp}</span>
          </div>
          <p style="font-size: 14px; color: #888;">If you didn’t request this, please ignore this email.</p>
          <p style="font-size: 14px; color: #aaa; margin-top: 30px;">— Bucci Team</p>
        </div>
      </div>
    `,
  };

  await transporter.sendMail(mailOptions);
};

module.exports = sendOtpEmail;
