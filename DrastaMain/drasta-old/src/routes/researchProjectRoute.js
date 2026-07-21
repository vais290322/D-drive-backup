const express = require("express");
const multer = require("multer");
const { storage } = require("../config/cloudinary");
const upload = multer({ storage });

const {
    createResearchProject,
    getAllResearchProjects,
    getResearchProject,
    updateResearchProject,
    deleteResearchProject
} = require("../controller/researchProjectController");

const router = express.Router();

router.post("/", upload.single("image"), createResearchProject);
router.get("/", getAllResearchProjects);
router.get("/:id", getResearchProject);
router.put("/:id", upload.single("image"), updateResearchProject);
router.delete("/:id", deleteResearchProject);

module.exports = router;