import jwt from 'jsonwebtoken';
import User from '../models/User.js';

export async function protect(req, res, next) {
  try {
    const header = req.headers.authorization;
    if (!header || !header.startsWith('Bearer ')) {
      return res.status(401).json({ message: 'נדרשת התחברות' });
    }
    const decoded = jwt.verify(header.split(' ')[1], process.env.JWT_SECRET);
    const user = await User.findById(decoded.id);
    if (!user) return res.status(401).json({ message: 'משתמש לא נמצא' });
    req.user = user;
    next();
  } catch {
    return res.status(401).json({ message: 'הרשאה לא תקפה, יש להתחבר מחדש' });
  }
}

// like protect but doesn't fail for guests - attaches user if token present
export async function optionalAuth(req, res, next) {
  try {
    const header = req.headers.authorization;
    if (header && header.startsWith('Bearer ')) {
      const decoded = jwt.verify(header.split(' ')[1], process.env.JWT_SECRET);
      req.user = await User.findById(decoded.id);
    }
  } catch {
    /* guest checkout allowed */
  }
  next();
}

export function adminOnly(req, res, next) {
  if (req.user?.role !== 'admin') {
    return res.status(403).json({ message: 'גישה למנהלים בלבד' });
  }
  next();
}
