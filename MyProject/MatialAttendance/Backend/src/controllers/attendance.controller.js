import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/apiError.js";
import { ApiResponse } from "../utils/apiResponse.js";
import { Student } from "../models/students.model.js";
import { Attendance } from "../models/attendance.model.js";
import { scheduleJob } from 'node-schedule';
import { StudentLateTime } from "../models/studentLateTime.model.js";
import { TeacherAttendance } from "../models/TeacherAttendance.model.js"
import { Teacher } from "../models/teacher.model.js"
import { TeacherLateTime } from "../models/teacherLateTime.model.js"

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

scheduleJob('1 0 * * *', async () => {
    await TeacherAttendance.processAutoCheckout();
});

// Process RFID scan (handles both check-in and check-out)
const processRfidScan = asyncHandler(async (req, res) => {
    const { rfid } = req.body;

    if (!rfid) {
        throw new ApiError(400, "RFID is required");
    }

    // Find student by RFID
    const student = await Student.findOne({ rfid });
    const teacher = await Teacher.findOne({ rfid });
    if (!student && !teacher) {
        throw new ApiError(404, "Student or Teacher not found with this RFID");
    }

    const today = getTodayDate();

    if (student) {
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
            // Get the late time threshold
            const lateTimeSettings = await StudentLateTime.findOne();
            let isLate = false;

            if (lateTimeSettings) {
                // Parse the late time threshold (format: "HH:mm:ss")
                const [hours, minutes, seconds] = lateTimeSettings.lateTime.split(':').map(Number);
                const lateThreshold = new Date(today);
                lateThreshold.setHours(hours, minutes, seconds);

                // Check if current time is after late threshold
                isLate = currentTime > lateThreshold;
            }


            attendance = await Attendance.create({
                student: student._id,
                name: student.name,
                date: today,
                checkIn: currentTime,
                status: "partial", // Marked as partial until checkout
                isLate
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
    } else {
        // Find today's teacher attendance record for this teacher
        let teacherAttendance = await TeacherAttendance.findOne({
            teacher: teacher._id,
            date: {
                $gte: today,
                $lt: new Date(today.getTime() + 24 * 60 * 60 * 1000)
            }
        });

        const currentTime = new Date();

        // If no teacher attendance record exists for today, create one with check-in
        if (!teacherAttendance) {
            // Get the late time threshold
            const lateTimeSettings = await TeacherLateTime.findOne();
            let isLate = false;

            if (lateTimeSettings) {
                // Parse the late time threshold (format: "HH:mm:ss")
                const [hours, minutes, seconds] = lateTimeSettings.lateTime.split(':').map(Number);
                const lateThreshold = new Date(today);
                lateThreshold.setHours(hours, minutes, seconds);

                // Check if current time is after late threshold
                isLate = currentTime > lateThreshold;
            }


            teacherAttendance = await TeacherAttendance.create({
                teacher: teacher._id,
                name: teacher.name,
                date: today,
                checkIn: currentTime,
                status: "partial", // Marked as partial until checkout
                isLate
            });

            return res.status(200).json(
                new ApiResponse(200, teacherAttendance, "Check-in successful")
            );
        }

        // If teacher attendance record exists but no check-out, update with check-out
        if (teacherAttendance.checkIn && !teacherAttendance.checkOut) {
            teacherAttendance.checkOut = currentTime;
            teacherAttendance.totalHours = calculateTotalHours(teacherAttendance.checkIn, currentTime);
            teacherAttendance.status = "present";
            await teacherAttendance.save();

            return res.status(200).json(
                new ApiResponse(200, teacherAttendance, "Check-out successful")
            );
        }

        // If both check-in and check-out exist, don't allow more scans for today
        return res.status(200).json(
            new ApiResponse(200, teacherAttendance, "Already checked in and out for today")
        );

    }

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

    // get all teachers
    const allTeachers = await Teacher.find();

    // Get today's attendance records
    const attendanceRecords = await Attendance.find({
        date: {
            $gte: today,
            $lt: new Date(today.getTime() + 24 * 60 * 60 * 1000)
        }
    }).populate('student').sort({ createdAt: -1 });


    // get todya's attendance records for teachers 
    const teacherAttendanceRecords = await TeacherAttendance.find({
        date: {
            $gte: today,
            $lt: new Date(today.getTime() + 24 * 60 * 60 * 1000)
        }
    }).populate('teacher').sort({ createdAt: -1 });


    // Count total absent students
    const presentStudentIds = attendanceRecords
        .filter(record => record?.student?._id)
        .map(record => record.student._id.toString());

    const absentStudents = allStudents.filter(student =>
        !presentStudentIds.includes(student?._id.toString())
    );


    // Count total absent teachers
    const presentTeacherIds = teacherAttendanceRecords
        .filter(record => record?.teacher?._id)
        .map(record => record.teacher._id.toString());

    const absentTeachers = allTeachers.filter(teacher =>
        !presentTeacherIds.includes(teacher?._id.toString())
    );

    // Merge and sort by checkIn time (ascending: earliest first)
    const margedRecords = [...attendanceRecords, ...teacherAttendanceRecords]
        .filter(r => r.checkIn) // Only include records with checkIn
        .sort((a, b) => new Date(a.checkIn) - new Date(b.checkIn));



    const response = {
        date: today,
        totalStudents: allStudents.length,
        presentCount: attendanceRecords.length,
        absentCount: absentStudents.length,
        attendanceRecords,
        absentStudents,
        totalTeachers: allTeachers.length,
        presentTeachersCount: teacherAttendanceRecords.length,
        absentTeachersCount: absentTeachers.length,
        absentTeachers,
        teacherAttendanceRecords,
        margedRecords,
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
            className: student.className || "-",
            section: student.section || "-",
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

const getTeacherAttendanceReport = asyncHandler(async (req, res) => {
    try {
        const { teacher, startDate, endDate } = req.query;
        const query = {};

        if (teacher) {
            query.teacher = teacher;
        }

        if (startDate && endDate) {
            const start = new Date(startDate);
            start.setHours(0, 0, 0, 0);
            const end = new Date(endDate);
            end.setHours(23, 59, 59, 999);
            query.date = { $gte: start, $lte: end };
        }

        const teacherAttendance = await TeacherAttendance.find(query).populate('teacher').sort({ date: -1 });
        return res.status(200).json(
            new ApiResponse(
                200,
                {
                    teacherAttendance
                },
                "Teacher attendance report retrieved successfully"
            )
        );
    } catch (error) {
        throw new ApiError(500, error.message || "Something went wrong");
    }


})

const getTeacherMonthlyAttendanceReport = asyncHandler(async (req, res) => {
    try {
        const { month, year } = req.query;

        if (!month || !year) {
            throw new ApiError(400, "Month and year are required");
        }

        const monthInt = parseInt(month) - 1;
        const yearInt = parseInt(year);

        const startDate = new Date(yearInt, monthInt, 1);
        const endDate = new Date(yearInt, monthInt + 1, 0, 23, 59, 59, 999);

        const teachers = await Teacher.find().sort({ createdAt: -1 });

        const attendanceRecords = await TeacherAttendance.find({
            date: {
                $gte: startDate,
                $lte: endDate
            }
        }).populate('teacher');

        const daysInMonth = new Date(yearInt, monthInt + 1, 0).getDate();

        const datesInMonth = [];
        for (let i = 1; i <= daysInMonth; i++) {
            const date = new Date(yearInt, monthInt, i);
            datesInMonth.push({
                date,
                isHoliday: date.getDay() === 0 // Sunday is holiday
            });
        }

        const monthlyReport = teachers.map((teacher) => {
            const studentRecords = attendanceRecords.filter((record) => {
                return record.teacher._id.toString() === teacher._id.toString();
            });

            const attendance = datesInMonth.map(({ date, isHoliday }) => {
                const formattedDate = date.toLocaleDateString('en-US', {
                    day: 'numeric',
                    month: 'short',
                    year: 'numeric'
                });

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
                teacher: teacher.name,
                email: teacher.email || "-",
                subject: teacher?.subject || "-",
                attendance
            };
        });

        return res.status(200).json({
            month: parseInt(month),
            year: yearInt,
            daysInMonth,
            teachers: monthlyReport.map((teacher) => {
                return {
                    teacher: teacher.teacher,
                    email: teacher.email,
                    attendance: teacher.attendance
                }
            }),
            message: "Monthly attendance report retrieved successfully for teachers"
        });
    } catch (error) {
        throw new ApiError(500, error.message || "Something went wrong");
    }
});

export {
    processRfidScan,
    processManualEntry,
    getTodayAttendance,
    getAttendanceReport,
    getMonthlyAttendanceReport,
    getTeacherAttendanceReport,
    getTeacherMonthlyAttendanceReport
};