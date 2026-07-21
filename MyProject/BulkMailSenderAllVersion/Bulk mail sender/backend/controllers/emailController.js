import Email from "../models/Email.js";
import MailAccount from "../models/MailAccount.js";
import { decodePassword } from "./mailAccountController.js";
import nodemailer from "nodemailer";
import xlsx from "xlsx";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { dirname } from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Create uploads directory if it doesn't exist
const uploadsDir = path.join(__dirname, "../uploads");
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// Helper: delete a file safely
const deleteFileSafe = (filePath) => {
  try {
    if (filePath && fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }
  } catch (e) {
    console.error("Error deleting file:", filePath, e.message);
  }
};

// Helper: build transporter from MailAccount document
const buildTransporter = (account) => {
  const password = decodePassword(account.encryptedPassword);
  return nodemailer.createTransport({
    host: account.host,
    port: account.port,
    secure: account.secure,
    auth: {
      user: account.email,
      pass: password,
    },
    tls: {
      rejectUnauthorized: false,
    },
  });
};

// ─── Extract Emails from Excel ────────────────────────────────────────────────
export const extractEmails = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: "No file uploaded" });
    }

    const workbook = xlsx.readFile(req.file.path);
    const sheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[sheetName];
    const data = xlsx.utils.sheet_to_json(worksheet);

    // Extract email addresses from the Excel file
    const emails = [];
    data.forEach((row) => {
      Object.values(row).forEach((value) => {
        if (typeof value === "string" && value.includes("@") && value.includes(".")) {
          emails.push(value.trim());
        }
      });
    });

    // Delete the uploaded Excel file after extraction
    deleteFileSafe(req.file.path);

    const uniqueEmails = [...new Set(emails)];

    return res.status(200).json({
      success: true,
      emails: uniqueEmails,
      count: uniqueEmails.length,
    });
  } catch (error) {
    console.error("Error extracting emails:", error);
    // Try to clean up even on error
    if (req.file) deleteFileSafe(req.file.path);
    return res.status(500).json({
      success: false,
      message: "Error extracting emails from Excel file",
      error: error.message,
    });
  }
};

// ─── Send Bulk Emails ─────────────────────────────────────────────────────────
export const sendEmails = async (req, res) => {
  const uploadedFilePaths = [];

  try {
    const { subject, body, recipients, footer, senderAccountId } = req.body;

    if (!subject || !body || !recipients || recipients.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Subject, body, and recipients are required",
      });
    }

    if (!senderAccountId) {
      return res.status(400).json({
        success: false,
        message: "Please select a sender mail account.",
      });
    }

    // Fetch sender account
    const senderAccount = await MailAccount.findOne({
      _id: senderAccountId,
      userId: req.user._id,
    });

    if (!senderAccount) {
      return res.status(404).json({
        success: false,
        message: "Sender mail account not found. Please add one in your profile.",
      });
    }

    // Track uploaded attachment paths for cleanup
    if (req.files && req.files.length > 0) {
      req.files.forEach((f) => uploadedFilePaths.push(f.path));
    }

    // Build dynamic transporter
    const transporter = buildTransporter(senderAccount);

    // Verify transporter
    try {
      await transporter.verify();
    } catch (verifyErr) {
      return res.status(400).json({
        success: false,
        message: `Cannot connect to mail server: ${verifyErr.message}`,
      });
    }

    // Create a new email campaign
    const emailCampaign = new Email({
      userId: req.user ? req.user._id : null,
      subject,
      body,
      footer,
      recipients: recipients.map((email) => ({ email })),
      attachments: req.files
        ? req.files.map((file) => ({
            filename: file.filename,
            path: file.path,
            originalname: file.originalname,
          }))
        : [],
    });

    await emailCampaign.save();

    // Prepare attachments for nodemailer
    const mailAttachments = [];

    if (req.files && req.files.length > 0) {
      req.files.forEach((file) => {
        mailAttachments.push({
          filename: file.originalname,
          path: file.path,
        });
      });
    }

    // Handle logo for signature
    let logoPath = null;

    if (footer && footer.logo && fs.existsSync(footer.logo)) {
      logoPath = footer.logo;
    }

    if (logoPath) {
      mailAttachments.push({
        filename: "company-logo.png",
        path: logoPath,
        cid: "company-logo",
      });
    }

    // Social media icons
    const socialIcons = {
      facebook: path.join(__dirname, "../assets/facebook.png"),
      instagram: path.join(__dirname, "../assets/insta.png"),
      youtube: path.join(__dirname, "../assets/youtube.png"),
      website: path.join(__dirname, "../assets/website.jpeg"),
    };

    Object.entries(socialIcons).forEach(([name, iconPath]) => {
      if (fs.existsSync(iconPath)) {
        mailAttachments.push({
          filename: `${name}-icon.png`,
          path: iconPath,
          cid: `${name}-icon`,
        });
      }
    });

    // Format email body
    const formattedBody = body.replace(/\n/g, "<br>");

    // Build signature HTML — fully dynamic, no hardcoded company names
    const companyName = (footer && footer.name) ? footer.name : '';
    const department  = (footer && footer.depertment) ? footer.depertment : '';
    const address     = (footer && footer.address) ? footer.address : '';
    const phone       = (footer && footer.phone) ? footer.phone : '';
    const fbUrl       = (footer && footer.facebook) ? footer.facebook : '';
    const igUrl       = (footer && footer.instagram) ? footer.instagram : '';
    const ytUrl       = (footer && footer.youtube) ? footer.youtube : '';
    const webUrl      = (footer && footer.website) ? footer.website : '';

    // Only render a social icon link if the URL is provided
    const socialLinksHtml = (fbUrl || igUrl || ytUrl || webUrl) ? `
      <div style="margin-top: 8px;">
        ${fbUrl ? `<a href="${fbUrl}" style="text-decoration:none;margin-right:8px;"><img src="cid:facebook-icon" alt="Facebook" style="width:20px;height:20px;"></a>` : ''}
        ${igUrl ? `<a href="${igUrl}" style="text-decoration:none;margin-right:8px;"><img src="cid:instagram-icon" alt="Instagram" style="width:20px;height:20px;"></a>` : ''}
        ${ytUrl ? `<a href="${ytUrl}" style="text-decoration:none;margin-right:8px;"><img src="cid:youtube-icon" alt="YouTube" style="width:20px;height:20px;"></a>` : ''}
        ${webUrl ? `<a href="${webUrl}" style="text-decoration:none;"><img src="cid:website-icon" alt="Website" style="width:20px;height:20px;"></a>` : ''}
      </div>` : '';

    const signatureHtml = `
      <div style="margin-top:30px;display:flex;align-items:flex-start;">
        ${logoPath ? `<div style="padding-right:15px;"><img src="cid:company-logo" alt="Company Logo" style="max-width:120px;max-height:80px;"></div>` : ''}
        <div style="border-left:2px solid #1282e3;padding-left:15px;font-family:Arial,sans-serif;">
          ${companyName ? `<p style="margin:0;font-weight:bold;color:#1282e3;font-size:16px;">${companyName}</p>` : ''}
          ${department  ? `<p style="margin:2px 0;color:#66bced;font-size:14px;">${department}</p>` : ''}
          ${address     ? `<p style="margin:5px 0;font-size:12px;"><span style="color:#3D628E;">Corp Office:</span> <span style="color:#666;">${address}</span></p>` : ''}
          ${phone       ? `<p style="margin:5px 0;font-size:12px;"><span style="color:#3D628E;">Desk Phone:</span> <span style="color:#1F497D;">${phone}</span></p>` : ''}
          ${socialLinksHtml}
        </div>
      </div>`;


    // Sender display name
    const fromDisplay = `"${(footer && footer.name) || senderAccount.label}" <${senderAccount.email}>`;

    // Send emails to all recipients
    for (const recipient of recipients) {
      try {
        const mailOptions = {
          from: fromDisplay,
          to: recipient,
          subject: subject,
          html: `
            <div style="font-family: Arial, sans-serif; color: #333; line-height: 1.6;">
              <div style="padding: 0 0 20px 0; text-align: left;">
                ${formattedBody.replace(/\r\n/g, '\n').replace(/\r/g, '\n').replace(/\n/g, '<br>')}
              </div>
              <div style="border-top: 1px solid #ddd; padding-top: 15px; text-align: left;">
                ${footer && footer.message
                  ? `<p style="margin: 0 0 15px 0; color: #66bced; font-weight: bold;">${footer.message.replace(/\r\n/g, '\n').replace(/\r/g, '\n').replace(/\n/g, '<br>')}</p>`
                  : `<p style="margin: 0 0 15px 0; color: #66bced; font-weight: bold;">With Best Regards,</p>`}
                ${signatureHtml}
              </div>
            </div>
          `.replace(/\r\n/g, '\n').replace(/\r/g, '\n'),
          attachments: mailAttachments,
        };

        await transporter.sendMail(mailOptions);

        await Email.updateOne(
          { _id: emailCampaign._id, "recipients.email": recipient },
          { $set: { "recipients.$.status": "sent" } }
        );
      } catch (error) {
        console.error(`Error sending email to ${recipient}:`, error);

        await Email.updateOne(
          { _id: emailCampaign._id, "recipients.email": recipient },
          {
            $set: {
              "recipients.$.status": "failed",
              "recipients.$.error": error.message,
            },
          }
        );
      }
    }

    // ── POST-SEND CLEANUP: delete uploaded attachment files ──
    uploadedFilePaths.forEach((filePath) => deleteFileSafe(filePath));

    return res.status(200).json({
      success: true,
      message: "Email campaign started",
      campaignId: emailCampaign._id,
    });
  } catch (error) {
    console.error("Error sending emails:", error);
    // Clean up uploads even on error
    uploadedFilePaths.forEach((filePath) => deleteFileSafe(filePath));
    return res.status(500).json({
      success: false,
      message: "Error sending emails",
      error: error.message,
    });
  }
};

// ─── Get All Campaigns ────────────────────────────────────────────────────────
export const getCampaigns = async (req, res) => {
  try {
    const filter = req.user ? { userId: req.user._id } : {};
    const campaigns = await Email.find(filter).sort({ createdAt: -1 });
    return res.status(200).json({
      success: true,
      campaigns,
    });
  } catch (error) {
    console.error("Error fetching campaigns:", error);
    return res.status(500).json({
      success: false,
      message: "Error fetching campaigns",
      error: error.message,
    });
  }
};

// ─── Get Campaign By ID ───────────────────────────────────────────────────────
export const getCampaignById = async (req, res) => {
  try {
    const campaign = await Email.findById(req.params.id);

    if (!campaign) {
      return res.status(404).json({
        success: false,
        message: "Campaign not found",
      });
    }

    return res.status(200).json({
      success: true,
      campaign,
    });
  } catch (error) {
    console.error("Error fetching campaign details:", error);
    return res.status(500).json({
      success: false,
      message: "Error fetching campaign details",
      error: error.message,
    });
  }
};
