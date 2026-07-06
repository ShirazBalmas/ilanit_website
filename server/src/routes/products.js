import { Router } from 'express';
import Product from '../models/Product.js';
import Category from '../models/Category.js';
import { protect, adminOnly } from '../middleware/auth.js';

const router = Router();

function slugify(name) {
  return (
    name
      .trim()
      .replace(/\s+/g, '-')
      .replace(/[^\w֐-׿-]/g, '') || `product-${Date.now()}`
  );
}

// GET /api/products?category=slug&search=&sort=price|price_desc|popular|newest&featured=1
router.get('/', async (req, res, next) => {
  try {
    const { category, search, sort, featured, limit } = req.query;
    const filter = {};

    if (category) {
      const cat = await Category.findOne({ slug: category });
      if (!cat) return res.json({ products: [] });
      filter.category = cat._id;
    }
    if (featured) filter.isFeatured = true;
    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
      ];
    }

    const sortMap = {
      price: { basePrice: 1 },
      price_desc: { basePrice: -1 },
      popular: { sold: -1 },
      newest: { createdAt: -1 },
    };

    const products = await Product.find(filter)
      .populate('category', 'name slug')
      .sort(sortMap[sort] || { createdAt: -1 })
      .limit(Number(limit) || 0);

    res.json({ products });
  } catch (err) {
    next(err);
  }
});

// GET /api/products/:slug
router.get('/:slug', async (req, res, next) => {
  try {
    const product = await Product.findOne({ slug: req.params.slug }).populate(
      'category',
      'name slug'
    );
    if (!product) return res.status(404).json({ message: 'המוצר לא נמצא' });
    res.json({ product });
  } catch (err) {
    next(err);
  }
});

// admin CRUD
router.post('/', protect, adminOnly, async (req, res, next) => {
  try {
    const data = { ...req.body };
    if (!data.slug) data.slug = slugify(data.name || '');
    const product = await Product.create(data);
    res.status(201).json({ product });
  } catch (err) {
    next(err);
  }
});

router.put('/:id', protect, adminOnly, async (req, res, next) => {
  try {
    const product = await Product.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!product) return res.status(404).json({ message: 'המוצר לא נמצא' });
    res.json({ product });
  } catch (err) {
    next(err);
  }
});

router.delete('/:id', protect, adminOnly, async (req, res, next) => {
  try {
    await Product.findByIdAndDelete(req.params.id);
    res.json({ ok: true });
  } catch (err) {
    next(err);
  }
});

export default router;
