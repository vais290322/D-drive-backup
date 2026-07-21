const express = require("express");
const multer = require("multer");
const { storage } = require("../config/cloudinary");
const upload = multer({ storage });

const {
    createTraningTheme,
    getAllTraningThemes,
    getTraningTheme,
    updateTraningTheme,
    deleteTraningTheme
} = require("../controller/traningThemeController");

const router = express.Router();

router.post("/", upload.single("image"), createTraningTheme);
router.get("/", getAllTraningThemes);
router.get("/:id", getTraningTheme);
router.put("/:id", upload.single("image"), updateTraningTheme);
router.delete("/:id", deleteTraningTheme);

module.exports = router;