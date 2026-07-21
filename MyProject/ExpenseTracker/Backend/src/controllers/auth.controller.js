import crypto from "crypto";
import { User } from "../models/auth.model.js";
import { ApiError } from "../utils/apiError.js";
import { ApiResponse } from "../utils/apiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { recalculateBalances } from "./ledger.controller.js";

const cookieOptions = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "lax",
};

export const registerUser = asyncHandler(async (req, res) => {
  const { username, email, password } = req.body;

  if ([username, email, password].some((field) => field?.trim() === "")) {
    throw new ApiError(400, "All fields are required");
  }

  const existedUser = await User.findOne({
    $or: [{ username }, { email }],
  });

  if (existedUser) {
    throw new ApiError(409, "User with email or username already exists");
  }

  const user = await User.create({
    username,
    email,
    password,
  });

  const createdUser = await User.findById(user._id).select("-password");

  if (!createdUser) {
    throw new ApiError(500, "Something went wrong while registering the user");
  }

  return res
    .status(201)
    .json(new ApiResponse(201, createdUser, "User registered successfully"));
});

export const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    throw new ApiError(400, "Email/Username and password are required");
  }

  const user = await User.findOne({
    $or: [{ email: email.toLowerCase() }, { username: email }],
  });

  if (!user) {
    throw new ApiError(404, "User does not exist");
  }

  const isPasswordValid = await user.isPasswordCorrect(password);

  if (!isPasswordValid) {
    throw new ApiError(401, "Invalid user credentials");
  }

  const accessToken = user.generateAccessToken();

  const loggedInUser = await User.findById(user._id).select("-password");

  return res
    .status(200)
    .cookie("accessToken", accessToken, cookieOptions)
    .json(
      new ApiResponse(
        200,
        {
          user: loggedInUser,
          token: accessToken,
        },
        "User logged in successfully"
      )
    );
});

export const logoutUser = asyncHandler(async (req, res) => {
  return res
    .status(200)
    .clearCookie("accessToken", cookieOptions)
    .json(new ApiResponse(200, {}, "User logged out successfully"));
});

export const forgotPassword = asyncHandler(async (req, res) => {
  const { email } = req.body;

  if (!email) {
    throw new ApiError(400, "Email is required");
  }

  const user = await User.findOne({ email: email.toLowerCase() });

  if (!user) {
    throw new ApiError(404, "User with this email does not exist");
  }

  const resetToken = crypto.randomBytes(20).toString("hex");
  user.resetPasswordToken = resetToken;
  user.resetPasswordExpires = Date.now() + 3600000; // 1 hour
  await user.save();

  // Generate Reset URL pointing to Vite frontend
  const resetUrl = `http://localhost:5174/reset-password/${resetToken}`;

  // Log in server console so user can copy-paste it during local testing!
  console.log("\n==================================================");
  console.log(`PASSWORD RESET REQUEST FOR: ${email}`);
  console.log(`Reset URL: ${resetUrl}`);
  console.log("==================================================\n");

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        { resetToken },
        "Password reset link generated and logged to console successfully. (Please check backend server log output to copy the reset link)"
      )
    );
});

export const resetPassword = asyncHandler(async (req, res) => {
  const { token } = req.params;
  const { password } = req.body;

  if (!password) {
    throw new ApiError(400, "Password is required");
  }

  const user = await User.findOne({
    resetPasswordToken: token,
    resetPasswordExpires: { $gt: Date.now() },
  });

  if (!user) {
    throw new ApiError(400, "Password reset token is invalid or has expired");
  }

  user.password = password;
  user.resetPasswordToken = undefined;
  user.resetPasswordExpires = undefined;
  await user.save();

  return res
    .status(200)
    .json(new ApiResponse(200, {}, "Password has been reset successfully"));
});

export const getProfile = asyncHandler(async (req, res) => {
  return res
    .status(200)
    .json(new ApiResponse(200, req.user, "User profile fetched successfully"));
});

export const updateProfile = asyncHandler(async (req, res) => {
  const { username, email, password, initialOpeningBalance } = req.body;
  const user = await User.findById(req.user._id);

  if (!user) {
    throw new ApiError(404, "User not found");
  }

  if (username) user.username = username;
  if (email) user.email = email.toLowerCase();
  if (password) user.password = password;

  let balanceChanged = false;
  if (initialOpeningBalance !== undefined) {
    const parsedBalance = parseFloat(initialOpeningBalance);
    if (isNaN(parsedBalance)) {
      throw new ApiError(400, "Initial opening balance must be a number");
    }
    if (user.initialOpeningBalance !== parsedBalance) {
      user.initialOpeningBalance = parsedBalance;
      balanceChanged = true;
    }
  }

  await user.save();

  if (balanceChanged) {
    // Cascade recalculation of all ledger days if starting balance changes
    await recalculateBalances(user._id);
  }

  const updatedUser = await User.findById(user._id).select("-password");

  return res
    .status(200)
    .json(new ApiResponse(200, updatedUser, "Profile updated successfully"));
});
