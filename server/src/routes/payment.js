import { Router } from 'express';
import Stripe from 'stripe';
import Order from '../models/Order.js';

const router = Router();

const stripe = process.env.STRIPE_SECRET_KEY
  ? new Stripe(process.env.STRIPE_SECRET_KEY)
  : null;

// POST /api/payment/create-intent { orderNumber }
// With a Stripe key: returns a real client secret for Stripe Elements.
// Without one (demo mode): returns { demo: true } and the client shows a
// simulated payment form.
router.post('/create-intent', async (req, res, next) => {
  try {
    const order = await Order.findOne({ orderNumber: req.body.orderNumber });
    if (!order) return res.status(404).json({ message: 'הזמנה לא נמצאה' });
    if (order.paymentStatus === 'paid') {
      return res.status(400).json({ message: 'ההזמנה כבר שולמה' });
    }

    if (!stripe) {
      return res.json({ demo: true, amount: order.total });
    }

    const intent = await stripe.paymentIntents.create({
      amount: Math.round(order.total * 100),
      currency: 'ils',
      metadata: { orderNumber: order.orderNumber },
      description: `אילנית רקמה - הזמנה ${order.orderNumber}`,
    });
    res.json({ clientSecret: intent.client_secret, amount: order.total });
  } catch (err) {
    next(err);
  }
});

// POST /api/payment/confirm { orderNumber }
// Marks the order paid. In demo mode this is called directly by the client;
// with real Stripe, call after the payment intent succeeds (or use webhooks
// in production).
router.post('/confirm', async (req, res, next) => {
  try {
    const order = await Order.findOne({ orderNumber: req.body.orderNumber });
    if (!order) return res.status(404).json({ message: 'הזמנה לא נמצאה' });
    order.paymentStatus = 'paid';
    await order.save();
    res.json({ order });
  } catch (err) {
    next(err);
  }
});

export default router;
