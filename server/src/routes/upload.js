import { Router } from 'express';
import Image from '../models/Image.js';
import { uploadImage } from '../middleware/upload.js';
import { protect, adminOnly } from '../middleware/auth.js';

const router = Router();

// saves the uploaded file bytes into MongoDB and returns a URL that
// routes/images.js serves it from
async function saveToDb(file) {
  const img = await Image.create({
    data: file.buffer,
    contentType: file.mimetype,
    filename: file.originalname,
  });
  return `/api/images/${img._id}`;
}

// public - customers upload logos / design references during customization
router.post('/logo', uploadImage.single('file'), async (req, res, next) => {
  try {
    if (!req.file) return res.status(400).json({ message: 'לא התקבל קובץ' });
    res.json({ url: await saveToDb(req.file) });
  } catch (err) {
    next(err);
  }
});

router.post('/product', protect, adminOnly, uploadImage.single('file'), async (req, res, next) => {
  try {
    if (!req.file) return res.status(400).json({ message: 'לא התקבל קובץ' });
    res.json({ url: await saveToDb(req.file) });
  } catch (err) {
    next(err);
  }
});

router.post('/gallery', protect, adminOnly, uploadImage.single('file'), async (req, res, next) => {
  try {
    if (!req.file) return res.status(400).json({ message: 'לא התקבל קובץ' });
    res.json({ url: await saveToDb(req.file) });
  } catch (err) {
    next(err);
  }
});

export default router;
