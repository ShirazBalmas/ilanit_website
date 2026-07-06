import { Router } from 'express';
import Order from '../models/Order.js';
import Product from '../models/Product.js';
import { protect, adminOnly, optionalAuth } from '../middleware/auth.js';
import { calcUnitPrice, calcShipping } from '../utils/price.js';

const router = Router();

function makeOrderNumber() {
  const d = new Date();
  const stamp = `${d.getFullYear()}${String(d.getMonth() + 1).padStart(2, '0')}${String(
    d.getDate()
  ).padStart(2, '0')}`;
  return `IR-${stamp}-${Math.floor(1000 + Math.random() * 9000)}`;
}

function validateItemCustomization(product, item) {
  const c = item.customization || {};
  const opts = product.customizationOptions || {};

  if (product.availableSizes?.length && !c.size) {
    return `יש לבחור מידה עבור ${product.name}`;
  }
  if (product.availableColors?.length && !c.color) {
    return `יש לבחור צבע עבור ${product.name}`;
  }
  if (c.embroidery?.enabled) {
    if (!opts.allowEmbroidery) return `המוצר ${product.name} אינו תומך ברקמה`;
    if (opts.allowText && !(c.embroidery.text || '').trim()) {
      return `יש למלא טקסט לרקמה עבור ${product.name}`;
    }
    if (!c.embroidery.threadColor) return `יש לבחור צבע חוט עבור ${product.name}`;
    if (!c.embroidery.font) return `יש לבחור סוג גופן עבור ${product.name}`;
    if (opts.embroideryLocations?.length && !c.embroidery.location) {
      return `יש לבחור מיקום רקמה עבור ${product.name}`;
    }
  }
  return null;
}

// POST /api/orders - create order (guests allowed)
router.post('/', optionalAuth, async (req, res, next) => {
  try {
    const { customer, items, shippingMethod, paymentMethod } = req.body;

    if (!customer?.fullName || !customer?.phone || !customer?.email || !customer?.city) {
      return res.status(400).json({ message: 'נא למלא שם מלא, טלפון, אימייל ועיר' });
    }
    if (!Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ message: 'העגלה ריקה' });
    }
    if (!['pickup', 'delivery'].includes(shippingMethod)) {
      return res.status(400).json({ message: 'יש לבחור שיטת משלוח' });
    }
    if (shippingMethod === 'delivery' && !customer.address) {
      return res.status(400).json({ message: 'נא למלא כתובת למשלוח' });
    }
    if (!['card', 'pickup', 'bit'].includes(paymentMethod)) {
      return res.status(400).json({ message: 'יש לבחור אמצעי תשלום' });
    }

    // build items with server-side pricing
    const orderItems = [];
    let subtotal = 0;
    for (const item of items) {
      const product = await Product.findById(item.productId);
      if (!product) return res.status(400).json({ message: 'מוצר לא נמצא' });
      if (!product.inStock) {
        return res.status(400).json({ message: `המוצר ${product.name} אזל מהמלאי` });
      }
      const invalid = validateItemCustomization(product, item);
      if (invalid) return res.status(400).json({ message: invalid });

      const quantity = Math.max(1, Number(item.quantity) || 1);
      const unitPrice = calcUnitPrice(product, item.customization);
      subtotal += unitPrice * quantity;

      orderItems.push({
        product: product._id,
        name: product.name,
        image: product.images?.[0] || '',
        quantity,
        unitPrice,
        customization: item.customization || {},
      });
    }

    const shippingCost = calcShipping(shippingMethod, subtotal);
    const order = await Order.create({
      orderNumber: makeOrderNumber(),
      user: req.user?._id,
      customer,
      items: orderItems,
      subtotal,
      shippingMethod,
      shippingCost,
      total: subtotal + shippingCost,
      paymentMethod,
      paymentStatus: 'pending',
    });

    // update popularity counters
    await Promise.all(
      orderItems.map((i) =>
        Product.findByIdAndUpdate(i.product, { $inc: { sold: i.quantity } })
      )
    );

    res.status(201).json({ order });
  } catch (err) {
    next(err);
  }
});

// GET /api/orders/mine
router.get('/mine', protect, async (req, res, next) => {
  try {
    const orders = await Order.find({ user: req.user._id }).sort({ createdAt: -1 });
    res.json({ orders });
  } catch (err) {
    next(err);
  }
});

// GET /api/orders/number/:orderNumber - order confirmation lookup
router.get('/number/:orderNumber', async (req, res, next) => {
  try {
    const order = await Order.findOne({ orderNumber: req.params.orderNumber });
    if (!order) return res.status(404).json({ message: 'הזמנה לא נמצאה' });
    res.json({ order });
  } catch (err) {
    next(err);
  }
});

// admin: GET /api/orders?search=&status=
router.get('/', protect, adminOnly, async (req, res, next) => {
  try {
    const { search, status } = req.query;
    const filter = {};
    if (status) filter.status = status;
    if (search) {
      filter.$or = [
        { orderNumber: { $regex: search, $options: 'i' } },
        { 'customer.fullName': { $regex: search, $options: 'i' } },
        { 'customer.phone': { $regex: search, $options: 'i' } },
      ];
    }
    const orders = await Order.find(filter).sort({ createdAt: -1 });
    res.json({ orders });
  } catch (err) {
    next(err);
  }
});

// admin: GET /api/orders/:id
router.get('/:id', protect, adminOnly, async (req, res, next) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) return res.status(404).json({ message: 'הזמנה לא נמצאה' });
    res.json({ order });
  } catch (err) {
    next(err);
  }
});

// admin: PATCH /api/orders/:id/status
router.patch('/:id/status', protect, adminOnly, async (req, res, next) => {
  try {
    const { status, paymentStatus } = req.body;
    const update = {};
    if (status) update.status = status;
    if (paymentStatus) update.paymentStatus = paymentStatus;
    const order = await Order.findByIdAndUpdate(req.params.id, update, {
      new: true,
      runValidators: true,
    });
    if (!order) return res.status(404).json({ message: 'הזמנה לא נמצאה' });
    res.json({ order });
  } catch (err) {
    next(err);
  }
});

export default router;
