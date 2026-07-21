const Profile = require("../models/Profile");
const nodemailer = require("nodemailer");
const bcrypt = require("bcrypt");

const sendResetPasswordEmail = async ({ name, email, resetLink }) => {
  const transporter = nodemailer.createTransport({
    host: "smtp.hostinger.com",
    port: 465,
    secure: true,
    auth: {
      user: process.env.HOSTINGER_EMAIL,
      pass: process.env.HOSTINGER_PASSWORD,
    },
  });

  const html = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
  <title>Reset Password</title>
</head>
<body style="margin:0;padding:0;background:#eef2ff;font-family:'Segoe UI',Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#eef2ff;padding:40px 0;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;border-radius:16px;overflow:hidden;box-shadow:0 8px 32px rgba(60,80,180,0.13);">

          <!-- Header -->
          <tr>
            <td style="background:linear-gradient(135deg,#1A3C8F 0%,#3B6FD4 100%);padding:36px 40px;text-align:center;">
              <div style="font-size:28px;font-weight:800;color:#fff;">MIT ELECTRO WORLD</div>
              <div style="font-size:13px;color:#b8cef8;margin-top:6px;letter-spacing:2px;text-transform:uppercase;">
                Password Reset Request
              </div>
            </td>
          </tr>

          <!-- Body -->
          <tr>
            <td style="background:#fff;padding:32px 40px;">
              <p style="margin:0 0 10px;color:#3b4a7a;font-size:15px;font-weight:600;">
                Hello ${name || "User"},
              </p>

              <p style="margin:0 0 20px;color:#555;font-size:14px;line-height:1.7;">
                We received a request to reset your password for your MIT ELECTRO WORLD account.
                Click the button below to set a new password.
              </p>

              <!-- Button -->
              <div style="text-align:center;margin:30px 0;">
                <a href="${resetLink}" 
                   style="background:#3B6FD4;color:#fff;padding:14px 28px;
                          text-decoration:none;border-radius:8px;
                          font-size:14px;font-weight:600;display:inline-block;">
                  Reset Password
                </a>
              </div>

              <p style="margin:0 0 10px;color:#555;font-size:13px;line-height:1.6;">
                This link will expire in a limited time for security reasons.
              </p>

              <p style="margin:0;color:#999;font-size:13px;">
                If you did not request this, please ignore this email.
              </p>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="background:#f0f4ff;padding:20px 40px;text-align:center;border-top:1px solid #DCE3F5;">
              <p style="margin:0;font-size:12px;color:#94a3c2;">
                This is an automated email from <strong>MIT ELECTRO WORLD</strong>.<br/>
                Sent from 
                <a href="mailto:${process.env.HOSTINGER_EMAIL}" style="color:#3b6fd4;text-decoration:none;">
                  ${process.env.HOSTINGER_EMAIL}
                </a>
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>
  `;

  await transporter.sendMail({
    from: `"MIT ELECTRO WORLD" <${process.env.HOSTINGER_EMAIL}>`,
    to: email,
    subject: "Reset Your Password - MIT ELECTRO WORLD",
    html,
  });
};

const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    // console.log(email);
    const profile = await Profile.findOne({ email });
    if (!profile) {
      return res.status(404).json({ message: "Profile not found" });
    }
    if (profile.status !== "approved") {
      return res.status(400).json({ message: "Your profile is not approved yet. Please contact the administrator." });
    }
    const resetLink = `${process.env.BASE_URL}/reset-password/${profile._id}`;
    await sendResetPasswordEmail({ name: profile.full_name, email, resetLink });
    res.status(200).json({ message: "Reset password email sent successfully check your email " });
  } catch (error) {
    // console.log(error);
    res.status(500).json({ message: error.message || "Internal server error" });
  }
};

const resetPassword = async (req, res) => {
  try {
    const { id, password } = req.body;
    const profile = await Profile.findById(id);
    if (!profile) {
      return res.status(404).json({ message: "Profile not found" });
    }
    if(password.length < 6){
      return res.status(400).json({ message: "Password must be at least 6 characters long" });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    await Profile.findByIdAndUpdate(id, {
      password: hashedPassword
    }, { runValidators: false });
    res.status(200).json({ message: "Password reset successfully" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error.message || "Internal server error" });
  }
};

module.exports = { forgotPassword, resetPassword };