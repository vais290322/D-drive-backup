import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: { 
    user: process.env.SMTP_USER, 
    pass: process.env.SMTP_PASS 
  }
});

export async function sendResetPasswordHtmlEmail(to, role, resetLink) {
  const from =process.env.SMTP_USER;
  const html = `
    <h2>Password Reset</h2>
    <p>You requested a password reset.</p>
    <p>Click the link below to reset your password:</p>
    <p><a href="${resetLink}" target="_blank">Click Here</a></p>
    <p>This link expires in 1 hour.</p>
  `;
  await transporter.sendMail({ from, to, subject: 'Reset your password', html });
}

export async function sendPasswordResetConfirmationEmail(to, fullName) {
  const from =process.env.SMTP_USER;
  await transporter.sendMail({
    from, to,
    subject: 'Your password has been changed',
    text: `Hello ${fullName || 'MRS'}, your password has been changed successfully.`
  });
}