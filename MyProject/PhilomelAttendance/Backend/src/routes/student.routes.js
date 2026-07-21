import { Router } from "express";

import { createStudent, deleteStudent, getAllStudents, updateStudent } from "../controllers/student.controller.js";

const router = Router();

router.get("/", getAllStudents);
router.post("/", createStudent);
router.put("/:id", updateStudent);
router.delete("/:id", deleteStudent);

export default router;
