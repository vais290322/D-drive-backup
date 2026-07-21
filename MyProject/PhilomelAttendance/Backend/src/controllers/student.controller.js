import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/apiError.js";
import { ApiResponse } from "../utils/apiResponse.js";
import { Student } from "../models/students.model.js"; 
import { Teacher } from "../models/teacher.model.js";

// Get all students
const getAllStudents = asyncHandler(async (req, res) => {
    const students = await Student.find().sort({ createdAt: -1 });
    
    return res.status(200).json(
        new ApiResponse(200, students, "Students retrieved successfully")
    );
});

// Get a single student by ID
const getStudentById = asyncHandler(async (req, res) => {
    const { id } = req.params;
    
    const student = await Student.findById(id);
    
    if (!student) {
        throw new ApiError(404, "Student not found");
    }
    
    return res.status(200).json(
        new ApiResponse(200, student, "Student retrieved successfully")
    );
});

// Create a new student
const createStudent = asyncHandler(async (req, res) => {
    const { name, parent, studentId, phone, rfid,email, className, section } = req.body;

    // console.log("hi hello ",name)
    
    // Validate required fields
    if (!name || !studentId || !rfid) {
        throw new ApiError(400, "Name, Student ID, and RFID are required");
    }
    
    // Check if RFID already exists
    const existingRfid = await Student.findOne({ rfid });
    if (existingRfid) {
        throw new ApiError(400, "RFID already registered to another student");
    }

    const existingTeacher = await Teacher.findOne({ rfid });
    if (existingTeacher) {
        throw new ApiError(400, "RFID already registered to another teacher");
    }
    
    // Check if Student ID already exists
    const existingStudentId = await Student.findOne({ studentId });
    if (existingStudentId) {
        throw new ApiError(400, "Student Roll already exists");
    }
    
    // Create new student
    const student = await Student.create({
        name,
        parent,
        studentId,
        phone,
        rfid,
        email,
        className,
        section
    });
    
    return res.status(201).json(
        new ApiResponse(201, student, "Student registered successfully")
    );
});

// Update a student
const updateStudent = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const { name, parent, studentId, phone, rfid, email, className, section } = req.body;
    
    const student = await Student.findById(id);
    
    if (!student) {
        throw new ApiError(404, "Student not found");
    }
    
    // Check if updating RFID and it already exists for another student
    if (rfid && rfid !== student.rfid) {
        const existingRfid = await Student.findOne({ rfid, _id: { $ne: id } });
        if (existingRfid) {
            throw new ApiError(400, "RFID already registered to another student");
        }
    }

    const existingTeacher = await Teacher.findOne({ rfid });
    if (existingTeacher) {
        throw new ApiError(400, "RFID already registered to another teacher");
    }
    
    // Check if updating Student ID and it already exists for another student
    if (studentId && studentId !== student.studentId) {
        const existingStudentId = await Student.findOne({ studentId, _id: { $ne: id } });
        if (existingStudentId) {
            throw new ApiError(400, "Student ID already exists");
        }
    }
    
    // Update student
    student.name = name || student.name;
    student.parent = parent || student.parent;
    student.studentId = studentId || student.studentId;
    student.phone = phone || student.phone;
    student.rfid = rfid || student.rfid;
    student.email = email || student.email;
    student.className = className || student.className;
    student.section = section || student.section;
    
    await student.save();
    
    return res.status(200).json(
        new ApiResponse(200, student, "Student updated successfully")
    );
});

// Delete a student
const deleteStudent = asyncHandler(async (req, res) => {
    const { id } = req.params;
    
    const student = await Student.findByIdAndDelete(id);
    
    if (!student) {
        throw new ApiError(404, "Student not found");
    }
    
    return res.status(200).json(
        new ApiResponse(200, {}, "Student deleted successfully")
    );
});

export {
    getAllStudents,
    getStudentById,
    createStudent,
    updateStudent,
    deleteStudent
}; 