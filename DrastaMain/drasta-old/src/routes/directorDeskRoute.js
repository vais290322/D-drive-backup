const express = require("express");
const multer = require("multer");
const { storage } = require("../config/cloudinary");
const upload = multer({ storage });

const {
    createDirectorsDesk,
    getAllDirectorsDesk,
    getDirectorsDesk,
    updateDirectorsDesk,
    deleteDirectorsDesk
} = require("../controller/directorDeskController");

const router = express.Router();

router.post("/", upload.single("image"), createDirectorsDesk);
router.get("/", getAllDirectorsDesk);
router.get("/:id", getDirectorsDesk);
router.put("/:id", upload.single("image"), updateDirectorsDesk);
router.delete("/:id", deleteDirectorsDesk);

module.exports = router;