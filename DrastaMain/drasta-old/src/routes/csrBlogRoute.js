const express = require("express");
const {
    createCSRBlog,
    getAllCSRBlogs,
    getCSRBlog,
    updateCSRBlog,
    deleteCSRBlog
} = require("../controller/csrBlogController");

const router = express.Router();

router.post("/", createCSRBlog);
router.get("/", getAllCSRBlogs);
router.get("/:id", getCSRBlog);
router.put("/:id", updateCSRBlog);
router.delete("/:id", deleteCSRBlog);

module.exports = router;