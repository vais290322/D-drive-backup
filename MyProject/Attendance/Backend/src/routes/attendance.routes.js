import { Router } from "express";
import {
    processRfidScan,
    processManualEntry,
    getTodayAttendance,
    getAttendanceReport,
    getMonthlyAttendanceReport
} from "../controllers/attendance.controller.js";

const router = Router();

// RFID scan routes
router.post("/scan", processRfidScan);
router.post("/manual-entry", processManualEntry);

// Attendance report routes
router.get("/today", getTodayAttendance);
router.get("/report", getAttendanceReport);
router.get("/monthly-report", getMonthlyAttendanceReport);

export default router;