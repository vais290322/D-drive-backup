const express = require("express");
const multer = require("multer");
const { storage } = require("../config/cloudinary");
const upload = multer({ storage });

const {
    createResearchTheme,
    getAllResearchThemes,
    getResearchTheme,
    updateResearchTheme,
    deleteResearchTheme
} = require("../controller/researchThemeController");

const router = express.Router();

router.post("/", upload.single("image"), createResearchTheme);
router.get("/", getAllResearchThemes);
router.get("/:id", getResearchTheme);
router.put("/:id", upload.single("image"), updateResearchTheme);
router.delete("/:id", deleteResearchTheme);

module.exports = router;