import multer from 'multer';
import path from 'path';

// images are kept in memory then written to MongoDB (see routes/upload.js),
// so they persist across deploys and work the same locally and in production
const imageFilter = (req, file, cb) => {
  const ok = ['.jpg', '.jpeg', '.png', '.webp', '.svg', '.gif'].includes(
    path.extname(file.originalname).toLowerCase()
  );
  cb(ok ? null : new Error('ניתן להעלות קבצי תמונה בלבד'), ok);
};

export const uploadImage = multer({
  storage: multer.memoryStorage(),
  fileFilter: imageFilter,
  limits: { fileSize: 5 * 1024 * 1024 },
});
