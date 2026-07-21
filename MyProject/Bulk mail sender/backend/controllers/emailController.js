import Email from "../models/Email.js";
import nodemailer from "nodemailer";
import xlsx from "xlsx";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { dirname } from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Replace the existing transporter configuration with this:

// Configure nodemailer transporter
// Fix the password by removing spaces
const transporter = nodemailer.createTransport({
  host: "smtpout.secureserver.net",
  port: 465,
  secure: true,
  auth: {
    user: "info@vais.co.in",
    pass: "2027@Webbixel",
  },
  tls: {
    rejectUnauthorized: false
  },
  debug: true, // Enable debugging
});

// Make sure to verify the connection
transporter.verify(function (error, success) {
  if (error) {
    console.log("Transporter verification error:", error);
  } else {
    console.log("Server is ready to take our messages");
  }
});

// Create uploads directory if it doesn't exist
const uploadsDir = path.join(__dirname, "../uploads");
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// Extract emails from Excel file
export const extractEmails = async (req, res) => {
  try {
    if (!req.file) {
      return res
        .status(400)
        .json({ success: false, message: "No file uploaded" });
    }

    const workbook = xlsx.readFile(req.file.path);
    const sheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[sheetName];
    const data = xlsx.utils.sheet_to_json(worksheet);

    // Extract email addresses from the Excel file
    const emails = [];
    data.forEach((row) => {
      // Look for columns that might contain email addresses
      Object.values(row).forEach((value) => {
        if (
          typeof value === "string" &&
          value.includes("@") &&
          value.includes(".")
        ) {
          emails.push(value.trim());
        }
      });
    });

    // Remove duplicates
    const uniqueEmails = [...new Set(emails)];

    return res.status(200).json({
      success: true,
      emails: uniqueEmails,
      count: uniqueEmails.length,
    });
  } catch (error) {
    console.error("Error extracting emails:", error);
    return res.status(500).json({
      success: false,
      message: "Error extracting emails from Excel file",
      error: error.message,
    });
  }
};

// Send bulk emails
// In the sendEmails function, add logging to see what's coming in
export const sendEmails = async (req, res) => {
  try {
    const { subject, body, recipients, footer } = req.body;

    if (!subject || !body || !recipients || recipients.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Subject, body, and recipients are required",
      });
    }

    // Create a new email campaign
    const emailCampaign = new Email({
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

    // Fix the logo path handling
    const defaultLogoPath = path.join(__dirname, "../assets/vais-logo.png");
    let logoPath = null;

    // First check if default logo exists and use it
    if (fs.existsSync(defaultLogoPath)) {
      logoPath = defaultLogoPath;
    }

    // Then check if a custom logo was provided
    if (footer.logo && fs.existsSync(footer.logo)) {
      logoPath = footer.logo;
    }

    // Add logo to attachments if a valid path exists
    if (logoPath) {
      mailAttachments.push({
        filename: "company-logo.png",
        path: logoPath,
        cid: "company-logo",
      });
    }

    // Add social media icons - MOVED HERE AFTER mailAttachments is defined
    const socialIcons = {
      facebook: path.join(__dirname, "../assets/facebook.png"),
      instagram: path.join(__dirname, "../assets/insta.png"),
      youtube: path.join(__dirname, "../assets/youtube.png"),
      website: path.join(__dirname, "../assets/website.jpeg"),
    };

    // Check which social icons exist and add them to attachments
    Object.entries(socialIcons).forEach(([name, iconPath]) => {
      if (fs.existsSync(iconPath)) {
        console.log(`${name} icon found at: ${iconPath}`);
        mailAttachments.push({
          filename: `${name}-icon.png`,
          path: iconPath,
          cid: `${name}-icon`,
        });
      } else {
        console.log(`${name} icon NOT found at: ${iconPath}`);
      }
    });

    // Format the email body to preserve line breaks
    const formattedBody = body.replace(/\n/g, "<br>");

    // Create a more professional signature like in the examples
    let signatureHtml = "";

    // New signature layout with logo on left and vertical border
    // Update the signatureHtml creation to use a more compact format with normalized line endings
    signatureHtml = `<div style="margin-top: 30px; display: flex; align-items: flex-start;">${logoPath ? `<div style="padding-right: 15px;"><img src="cid:company-logo" alt="Company Logo" style="max-width: 120px; max-height: 80px;"></div>` : ''}<div style="border-left: 2px solid #1282e3; padding-left: 15px; font-family: Arial, sans-serif;"><p style="margin: 0; font-weight: bold; color: #1282e3; font-size: 16px;">${footer.name || "VAIS ENGINEERING PVT LTD"}</p>${footer.depertment ? `<p style="margin: 2px 0; color: #66bced; font-size: 14px;">${footer.depertment}</p>` : ''}<p style="margin: 5px 0; font-weight: bold; color:#1282e3; font-size: 12px;">VAIS Engineering Private Limited.</p>${footer.address ? `<p style="margin: 5px 0; font-size: 12px;"><span style="color: #3D628E;">Corp Office:</span> <span style="color:#666;">${footer.address}</span></p>` : `<p style="margin: 5px 0; font-size: 12px;"><span style="color: #3D628E;">Corp Office:</span> <span style="color:#666;">Deganga, Taki Road, 24 Parganas (north), West Bengal – 743423</span></p>`}${footer.phone ? `<p style="margin: 5px 0; font-size: 12px;"><span style="color: #3D628E;">Desk Phone:</span> <span style="color:#1F497D;">${footer.phone}</span></p>` : `<p style="margin: 5px 0; font-size: 12px;"><span style="color: #3D628E;">Desk Phone:</span> <span style="color:#1F497D;">+91(0)3217385302 | Mo: +918240037238</span></p>`}<div style="margin-top: 8px;"><a href="https://www.facebook.com/VAISEngg/" style="text-decoration: none; margin-right: 8px;"><img src="cid:facebook-icon" alt="Facebook" style="width: 20px; height: 20px;"></a><a href="https://www.instagram.com/vais_engineering/" style="text-decoration: none; margin-right: 8px;"><img src="cid:instagram-icon" alt="Instagram" style="width: 20px; height: 20px;"></a><a href="https://www.youtube.com/@vaisengineeringprivatelimi8837" style="text-decoration: none; margin-right: 8px;"><img src="cid:youtube-icon" alt="YouTube" style="width: 20px; height: 20px;"></a><a href="https://vais.co.in" style="text-decoration: none;"><img src="cid:website-icon" alt="Website" style="width: 20px; height: 20px;"></a></div></div></div>`.replace(/\r\n/g, '').replace(/\n/g, '').replace(/\s+/g, ' ');

    // Send emails to all recipients
    for (const recipient of recipients) {
      try {
        // In your emailController.js file, find the sendEmails function and update the HTML content
        
        // When creating the HTML for the email, normalize line endings
        const mailOptions = {
          from: `"VAIS Engineering Pvt Ltd" <info@vais.co.in>`,
          to: recipient,
          subject: subject,
          html: `
            <div style="font-family: Arial, sans-serif; color: #333; line-height: 1.6;">
              <div style="padding: 0 0 20px 0; text-align: left;">
                ${formattedBody.replace(/\r\n/g, '\n').replace(/\r/g, '\n').replace(/\n/g, '<br>')}
              </div>
              <div style="border-top: 1px solid #ddd; padding-top: 15px; text-align: left;">
                ${footer.message ? 
                  `<p style="margin: 0 0 15px 0; color: #66bced; font-weight: bold;">${footer.message.replace(/\r\n/g, '\n').replace(/\r/g, '\n').replace(/\n/g, '<br>')}</p>` : 
                  `<p style="margin: 0 0 15px 0; color: #66bced; font-weight: bold;">With Best Regards,</p>`}
                ${signatureHtml}
              </div>
            </div>
          `.replace(/\r\n/g, '\n').replace(/\r/g, '\n'),
          attachments: mailAttachments,
        };

        await transporter.sendMail(mailOptions);

        // Update recipient status to sent
        await Email.updateOne(
          { _id: emailCampaign._id, "recipients.email": recipient },
          { $set: { "recipients.$.status": "sent" } }
        );
      } catch (error) {
        console.error(`Error sending email to ${recipient}:`, error);

        // Update recipient status to failed
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

    return res.status(200).json({
      success: true,
      message: "Email campaign started",
      campaignId: emailCampaign._id,
    });
  } catch (error) {
    console.error("Error sending emails:", error);
    return res.status(500).json({
      success: false,
      message: "Error sending emails",
      error: error.message,
    });
  }
};

// Get all email campaigns
export const getCampaigns = async (req, res) => {
  try {
    const campaigns = await Email.find().sort({ createdAt: -1 });
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

// Get campaign details by ID
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
