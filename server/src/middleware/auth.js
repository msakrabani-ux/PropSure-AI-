import jwt from 'jsonwebtoken';
import User from '../models/User.js';

async function userFromToken(req) {
  const header = req.headers.authorization || '';
  if (!header.startsWith('Bearer ')) return null;
  try {
    const { id } = jwt.verify(header.slice(7), process.env.JWT_SECRET);
    return await User.findById(id);
  } catch {
    return null;
  }
}

export async function protect(req, res, next) {
  const user = await userFromToken(req);
  if (!user) return res.status(401).json({ message: 'Please log in to continue' });
  req.user = user;
  next();
}

export async function optionalAuth(req, _res, next) {
  req.user = await userFromToken(req);
  next();
}

export function adminOnly(req, res, next) {
  if (req.user?.role !== 'admin') return res.status(403).json({ message: 'Admin access required' });
  next();
}