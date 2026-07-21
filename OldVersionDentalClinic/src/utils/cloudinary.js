const cloudinary = require("cloudinary").v2;
const dotenv = require("dotenv");

dotenv.config();

// Set the folder name globally
const CLOUDINARY_FOLDER = "doctor";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const uploadOnCloudinary = async (localFilePath) => {
  try {
    if (!localFilePath) {
      return null;
    }

    // Upload the file to Cloudinary, using the global folder name
    const response = await cloudinary.uploader.upload(localFilePath, {
      resource_type: "auto",
      folder: CLOUDINARY_FOLDER,
    });

    return response;
  } catch (error) {
    console.error("Error uploading to Cloudinary:", error);
    return null;
  }
};

module.exports = { uploadOnCloudinary };
