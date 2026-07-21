import { companyDetails } from "../config/credentials.js";

const registrationSuccessTemplate = ({ customerDetails }) => {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Registration Successful</title>
</head>
<body style="margin:0;padding:0;background:#f5f5f5;font-family:'Helvetica Neue',Helvetica,Arial,sans-serif;color:#111111;">

  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f5f5f5;">
    <tr>
      <td align="center" style="padding:48px 16px;">

        <table width="560" cellpadding="0" cellspacing="0" style="background:#ffffff;border-top:3px solid #111111;">

          <!-- Header -->
          <tr>
            <td style="padding:36px 40px 24px 40px;border-bottom:1px solid #e8e8e8;">
              <p style="margin:0;font-size:11px;letter-spacing:2px;text-transform:uppercase;color:#888888;">${companyDetails.name}</p>
              <h1 style="margin:8px 0 0 0;font-size:22px;font-weight:700;letter-spacing:-0.3px;">Registration Confirmed</h1>
            </td>
          </tr>

          <!-- Body -->
          <tr>
            <td style="padding:28px 40px;font-size:14px;line-height:1.7;color:#333333;">

              <p style="margin:0 0 20px 0;">
                Dear <strong>${customerDetails.name || "Valued Customer"}</strong>,
              </p>
              <p style="margin:0 0 28px 0;">
                Your account has been created successfully. Below are your registration details. Please save your <strong>User ID</strong> — you will need it to login.
              </p>

              <!-- Details Table -->
              <table width="100%" cellpadding="0" cellspacing="0" style="border:1px solid #e8e8e8;font-size:13.5px;">
                <tr style="background:#f9f9f9;">
                  <td style="padding:11px 16px;border-bottom:1px solid #e8e8e8;color:#666666;width:38%;font-weight:600;">User ID</td>
                  <td style="padding:11px 16px;border-bottom:1px solid #e8e8e8;font-family:monospace;font-size:14px;font-weight:700;">${customerDetails.userId || "—"}</td>
                </tr>
                <tr>
                  <td style="padding:11px 16px;border-bottom:1px solid #e8e8e8;color:#666666;font-weight:600;">Party Name</td>
                  <td style="padding:11px 16px;border-bottom:1px solid #e8e8e8;">${customerDetails.name || "—"}</td>
                </tr>
                <tr style="background:#f9f9f9;">
                  <td style="padding:11px 16px;border-bottom:1px solid #e8e8e8;color:#666666;font-weight:600;">Phone</td>
                  <td style="padding:11px 16px;border-bottom:1px solid #e8e8e8;">${customerDetails.phone1 || "—"}</td>
                </tr>
                <tr>
                  <td style="padding:11px 16px;border-bottom:1px solid #e8e8e8;color:#666666;font-weight:600;">Address</td>
                  <td style="padding:11px 16px;border-bottom:1px solid #e8e8e8;">${customerDetails.address || "—"}</td>
                </tr>
                <tr style="background:#f9f9f9;">
                  <td style="padding:11px 16px;border-bottom:1px solid #e8e8e8;color:#666666;font-weight:600;">GSTIN</td>
                  <td style="padding:11px 16px;border-bottom:1px solid #e8e8e8;">${customerDetails.GSTIN || "—"}</td>
                </tr>
                <tr>
                  <td style="padding:11px 16px;color:#666666;font-weight:600;">Drug License No.</td>
                  <td style="padding:11px 16px;">${customerDetails.DlNo || "—"}</td>
                </tr>
              </table>

              <p style="margin:28px 0 0 0;font-size:13px;color:#555555;">
                If you have any questions, feel free to reach out to us. We look forward to serving you.
              </p>

            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="padding:20px 40px;border-top:1px solid #e8e8e8;background:#f9f9f9;">
              <p style="margin:0;font-size:12px;color:#888888;line-height:1.7;">
                <strong style="color:#111111;">${companyDetails.name}</strong><br/>
                ${companyDetails.address || ""}<br/>
                ${companyDetails.gstin ? `GSTIN: ${companyDetails.gstin}` : ""}
                ${companyDetails.dlNo ? `&nbsp;&nbsp;|&nbsp;&nbsp;DL No: ${companyDetails.dlNo}` : ""}
              </p>
            </td>
          </tr>

        </table>

      </td>
    </tr>
  </table>

</body>
</html>`;
};

export default registrationSuccessTemplate;
