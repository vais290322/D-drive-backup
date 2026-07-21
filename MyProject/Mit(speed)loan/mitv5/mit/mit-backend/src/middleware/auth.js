const jwt = require('jsonwebtoken');
const Profile = require('../models/Profile');

const JWT_SECRET = process.env.JWT_SECRET || 'change_this_secret';

async function authenticate(req, res, next) {
  const auth = req.headers.authorization;
  if (!auth || !auth.startsWith('Bearer ')) return res.status(401).json({ message: 'Unauthorized' });

  const token = auth.split(' ')[1];
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    const user = await Profile.findById(decoded.id).lean();
    if (!user) return res.status(401).json({ message: 'Unauthorized' });
    req.user = { id: user._id.toString(), email: user.email, role: user.role };
    next();
  } catch (err) {
    return res.status(401).json({ message: 'Invalid token' });
  }
}

module.exports = authenticate;
