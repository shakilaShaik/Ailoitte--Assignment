import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import db from '../models/index.js';

export async function signup(req, res) {
  const { name, email, password } = req.body;
  try {
    const exists = await db.User.findOne({ where: { email } });
    if (exists) return res.status(400).json({ message: 'Email already registered' });
    const hash = await bcrypt.hash(password, 10);
    const user = await db.User.create({ name, email, password: hash, role: 'customer' });
    return res.status(201).json({ id: user.id, email: user.email, name: user.name });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Server error' });
  }
}

export async function login(req, res) {
  const { email, password } = req.body;
  try {
    const user = await db.User.findOne({ where: { email } });
    if (!user) return res.status(401).json({ message: 'Invalid credentials' });
    const ok = await bcrypt.compare(password, user.password);
    if (!ok) return res.status(401).json({ message: 'Invalid credentials' });
    const token = jwt.sign({ id: user.id, role: user.role }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES_IN || '7d' });
    return res.json({ token });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Server error' });
  }
}
