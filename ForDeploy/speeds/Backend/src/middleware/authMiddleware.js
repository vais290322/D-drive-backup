import { verifyToken } from '../utils/jwt.js';

export function requireAuth(req, res, next) {
  try {
    const cookieToken = req.cookies?._auth_token;
    const header = req.headers.authorization || '';
    const headerToken = header.startsWith('Bearer ') ? header.slice(7) : null;
    const token = cookieToken || headerToken;
    if (!token) return res.status(401).json({ success: false, message: 'Unauthorized' });
    const payload = verifyToken(token);
    req.user = { id: payload.sub, email: payload.email, role: payload.role };
    next();
  } catch {
    res.status(401).json({ success: false, message: 'Invalid token' });
  }
}


export const isAdmin = (roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ message: "Access denied. Insufficient permissions." });
    }
    next();
  };
};