import { Router } from 'express';
import Message from '../models/Message.js';
import { protect, adminOnly } from '../middleware/auth.js';

const router = Router();

router.post('/', async (req, res, next) => {
  try {
    const { name, phone, email, content } = req.body;
    if (!name || !phone || !content) {
      return res.status(400).json({ message: 'נא למלא שם, טלפון ותוכן הפנייה' });
    }
    const message = await Message.create({ name, phone, email, content });
    res.status(201).json({ message });
  } catch (err) {
    next(err);
  }
});

router.get('/', protect, adminOnly, async (req, res, next) => {
  try {
    const messages = await Message.find().sort({ createdAt: -1 });
    res.json({ messages });
  } catch (err) {
    next(err);
  }
});

router.patch('/:id', protect, adminOnly, async (req, res, next) => {
  try {
    const message = await Message.findByIdAndUpdate(
      req.params.id,
      { handled: req.body.handled },
      { new: true }
    );
    res.json({ message });
  } catch (err) {
    next(err);
  }
});

export default router;
