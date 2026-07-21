import {
  adminPassword,
  adminUserId,
  adminId,
  isProduction,
} from '../../config/credentials.js';
import { generateToken } from '../../helpers/token.js';
import ApiError from '../../utils/apiError.js';
import ApiResponse from '../../utils/apiResponse.js';
import asyncHandler from '../../utils/asyncHandler.js';
import Staff from '../staff/staff.model.js';
import { getUserProfile, loginService } from './auth.service.js';

const cookieOptions = {
  httpOnly: true,
  secure: isProduction,
  sameSite: isProduction ? 'none' : 'lax',
  maxAge: 8 * 60 * 60 * 1000,
};

export const loginController = asyncHandler(async (req, res) => {
  const users = await Staff.find();
  
  console.log("users : ", users)
  
  const { userId, password } = req.body;

  if (!userId || !password) {
    throw new ApiError(400, 'userId and password are required');
  }

  // if (userId === adminUserId && password === adminPassword) {
  //   const token = generateToken({
  //     id: adminId,
  //     userId: adminUserId,
  //     role: 'admin',
  //   });

  //   res.cookie('token', token, cookieOptions);

  //   return res.json(
  //     new ApiResponse(
  //       200,
  //       {
  //         user: {
  //           id: adminId,
  //           userId: adminUserId,
  //           role: 'admin',
  //         },
  //         token,
  //       },
  //       'Logged in successfully',
  //     ),
  //   );
  // } else {
  const { user, token } = await loginService({ userId, password });

  res.cookie('token', token, cookieOptions);

  return res.json(
    new ApiResponse(200, { user, token }, 'Logged in successfully'),
  );
  // }
});

export const logoutController = asyncHandler(async (req, res) => {
  res.clearCookie('token', cookieOptions);

  return res.json(new ApiResponse(200, {}, 'Logged out successfully'));
});

export const getProfileController = asyncHandler(async (req, res) => {
  const { userId } = req?.user;

  // if (userId === adminUserId && role === 'admin') {
  //   return res.json(
  //     new ApiResponse(
  //       200,
  //       {
  //         user: {
  //           id: adminId,
  //           userId: adminUserId,
  //           role: 'admin',
  //         },
  //       },
  //       'Profile fetched successfully',
  //     ),
  //   );
  // } else {
  const { user, token } = await getUserProfile(userId);

  return res.json(
    new ApiResponse(200, { user }, 'Profile fetched successfully'),
  );
  // }
});
