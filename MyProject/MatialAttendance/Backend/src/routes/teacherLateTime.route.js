import { Router } from "express";
import { getAllTeacherLateTimes, createTeacherLateTime, updateTeacherLateTime, deleteTeacherLateTime } from "../controllers/teacherLateTime.controller.js";

const router = Router();

// TeacherLateTime routes
router.get("/get", getAllTeacherLateTimes);
router.post("/", createTeacherLateTime);
router.put("/:id", updateTeacherLateTime);
router.delete("/:id", deleteTeacherLateTime);

export default router;