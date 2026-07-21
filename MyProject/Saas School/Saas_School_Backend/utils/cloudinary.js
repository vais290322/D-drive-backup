// utils/cloudinary.js

import { v2 as cloudinary } from "cloudinary";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import multer from "multer";
import dotenv from "dotenv";

dotenv.config();

// 1. Configure Cloudinary credentials
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// 2. Create storage with dynamic resource_type based on MIME
const storage = new CloudinaryStorage({
  cloudinary,
  params: (req, file) => {
    const mime = file.mimetype;
    let resource_type; 

    if (mime.startsWith("image/")) {
      resource_type = "image";
    } else if (mime.startsWith("video/")) {
      resource_type = "video";
    } else {
      resource_type = "raw";
    }

    return {
      folder: "saas_school", // change to your folder
      resource_type, // image | video | raw
      // you can optionally restrict formats:
      // allowed_formats: resource_type === 'image'
      //   ? ['jpg','jpeg','png','gif']
      //   : resource_type === 'video'
      //     ? ['mp4','mov','avi']
      //     : ['pdf','doc','docx','xls','xlsx','ppt','pptx'],
    };
  },
});

// 3. Create multer upload middleware
export const upload = multer({
  storage,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB max file size
  },
});

// 4. Optionally export cloudinary if you want to call uploader directly
export { cloudinary };
