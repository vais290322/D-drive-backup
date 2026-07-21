import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/apiError.js";
import { ApiResponse } from "../utils/apiResponse.js";
import {StudentLateTime} from "../models/studentLateTime.model.js"


// Get all studentLateTimes
const getAllStudentLateTimes = asyncHandler(async (req, res) => {
    try {
        const studentLateTimes = await StudentLateTime.find().sort({ createdAt: -1 });
        return res.status(200).json(
            new ApiResponse(200, studentLateTimes, "studentLateTimes retrieved successfully")
        );
    } catch (error) {
        console.log("error : ", error);
        throw new ApiError(500, error.message || "Internal server error");
    }
});

const createStudentLateTime = asyncHandler(async (req, res) => {
    const { lateTime } = req.body;

    if (!lateTime) {
        throw new ApiError(400, "lateTime is required");
    }

    // Check if lateTime already exists
    const existingLateTime = await StudentLateTime.find();
    // console.log("existingLate time : ", existingLateTime)
    if (existingLateTime.length > 0) {
        throw new ApiError(400, "lateTime already exists you can update it");
    }
    
    const studentLateTime = await StudentLateTime.create({
        lateTime
    });
    
    return res.status(201).json(
        new ApiResponse(201, studentLateTime, "studentLateTime created successfully")
    );
});

const updateStudentLateTime = asyncHandler(async (req, res) => {
    const { lateTime } = req.body;
    const { id } = req.params;
     if (!lateTime || !id) {
        throw new ApiError(400, "lateTime and id are required");
    }
    const studentLateTime = await StudentLateTime.findById(id);
    
    if (!studentLateTime) {
        throw new ApiError(404, "studentLateTime not found");
    }

    studentLateTime.lateTime = lateTime;
    
    await studentLateTime.save();

    return res.status(201).json(
        new ApiResponse(201, studentLateTime, "studentLateTime created successfully")
    );  
});

const deleteStudentLateTime = asyncHandler(async (req, res) => {
    const { id } = req.params;
    
    const studentLateTime = await StudentLateTime.findByIdAndDelete(id);
    
    if (!studentLateTime) {
        throw new ApiError(404, "studentLateTime not found");
    }
    
    return res.status(200).json(
        new ApiResponse(200, {}, "studentLateTime deleted successfully")
    );
});



export {
    getAllStudentLateTimes,
    createStudentLateTime,
    updateStudentLateTime,
    deleteStudentLateTime
};