const express = require("express");
const multer = require("multer");
const { storage } = require("../config/cloudinary");
const upload = multer({ storage });

const {
    createDataNews,
    getAllDataNews,
    getDataNews,
    updateDataNews,
    deleteDataNews
} = require("../controller/dataNewsController");

const router = express.Router();

router.post("/", upload.single("image"), createDataNews);
router.get("/", getAllDataNews);
router.get("/:id", getDataNews);
router.put("/:id", upload.single("image"), updateDataNews);
router.delete("/:id", deleteDataNews);

module.exports = router;