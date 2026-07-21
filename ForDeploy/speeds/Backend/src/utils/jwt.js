import jwt from 'jsonwebtoken';

export function signToken({ id, email, role }, expiresIn = '1d') {
  return jwt.sign({ sub: id, email, role }, process.env.JWT_SECRET, { expiresIn });
}

export function verifyToken(token) {
  return jwt.verify(token, process.env.JWT_SECRET);
}