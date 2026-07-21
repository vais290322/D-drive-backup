const express = require("express");
const {
    createAbstract,
    getAllAbstracts,
    getAbstract,
    updateAbstract,
    deleteAbstract
} = require("../controller/abstractsAndResearchOnGoingProjectController");

const router = express.Router();

router.post("/", createAbstract);
router.get("/", getAllAbstracts);
router.get("/:id", getAbstract);
router.put("/:id", updateAbstract);
router.delete("/:id", deleteAbstract);

module.exports = router;