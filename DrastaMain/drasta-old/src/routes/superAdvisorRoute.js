const express = require("express");
const multer = require("multer");
const { storage } = require("../config/cloudinary");
const upload = multer({ storage });

const {
    createSuperAdvisor,
    getAllSuperAdvisors,
    getSuperAdvisor,
    updateSuperAdvisor,
    deleteSuperAdvisor
} = require("../controller/superAdvisorController");

const router = express.Router();

router.post("/", upload.single("image"), createSuperAdvisor);
router.get("/", getAllSuperAdvisors);
router.get("/:id", getSuperAdvisor);
router.put("/:id", upload.single("image"), updateSuperAdvisor);
router.delete("/:id", deleteSuperAdvisor);

module.exports = router;

