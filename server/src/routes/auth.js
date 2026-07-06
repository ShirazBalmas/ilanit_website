import { Router } from 'express';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import { protect } from '../middleware/auth.js';

const router = Router();

function signToken(user) {
  return jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES || '7d',
  });
}

function userPayload(user) {
  return {
    id: user._id,
    name: user.name,
    email: user.email,
    phone: user.phone,
    role: user.role,
    city: user.city,
    address: user.address,
  };
}

// POST /api/auth/register
router.post('/register', async (req, res, next) => {
  try {
    const { name, email, password, phone } = req.body;
    if (!name || !email || !password) {
      return res.status(400).json({ message: 'נא למלא שם, אימייל וסיסמה' });
    }
    if (password.length < 6) {
      return res.status(400).json({ message: 'הסיסמה חייבת להכיל לפחות 6 תווים' });
    }
    const exists = await User.findOne({ email: email.toLowerCase() });
    if (exists) return res.status(400).json({ message: 'כתובת האימייל כבר רשומה במערכת' });

    const user = await User.create({ name, email, password, phone });
    res.status(201).json({ token: signToken(user), user: userPayload(user) });
  } catch (err) {
    next(err);
  }
});

// POST /api/auth/login
router.post('/login', async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email: (email || '').toLowerCase() }).select('+password');
    if (!user || !(await user.comparePassword(password || ''))) {
      return res.status(401).json({ message: 'אימייל או סיסמה שגויים' });
    }
    res.json({ token: signToken(user), user: userPayload(user) });
  } catch (err) {
    next(err);
  }
});

// GET /api/auth/me
router.get('/me', protect, (req, res) => {
  res.json({ user: userPayload(req.user) });
});

// PUT /api/auth/profile
router.put('/profile', protect, async (req, res, next) => {
  try {
    const { name, phone, city, address, password } = req.body;
    if (name) req.user.name = name;
    if (phone !== undefined) req.user.phone = phone;
    if (city !== undefined) req.user.city = city;
    if (address !== undefined) req.user.address = address;
    if (password) {
      if (password.length < 6) {
        return res.status(400).json({ message: 'הסיסמה חייבת להכיל לפחות 6 תווים' });
      }
      req.user.password = password;
    }
    await req.user.save();
    res.json({ user: userPayload(req.user) });
  } catch (err) {
    next(err);
  }
});

// wishlist
router.get('/wishlist', protect, async (req, res) => {
  const populated = await req.user.populate('wishlist');
  res.json({ wishlist: populated.wishlist });
});

router.post('/wishlist/:productId', protect, async (req, res) => {
  const id = req.params.productId;
  const has = req.user.wishlist.some((p) => p.toString() === id);
  if (has) {
    req.user.wishlist = req.user.wishlist.filter((p) => p.toString() !== id);
  } else {
    req.user.wishlist.push(id);
  }
  await req.user.save();
  res.json({ wishlist: req.user.wishlist });
});

export default router;
