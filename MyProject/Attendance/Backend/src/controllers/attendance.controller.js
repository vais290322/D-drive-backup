import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/apiError.js";
import { ApiResponse } from "../utils/apiResponse.js";
import { Student } from "../models/students.model.js";
import { Attendance } from "../models/attendance.model.js";
import { scheduleJob } from 'node-schedule';

// Helper function to get today's date with time set to 00:00:00
const getTodayDate = () => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return today;
};

// Helper function to calculate total hours between check-in and check-out
const calculateTotalHours = (checkIn, checkOut) => {
    if (!checkIn || !checkOut) return 0;
    
    const diffMs = checkOut - checkIn;
    const diffHrs = diffMs / (1000 * 60 * 60);
    return parseFloat(diffHrs.toFixed(2));
};

// Schedule auto-checkout job to run at 12:01 AM every day
scheduleJob('1 0 * * *', async () => {
    await Attendance.processAutoCheckout();
});

// Process RFID scan (handles both check-in and check-out)
const processRfidScan = asyncHandler(async (req, res) => {
    const { rfid } = req.body;

    if (!rfid) {
        throw new ApiError(400, "RFID is required");
    }

    // Find student by RFID
    const student = await Student.findOne({ rfid });
    if (!student) {
        throw new ApiError(404, "Student not found with this RFID");
    }

    const today = getTodayDate();
    
    // Find today's attendance record for this student
    let attendance = await Attendance.findOne({
        student: student._id,
        date: {
            $gte: today,
            $lt: new Date(today.getTime() + 24 * 60 * 60 * 1000)
        }
    });

    const currentTime = new Date();

    // If no attendance record exists for today, create one with check-in
    if (!attendance) {
        attendance = await Attendance.create({
            student: student._id,
            name: student.name,
            date: today,
            checkIn: currentTime,
            status: "partial" // Marked as partial until checkout
        });

        return res.status(200).json(
            new ApiResponse(200, attendance, "Check-in successful")
        );
    }

    // If attendance record exists but no check-out, update with check-out
    if (attendance.checkIn && !attendance.checkOut) {
        attendance.checkOut = currentTime;
        attendance.totalHours = calculateTotalHours(attendance.checkIn, currentTime);
        attendance.status = "present";
        await attendance.save();

        return res.status(200).json(
            new ApiResponse(200, attendance, "Check-out successful")
        );
    }

    // If both check-in and check-out exist, don't allow more scans for today
    return res.status(200).json(
        new ApiResponse(200, attendance, "Already checked in and out for today")
    );
});

// Process manual RFID entry
const processManualEntry = asyncHandler(async (req, res) => {
    const { rfid } = req.body;
    
    // Reuse the same logic as processRfidScan
    return processRfidScan(req, res);
});

// Get today's attendance for all students
const getTodayAttendance = asyncHandler(async (req, res) => {
    const today = getTodayDate();
    
    // Get all students
    const allStudents = await Student.find();
    
    // Get today's attendance records
    const attendanceRecords = await Attendance.find({
        date: {
            $gte: today,
            $lt: new Date(today.getTime() + 24 * 60 * 60 * 1000)
        }
    }).populate('student').sort({createdAt: -1});
    
    // Count total absent students
    const presentStudentIds = attendanceRecords.map(record => 
        record.student._id.toString()
    );
    
    const absentStudents = allStudents.filter(student => 
        !presentStudentIds.includes(student._id.toString())
    );
    
    const response = {
        date: today,
        totalStudents: allStudents.length,
        presentCount: attendanceRecords.length,
        absentCount: absentStudents.length,
        attendanceRecords,
        absentStudents
    };
    
    return res.status(200).json(
        new ApiResponse(200, response, "Today's attendance retrieved successfully")
    );
});

// Get attendance report for a specific student or all students
const getAttendanceReport = asyncHandler(async (req, res) => {
    const { studentId, startDate, endDate } = req.query;
    
    const query = {};
    
    // Filter by student if provided
    if (studentId) {
        query.student = studentId;
    }
    
    // Filter by date range if provided
    if (startDate && endDate) {
        const start = new Date(startDate);
        start.setHours(0, 0, 0, 0);
        
        const end = new Date(endDate);
        end.setHours(23, 59, 59, 999);
        
        query.date = {
            $gte: start,
            $lte: end
        };
    }
    
    // Get attendance records based on filters
    const attendanceRecords = await Attendance.find(query)
        .populate('student')
        .sort({ date: -1 });
    
    return res.status(200).json(
        new ApiResponse(
            200, 
            attendanceRecords, 
            "Attendance report retrieved successfully"
        )
    );
});

// Get monthly attendance report for all students
const getMonthlyAttendanceReport = asyncHandler(async (req, res) => {
    const { month, year } = req.query;
    
    if (!month || !year) {
        throw new ApiError(400, "Month and year are required");
    }
    
    // Convert month to integer (0-11 where 0 is January)
    const monthInt = parseInt(month) - 1;
    const yearInt = parseInt(year);
    
    // Create date objects for the first and last day of the month
    const startDate = new Date(yearInt, monthInt, 1);
    const endDate = new Date(yearInt, monthInt + 1, 0, 23, 59, 59, 999); // Last day of month
    
    // Get all students
    const students = await Student.find().sort({ name: 1 });
    
    // Get all attendance records for the month
    const attendanceRecords = await Attendance.find({
        date: {
            $gte: startDate,
            $lte: endDate
        }
    }).populate('student');
    
    // Get the number of days in the month
    const daysInMonth = new Date(yearInt, monthInt + 1, 0).getDate();
    
    // Create an array of all dates in the month
    const datesInMonth = [];
    for (let i = 1; i <= daysInMonth; i++) {
        const date = new Date(yearInt, monthInt, i);
        datesInMonth.push({
            date,
            isHoliday: date.getDay() === 0 // Sunday is holiday
        });
    }
    
    // Prepare the response data
    const monthlyReport = students.map(student => {
        // Get all attendance records for this student
        const studentRecords = attendanceRecords.filter(
            record => record.student && record.student._id.toString() === student._id.toString()
        );
        
        // Create attendance data for each day of the month
        const attendance = datesInMonth.map(({ date, isHoliday }) => {
            // Format date as DD-MM-YYYY
            const formattedDate = `${date.getDate().toString().padStart(2, '0')}-${(date.getMonth() + 1).toString().padStart(2, '0')}-${date.getFullYear()}`;
            
            // Check if there's an attendance record for this date
            const record = studentRecords.find(record => {
                const recordDate = new Date(record.date);
                return recordDate.getDate() === date.getDate() &&
                       recordDate.getMonth() === date.getMonth() &&
                       recordDate.getFullYear() === date.getFullYear();
            });
            
            // If it's a holiday (Sunday), return holiday status
            if (isHoliday) {
                return {
                    date: formattedDate,
                    checkIn: "HOLIDAY",
                    checkOut: "HOLIDAY"
                };
            }
            
            // If there's a record, return the check-in and check-out times
            if (record) {
                return {
                    date: formattedDate,
                    checkIn: record.checkIn ? new Date(record.checkIn).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : "-",
                    checkOut: record.checkOut ? new Date(record.checkOut).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : "-"
                };
            }
            
            // If there's no record, return empty values
            return {
                date: formattedDate,
                checkIn: "-",
                checkOut: "-"
            };
        });
        
        return {
            name: student.name,
            studentId: student.studentId,
            email: student.email || "-",
            attendance
        };
    });
    
    return res.status(200).json(
        new ApiResponse(
            200, 
            {
                month: parseInt(month),
                year: yearInt,
                daysInMonth,
                students: monthlyReport
            }, 
            "Monthly attendance report retrieved successfully"
        )
    );
});

export {
    processRfidScan,
    processManualEntry,
    getTodayAttendance,
    getAttendanceReport,
    getMonthlyAttendanceReport
};