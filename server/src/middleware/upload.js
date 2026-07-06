import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const uploadsRoot = path.join(__dirname, '..', '..', 'uploads');

function makeStorage(subdir) {
  const dir = path.join(uploadsRoot, subdir);
  fs.mkdirSync(dir, { recursive: true });
  return multer.diskStorage({
    destination: (req, file, cb) => cb(null, dir),
    filename: (req, file, cb) => {
      const ext = path.extname(file.originalname).toLowerCase();
      cb(null, `${Date.now()}-${Math.round(Math.random() * 1e6)}${ext}`);
    },
  });
}

const imageFilter = (req, file, cb) => {
  const ok = ['.jpg', '.jpeg', '.png', '.webp', '.svg', '.gif'].includes(
    path.extname(file.originalname).toLowerCase()
  );
  cb(ok ? null : new Error('ניתן להעלות קבצי תמונה בלבד'), ok);
};

export const uploadLogo = multer({
  storage: makeStorage('logos'),
  fileFilter: imageFilter,
  limits: { fileSize: 5 * 1024 * 1024 },
});

export const uploadProductImage = multer({
  storage: makeStorage('products'),
  fileFilter: imageFilter,
  limits: { fileSize: 5 * 1024 * 1024 },
});

export const uploadGalleryImage = multer({
  storage: makeStorage('gallery'),
  fileFilter: imageFilter,
  limits: { fileSize: 5 * 1024 * 1024 },
});
