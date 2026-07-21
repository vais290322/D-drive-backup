const express = require("express");
const multer = require("multer");
const { storage } = require("../config/cloudinary");
const upload = multer({ storage });

const {
    createAdministration,
    getAllAdministrations,
    getAdministration,
    updateAdministration,
    deleteAdministration
} = require("../controller/administrationController");

const router = express.Router();

router.post("/", upload.single("image"), createAdministration);
router.get("/", getAllAdministrations);
router.get("/:id", getAdministration);
router.put("/:id", upload.single("image"), updateAdministration);
router.delete("/:id", deleteAdministration);

module.exports = router;