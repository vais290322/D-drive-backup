import express from "express";
import { createResultPublishDate, deleteResultPublishDate, getAllResultPublishDate, updateResultPublishDate, searchResultPublishDate } from "../controllers/resultPublishDate.controller.js";

const router = express.Router();

router.post("/create/:schoolId", createResultPublishDate);
router.put("/update/:schoolId/:id", updateResultPublishDate);
router.delete("/delete/:schoolId/:id", deleteResultPublishDate);
router.get("/getAll/:schoolId", getAllResultPublishDate);
router.get("/search/:schoolId", searchResultPublishDate);

export default router;