import { generateToken } from '../../helpers/token.js';
import ApiError from '../../utils/apiError.js';
import Staff from '../staff/staff.model.js';
import bcrypt from 'bcryptjs';

export const loginService = async payload => {
  const { userId, password } = payload;

  const user = await Staff.findOne({ phone: userId });
  
  console.log("user : ", user)

  if (!user) {
    throw new ApiError(400, 'Staff not found. Please contact admin.');
  }

  if (!user.isActive) {
    throw new ApiError(403, 'Account is disabled. Please contact admin.');
  }

  // const isPasswordMatched = await bcrypt.compare(password, user.password);

  if (user.password !== password) {
    throw new ApiError(400, 'Incorrect password');
  }

  const userDetails = await Staff.findOne({ phone: userId }).select(
    '-password',
  );

  console.log('details :: ', {
    id: userDetails._id,
    userId: userDetails.phone,
    role: userDetails.role,
  });

  const token = generateToken({
    id: userDetails._id,
    userId: userDetails.phone,
    role: userDetails.role,
  });

  return {
    user: userDetails,
    token,
  };
};

export const getUserProfile = async userId => {
  const user = await Staff.findOne({ phone: userId }).select('-password');

  console.log('user :: ', user);

  if (!user) {
    throw new ApiError(404, 'User not found');
  }

  const token = generateToken({
    id: user._id,
    userId: user.phone,
    role: user.role,
  });

  return {
    user,
    // token,
  };
};
