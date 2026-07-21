import { adminUserId } from '../config/credentials.js';
import { verifyToken } from '../helpers/token.js';
import MargParties from '../modules/mastersync/marg_parties.model.js';
import Staff from '../modules/staff/staff.model.js';
import ApiError from '../utils/apiError.js';

export const authMiddleware = async (req, res, next) => {
  try {
    const token =
      req.cookies?.token || req.headers.authorization?.split('Bearer ')[1];

    console.log('token :: ', token);

    if (!token) {
      return next(new ApiError(401, 'Unauthorized Access'));
    }

    const decodedToken = verifyToken(token);

    if (!decodedToken) {
      return next(new ApiError(401, 'Invalid or expired token'));
    }

    if (decodedToken.userId === adminUserId && decodedToken.role === 'admin') {
      req.user = {
        id: decodedToken.id,
        userId: decodedToken.userId,
        role: decodedToken.role,
      };
    } else if (decodedToken.role === 'party') {
      const party = await MargParties.findById(decodedToken.id).select(
        '-password',
      );

      if (!party) {
        return next(new ApiError(401, 'Unauthorized - Party not found'));
      }

      req.user = {
        id: party?._id,
        userId: party?.userId,
        rid: party?.rid || null,
        role: party?.role || 'party',
      };
    } else {
      const user = await Staff.findById(decodedToken.id);

      if (!user) {
        return next(new ApiError(401, 'Unauthorized - Staff not found'));
      }

      req.user = {
        id: user._id,
        userId: user.phone,  // Staff model uses 'phone' as the identifier, not 'userId'
        role: user.role,
      };
    }

    next();
  } catch (error) {
    next(error instanceof ApiError ? error : new ApiError(401, 'Unauthorized'));
  }
};

export const authorize = (...allowedRoles) => {
  return (req, res, next) => {
    if (!allowedRoles.includes(String(req.user.role).toLowerCase())) {
      return next(
        new ApiError(403, 'Not Authorized - Insufficient permissions'),
      );
    }
    next();
  };
};
