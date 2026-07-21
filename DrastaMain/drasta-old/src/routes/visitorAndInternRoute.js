const express = require("express");
const multer = require("multer");
const { storage } = require("../config/cloudinary");
const upload = multer({ storage });

const {
    addIntern,
    getAll,
    updateIntern,
    deleteIntern
} = require("../controller/visitorAndInternController");

const router = express.Router();

router.get("/", getAll);
router.post("/", upload.single("image"), addIntern);
router.put("/:year/:internId", upload.single("image"), updateIntern);
router.delete("/:year/:internId", deleteIntern);

module.exports = router;