import nodemailer from "nodemailer";

/**
 * Sends a beautiful party registration email to the admin with all submitted data.
 * @param {Object} data - The party registration data from req.body
 */
export const sendPartyRegistrationEmail = async (data) => {
  const transporter = nodemailer.createTransport({
    host: "smtp.hostinger.com",
    port: 465,
    secure: true,
    auth: {
      user: process.env.HOSTINGER_EMAIL,
      pass: process.env.HOSTINGER_PASSWORD,
    },
  });

  const {
    name,
    email,
    phone,
    establishmentName,
    incorporationDate,
    tradeLicenseNumber,
    drugLicenseNumber,
    panLicenseNumber,
    gstLicenseNumber,
    margId,
    addressLine1,
    addressLine2,
    city,
    postOffice,
    policeStation,
    pinNumber,
    district,
    country,
    contactPersonName,
    contactPersonPhone,
  } = data;

  const row = (label, value) =>
    value
      ? `<tr>
          <td style="padding:10px 16px;background:#f0f4ff;font-weight:600;color:#3b4a7a;width:40%;border-bottom:1px solid #dce3f5;font-size:13.5px;">${label}</td>
          <td style="padding:10px 16px;color:#222;border-bottom:1px solid #dce3f5;font-size:13.5px;">${value}</td>
        </tr>`
      : "";

  const html = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
  <title>New Party Registration</title>
</head>
<body style="margin:0;padding:0;background:#eef2ff;font-family:'Segoe UI',Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#eef2ff;padding:40px 0;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;border-radius:16px;overflow:hidden;box-shadow:0 8px 32px rgba(60,80,180,0.13);">

          <!-- Header -->
          <tr>
            <td style="background:linear-gradient(135deg,#1a3c8f 0%,#3b6fd4 100%);padding:36px 40px;text-align:center;">
              <div style="font-size:28px;font-weight:800;color:#fff;letter-spacing:1px;">DS PHARMA</div>
              <div style="font-size:13px;color:#b8cef8;margin-top:4px;letter-spacing:2px;text-transform:uppercase;">New Party Registration</div>
              <div style="margin-top:16px;display:inline-block;background:rgba(255,255,255,0.15);border-radius:50px;padding:6px 22px;">
                <span style="font-size:13px;color:#fff;">📋 Registration Request Received</span>
              </div>
            </td>
          </tr>

          <!-- Body -->
          <tr>
            <td style="background:#fff;padding:32px 40px;">
              <p style="margin:0 0 8px;color:#3b4a7a;font-size:15px;font-weight:600;">Hello Admin,</p>
              <p style="margin:0 0 24px;color:#555;font-size:14px;line-height:1.7;">
                A new party registration request has been submitted. Please find the complete details below.
              </p>

              <!-- Personal Info -->
              <div style="font-size:12px;font-weight:700;color:#6c82c9;letter-spacing:1.5px;text-transform:uppercase;margin-bottom:8px;padding-left:4px;">👤 Personal Information</div>
              <table width="100%" cellpadding="0" cellspacing="0" style="border-radius:10px;overflow:hidden;border:1px solid #dce3f5;margin-bottom:24px;">
                ${row("Full Name", name)}
                ${row("Email Address", email)}
                ${row("Phone Number", phone)}
                ${row("Contact Person", contactPersonName)}
                ${row("Contact Person Phone", contactPersonPhone)}
              </table>

              <!-- Business Info -->
              <div style="font-size:12px;font-weight:700;color:#6c82c9;letter-spacing:1.5px;text-transform:uppercase;margin-bottom:8px;padding-left:4px;">🏢 Business Information</div>
              <table width="100%" cellpadding="0" cellspacing="0" style="border-radius:10px;overflow:hidden;border:1px solid #dce3f5;margin-bottom:24px;">
                ${row("Establishment Name", establishmentName)}
                ${row("Incorporation Date", incorporationDate)}
                ${row("Marg ID", margId)}
              </table>

              <!-- License Info -->
              <div style="font-size:12px;font-weight:700;color:#6c82c9;letter-spacing:1.5px;text-transform:uppercase;margin-bottom:8px;padding-left:4px;">📄 License & Registration Numbers</div>
              <table width="100%" cellpadding="0" cellspacing="0" style="border-radius:10px;overflow:hidden;border:1px solid #dce3f5;margin-bottom:24px;">
                ${row("Trade License No.", tradeLicenseNumber)}
                ${row("Drug License No.", drugLicenseNumber)}
                ${row("PAN Number", panLicenseNumber)}
                ${row("GST Number", gstLicenseNumber)}
              </table>

              <!-- Address Info -->
              <div style="font-size:12px;font-weight:700;color:#6c82c9;letter-spacing:1.5px;text-transform:uppercase;margin-bottom:8px;padding-left:4px;">📍 Address Details</div>
              <table width="100%" cellpadding="0" cellspacing="0" style="border-radius:10px;overflow:hidden;border:1px solid #dce3f5;margin-bottom:24px;">
                ${row("Address Line 1", addressLine1)}
                ${row("Address Line 2", addressLine2)}
                ${row("City", city)}
                ${row("Post Office", postOffice)}
                ${row("Police Station", policeStation)}
                ${row("Pin Number", pinNumber)}
                ${row("District", district)}
                ${row("Country", country)}
              </table>

              <p style="margin:0;color:#888;font-size:13px;">Please review and take appropriate action on this registration.</p>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="background:#f0f4ff;padding:20px 40px;text-align:center;border-top:1px solid #dce3f5;">
              <p style="margin:0;font-size:12px;color:#94a3c2;">
                This is an automated email from <strong>DS Pharma Portal</strong>.<br/>
                Sent from <a href="mailto:${process.env.HOSTINGER_EMAIL}" style="color:#3b6fd4;text-decoration:none;">${process.env.HOSTINGER_EMAIL}</a>
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
    from: `"DS Pharma Portal" <${process.env.HOSTINGER_EMAIL}>`,
    to: "dscommunication3@gmail.com",
    subject: `🏪 New Party Registration — ${name || "Unknown"}`,
    html,
  });
};
