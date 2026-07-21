import ApiResponse from "../../utils/apiResponse.js";
import asyncHandler from "../../utils/asyncHandler.js";
import { loginService, registerService } from "./auth.service.js";

export const registerController = asyncHandler(async (req, res) => {
  const user = await registerService(req.body);

  return res.json(
    new ApiResponse(
      201,
      {
        employeeId: user.employeeId,
        name: user.name,
        email: user.email,
        role: user.role,
      },
      "User registered successfully",
    ),
  );
});

export const loginController = asyncHandler(async (req, res) => {
  const user = await loginService(req.body);

  res.cookie("token", user.token, {
    httpOnly: true,
    secure: true,
    sameSite: "strict",
    maxAge: 24 * 60 * 60 * 1000,
  });

  return res.json(
    new ApiResponse(
      200,
      {
        employeeId: user.employeeId,
        name: user.name,
        email: user.email,
        role: user.role,
        token: user.token,
      },
      "User logged in successfully",
    ),
  );
});

export const logoutController = asyncHandler(async (req, res) => {
  res.clearCookie("token");

  return res.json(new ApiResponse(200, {}, "User logged out successfully"));
});

export const getProfileController = asyncHandler(async (req, res) => {
  const user = await getUserProfile(req.user.id);

  return res.json(
    new ApiResponse(
      200,
      {
        employeeId: user.employeeId,
        name: user.name,
        email: user.email,
        role: user.role,
      },
      "User profile fetched successfully",
    ),
  );
});
