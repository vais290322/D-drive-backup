const express = require("express");
const multer = require("multer");
const { storage } = require("../config/cloudinary");
const upload = multer({ storage });

const {
    addImage,
    getGallery,
    updateImage,
    deleteImage
} = require("../controller/aboutGalleryController");

const router = express.Router();

router.get("/", getGallery);
router.post("/", upload.single("image"), addImage);
router.put("/:imageId", upload.single("image"), updateImage);
router.delete("/:imageId", deleteImage);

module.exports = router;