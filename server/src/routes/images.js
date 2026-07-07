import { Router } from 'express';
import Image from '../models/Image.js';

const router = Router();

// serves an image stored in MongoDB by its id
router.get('/:id', async (req, res) => {
  try {
    const img = await Image.findById(req.params.id);
    if (!img) return res.status(404).end();
    res.set('Content-Type', img.contentType);
    res.set('Cache-Control', 'public, max-age=31536000, immutable');
    res.send(img.data);
  } catch {
    res.status(404).end();
  }
});

export default router;
