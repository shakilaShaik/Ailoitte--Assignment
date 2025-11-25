import jwt from 'jsonwebtoken';
import db from '../models/index.js';
import dotenv from 'dotenv';
dotenv.config();

export default async function auth(req, res, next) {
  const header = req.headers.authorization;
  if (!header) return res.status(401).json({ message: 'Missing Authorization header' });
  const token = header.split(' ')[1];
  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    const user = await db.User.findByPk(payload.id);
    if (!user) return res.status(401).json({ message: 'Invalid token: user not found' });
    req.user = { id: user.id, role: user.role, email: user.email };
    next();
  } catch (err) {
    return res.status(401).json({ message: 'Invalid token' });
  }
}
