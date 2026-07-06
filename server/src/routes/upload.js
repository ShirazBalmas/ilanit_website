import { Router } from 'express';
import { uploadLogo, uploadProductImage, uploadGalleryImage } from '../middleware/upload.js';
import { protect, adminOnly } from '../middleware/auth.js';

const router = Router();

// public - customers upload logos / design references during customization
router.post('/logo', uploadLogo.single('file'), (req, res) => {
  if (!req.file) return res.status(400).json({ message: 'לא התקבל קובץ' });
  res.json({ url: `/uploads/logos/${req.file.filename}` });
});

router.post('/product', protect, adminOnly, uploadProductImage.single('file'), (req, res) => {
  if (!req.file) return res.status(400).json({ message: 'לא התקבל קובץ' });
  res.json({ url: `/uploads/products/${req.file.filename}` });
});

router.post('/gallery', protect, adminOnly, uploadGalleryImage.single('file'), (req, res) => {
  if (!req.file) return res.status(400).json({ message: 'לא התקבל קובץ' });
  res.json({ url: `/uploads/gallery/${req.file.filename}` });
});

export default router;
