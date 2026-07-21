import jwt from "jsonwebtoken";
import { ApiError } from "../utils/apiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import User from "../models/auth.model.js";

const verifyJWT = asyncHandler(async (req, res, next) => {
  // Get token from cookie or Authorization header
  const token =
    req.cookies?.accessToken ||
    req.header("Authorization")?.replace("Bearer ", "");

  if (!token) {
    throw new ApiError(401, "Unauthorized: No token provided");
  } 

  let decoded;
  try {
    decoded = jwt.verify(token, process.env.JWT_SECRET);
  } catch (err) {
    throw new ApiError(401, "Unauthorized: Invalid or expired token");
  }

  const user = await User.findById(decoded._id);
  if (!user) {
    throw new ApiError(401, "Unauthorized: User not found");
  }

  req.user = user;
  next();
});

export { verifyJWT };
