import ApiError from "../../utils/apiError.js";
import UserModel from "./auth.model.js";
import bcrypt from "bcryptjs";

export const registerService = async (payload) => {
  const { employeeId, name, email, password } = payload;

  if (!employeeId || !name || !email || !password) {
    throw new ApiError(400, "All fields are required");
  }

  const existingUser = await UserModel.findOne({
    $or: [{ employeeId }, { email }],
  });

  if (existingUser) {
    throw new ApiError(400, "User already exists");
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const user = await UserModel.create({
    employeeId,
    name,
    email,
    password: hashedPassword,
  });

  return user;
};

export const loginService = async (payload) => {
  const { employeeId, password } = payload;

  if (!employeeId || !password) {
    throw new ApiError(400, "All fields are required");
  }

  const user = await UserModel.findOne({ employeeId });

  if (!user) {
    throw new ApiError(400, "User not found");
  }

  const isPasswordMatched = await bcrypt.compare(password, user.password);

  if (!isPasswordMatched) {
    throw new ApiError(400, "Incorrect password");
  }

  const token = generateToken({
    id: user._id,
    employeeId: user.employeeId,
    email: user.email,
    role: user.role,
  });

  return {
    user,
    token,
  };
};

export const getUserProfile = async (userId) => {
  const user = await UserModel.findById(userId);

  if (!user) {
    throw new ApiError(404, "User not found");
  }

  return user;
};
