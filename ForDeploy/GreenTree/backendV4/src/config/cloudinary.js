



const cloudinary = require("cloudinary").v2;
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const multer = require("multer");
const dotenv = require("dotenv");

dotenv.config({ quiet: true });

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Reusable function to create multer upload for different folders
const createCloudinaryUpload = (folder) => {
  return multer({
    storage: new CloudinaryStorage({
      cloudinary,
      params: {
        folder,
        allowed_formats: ["jpg", "png", "jpeg", "webp"],
        // transformation: [{ width: 800, height: 800, crop: "limit" }],
      },
    }),
    // limits: { fileSize: 1 * 1024 * 1024 }, // ✅ Limit file size to 1MB
    fileFilter: (req, file, cb) => {
      const allowedTypes = ["image/jpeg", "image/png", "image/jpg", "image/webp"];
      if (!allowedTypes.includes(file.mimetype)) {
        return cb(new Error(`Invalid file type: ${file.mimetype}. Only JPEG, PNG, and WebP images are allowed.`), false);
      }
      // const maxSize = 1048576;
      // if (file.size > maxSize) {
      //   const fileSizeInMB = (file.size / 1048576).toFixed(2);
      //   return cb(new Error(`File size ${fileSizeInMB}MB exceeds maximum allowed size of 1MB.`), false);
      // }
      cb(null, true);
    },
  });
};

module.exports = { cloudinary, createCloudinaryUpload };

