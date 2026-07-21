const { ApiError } = require("../utils/apiError.js");
const { ApiResponse } = require("../utils/apiResponse.js");
const { asyncHandler } = require("../utils/asyncHandler.js");
const { uploadOnCloudinary } = require("../utils/cloudinary.js");
const { Doctor } = require("../models/doctors.model.js");
const { User } = require("../models/user.model.js");
const getDataUri = require("../utils/datauri.js");

const createDoctor = asyncHandler(async (req, res) => {
    try {
        const { name, email, phNumber, specialization, category } = req.body;
        const profilePicture = req.file;

        if (!name || !email || !phNumber || !specialization || !category) {
            throw new ApiError(400, "Please provide all fields");
        }

        if (!profilePicture) {
            throw new ApiError(400, "Please provide image");
        }

        const userExist = await Doctor.findOne({ email });
        if (userExist) {
            throw new ApiError(409, "Doctor already exists");
        }

        let cloudinary;
        if (profilePicture) {
            const fileUri = getDataUri(profilePicture);
            cloudinary = await uploadOnCloudinary(fileUri);
        }

        const doctor = await Doctor.create({
            name,
            email,
            phNumber,
            specialization,
            category,
            profilePicture: cloudinary.secure_url,
        });

        return res.json(new ApiResponse(200, doctor, "Doctor added successfully"));

    } catch (error) {
        res.json(
            new ApiError(
                error?.statusCode || 500,
                error?.message || "Internal server error in create doctor"
            )
        );
    }
});

const updateDoctor = asyncHandler(async (req, res) => {
    try {
        const { name, email, phNumber, specialization, category } = req.body;
        const profilePicture = req.file;

        const doctor = await Doctor.findById(req.params.id);
        if (!doctor) {
            throw new ApiError(404, "Doctor not found");
        }

        let cloudinary;
        if (profilePicture) {
            const fileUri = getDataUri(profilePicture);
            cloudinary = await uploadOnCloudinary(fileUri);
        }

        if (name) doctor.name = name;
        if (email) doctor.email = email;
        if (phNumber) doctor.phNumber = phNumber;
        if (specialization) doctor.specialization = specialization;
        if (category) doctor.category = category;
        if (cloudinary?.secure_url) doctor.profilePicture = cloudinary.secure_url;

        await doctor.save();

        return res.json(new ApiResponse(200, doctor, "Doctor updated successfully"));

    } catch (error) {
        return res.json(
            new ApiError(
                error?.statusCode || 500,
                error?.message || "Internal server error in updating doctor"
            )
        );
    }
});

const deleteDoctor = asyncHandler(async (req, res) => {
    try {
        const { id } = req.params;
        const doctor = await Doctor.findByIdAndDelete(id);
        if (!doctor) {
            throw new ApiError(404, "Doctor not found");
        }
        return res.json(new ApiResponse(200, null, "Doctor deleted successfully"));
    } catch (error) {
        res.json(
            new ApiError(
                error?.statusCode || 500,
                error?.message || "Internal server error in delete doctor"
            )
        );
    }
});

const getdoctor = asyncHandler(async (req, res) => {
    try {
        const doctor = await Doctor.findById(req.params.id);
        if (!doctor) {
            throw new ApiError(404, "Doctor not found");
        }
        return res.json(new ApiResponse(200, doctor, "Doctor found successfully"));
    } catch (error) {
        res.json(
            new ApiError(
                error?.statusCode || 500,
                error?.message || "Internal server error in get doctor"
            )
        );
    }
});

const getAllDoctors = asyncHandler(async (req, res) => {
    try {
        const doctors = await Doctor.find();
        if (!doctors) {
            throw new ApiError(404, "Doctors not found");
        }
        return res.json(new ApiResponse(200, doctors, "Doctors found successfully"));
    } catch (error) {
        res.json(
            new ApiError(
                error?.statusCode || 500,
                error?.message || "Internal server error in get all doctors"
            )
        );
    }
});

module.exports = { createDoctor, updateDoctor, deleteDoctor, getdoctor, getAllDoctors };
