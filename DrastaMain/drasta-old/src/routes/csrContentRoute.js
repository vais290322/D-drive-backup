const express = require("express");
const {
    createCSRContent,
    getAllCSRContents,
    getCSRContent,
    updateCSRContent,
    deleteCSRContent
} = require("../controller/csrContentController");

const router = express.Router();

router.post("/", createCSRContent);
router.get("/", getAllCSRContents);
router.get("/:id", getCSRContent);
router.put("/:id", updateCSRContent);
router.delete("/:id", deleteCSRContent);

module.exports = router;