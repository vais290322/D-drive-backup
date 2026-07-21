import { Router } from "express";
import { getAllStudentLateTimes, createStudentLateTime, updateStudentLateTime, deleteStudentLateTime } from "../controllers/studentLateTime.controller.js";



const router = Router();

// StudentLateTime routes
router.get("/get", getAllStudentLateTimes);
router.post("/", createStudentLateTime);
router.put("/:id", updateStudentLateTime);
router.delete("/:id", deleteStudentLateTime);

export default router;