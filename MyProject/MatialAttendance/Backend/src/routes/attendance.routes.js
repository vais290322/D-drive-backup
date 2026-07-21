import { Router } from "express";
import {
    processRfidScan,
    processManualEntry,
    getTodayAttendance,
    getAttendanceReport,
    getMonthlyAttendanceReport,
    getTeacherAttendanceReport,
    getTeacherMonthlyAttendanceReport
} from "../controllers/attendance.controller.js";

const router = Router();

// RFID scan routes
router.post("/scan", processRfidScan);
router.post("/manual-entry", processManualEntry);

// Attendance report routes
router.get("/today", getTodayAttendance);
router.get("/report", getAttendanceReport);
router.get("/teacher-report", getTeacherAttendanceReport);
router.get("/monthly-report", getMonthlyAttendanceReport);
router.get("/teacher-monthly-report", getTeacherMonthlyAttendanceReport);

export default router;