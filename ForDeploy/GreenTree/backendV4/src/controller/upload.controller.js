const multer = require("multer");
const XLSX = require("xlsx");
const path = require("path");
const Register = require("../models/register.models");
const fs = require("fs");

// Multer setup for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = "uploads/";
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir);
    }
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});
const upload = multer({ storage });

// Middleware for route
exports.uploadMiddleware = upload.single("bulkcustomer");

// Controller to handle file upload and parsing
exports.uploadFile = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    const filePath = req.file.path;
    const ext = path.extname(filePath).toLowerCase();

    let data = [];
    if (ext === ".csv" || ext === ".xlsx" || ext === ".xls") {
      const workbook = XLSX.readFile(filePath);
      const sheetName = workbook.SheetNames[0];
      const sheet = workbook.Sheets[sheetName];
      data = XLSX.utils.sheet_to_json(sheet);
      console.log(data);
    } else {
      // Delete unsupported file
      fs.unlinkSync(filePath);
      return res.status(400).json({ message: "Unsupported file format" });
    }

    // Save each row to Register model
    let savedCount = 0;
    let errors = [];
    for (const row of data) {
      try {
        await Register.create({
          name: row["CUSTOMER NAME"] || "",
          email: row["EMAIL"] || "",
          phone: row["MOBILE NO."] ? String(row["MOBILE NO."]) : "",
          address: row["ADDRESS"] || "",
          street: "",
          city: row["CITY"] || "",
          state: row["STATE"] || "",
          postalCode: row["PINCODE"] ? String(row["PINCODE"]) : "",
          district: "",
          landmark: "",
          isAdmin: true
        });
        savedCount++;
      } catch (err) {
        errors.push({ row, error: err.message });
      }
    }

    // Delete the file after processing
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }

    res.status(200).json({
      message: "File uploaded, parsed, and data saved successfully",
      totalRows: data.length,
      savedCount,
      errors,
    });
  } catch (error) {
    // If file exists, delete it on error
    if (req.file && req.file.path && fs.existsSync(req.file.path)) {
      fs.unlinkSync(req.file.path);
    }
    res.status(500).json({ message: error.message });
  }
};