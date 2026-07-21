import { User } from "../models/user.model.js";
import { ApiError } from "../utils/apiError.js";
import { ApiResponse } from "../utils/apiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import bcrypt from "bcrypt";


const register = asyncHandler(async (req, res) => {
    const { username, email, password } = req.body;
    if (!username || !email || !password) {
        throw new ApiError(400, "All fields are required");
    }
    const userExists = await User.findOne({ email });
    if (userExists) {
        throw new ApiError(409, "User already exists");
    }

    const passwordHash = await bcrypt.hash(password, 10);
    const user = await User.create({
        username,
        email,
        password: passwordHash,
    });

    const userWithoutPassword = await User.findById(user._id).select("-password ");
    

    res.status(201).json(
        new ApiResponse(201, userWithoutPassword, "User registered successfully")
    )

  
})


const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    throw new ApiError(400, "All fields are required");
  }

  const user = await User.findOne({ email });
  if (!user) {
    throw new ApiError(404, "User not found");
  }

  const isPasswordValid = await bcrypt.compare(password, user.password);
  if (!isPasswordValid) {
    throw new ApiError(401, "Invalid password");
  }

  const userWithoutPassword = await User.findById(user._id).select("-password ");

  res.status(200).json(
    new ApiResponse(200, userWithoutPassword, "User logged in successfully")
  )
  
})

export { register, login };