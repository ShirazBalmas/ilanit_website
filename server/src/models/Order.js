import mongoose from 'mongoose';

const orderItemSchema = new mongoose.Schema(
  {
    product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
    name: { type: String, required: true },
    image: { type: String, default: '' },
    quantity: { type: Number, required: true, min: 1 },
    unitPrice: { type: Number, required: true },
    customization: {
      size: String,
      color: String,
      embroidery: {
        enabled: { type: Boolean, default: false },
        text: String,
        threadColor: String,
        font: String,
        location: String,
      },
      logoUrl: String,
      giftPackaging: { type: Boolean, default: false },
      notes: String,
    },
  },
  { _id: false }
);

const orderSchema = new mongoose.Schema(
  {
    orderNumber: { type: String, required: true, unique: true },
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    customer: {
      fullName: { type: String, required: true },
      phone: { type: String, required: true },
      email: { type: String, required: true },
      city: { type: String, required: true },
      address: { type: String, default: '' },
      notes: { type: String, default: '' },
    },
    items: { type: [orderItemSchema], required: true },
    subtotal: { type: Number, required: true },
    shippingMethod: { type: String, enum: ['pickup', 'delivery'], required: true },
    shippingCost: { type: Number, required: true, default: 0 },
    total: { type: Number, required: true },
    paymentMethod: { type: String, enum: ['card', 'pickup', 'bit'], required: true },
    paymentStatus: { type: String, enum: ['pending', 'paid', 'failed'], default: 'pending' },
    status: {
      type: String,
      enum: ['new', 'in_design', 'in_embroidery', 'ready', 'shipped', 'completed', 'cancelled'],
      default: 'new',
    },
  },
  { timestamps: true }
);

export default mongoose.model('Order', orderSchema);
