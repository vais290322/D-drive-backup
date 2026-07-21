const express = require("express");
const router = express.Router();
const uploadController = require("../controller/upload.controller");
const { authenticate, authorize } = require("../middleware/authorization");
// Route for uploading CSV/Excel file
router.post(
  "/uploadfile",
  uploadController.uploadMiddleware,
  uploadController.uploadFile
);

module.exports = router;