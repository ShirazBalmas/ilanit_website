import mongoose from 'mongoose';

const colorSchema = new mongoose.Schema({ name: String, hex: String }, { _id: false });

const productSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true },
    description: { type: String, default: '' },
    shortDescription: { type: String, default: '' },
    category: { type: mongoose.Schema.Types.ObjectId, ref: 'Category', required: true },
    images: [{ type: String }],
    basePrice: { type: Number, required: true, min: 0 },
    availableSizes: [{ type: String }],
    availableColors: [colorSchema],
    material: { type: String, default: '' },
    customizationOptions: {
      allowEmbroidery: { type: Boolean, default: true },
      allowText: { type: Boolean, default: true },
      allowLogoUpload: { type: Boolean, default: false },
      threadColors: [colorSchema],
      fontOptions: [{ type: String }],
      embroideryLocations: [{ type: String }],
      extraPriceForEmbroidery: { type: Number, default: 0 },
      extraPriceForLongText: { type: Number, default: 0 },
      longTextThreshold: { type: Number, default: 15 },
      extraPriceForLogo: { type: Number, default: 0 },
      extraPriceForGiftPackaging: { type: Number, default: 0 },
    },
    inStock: { type: Boolean, default: true },
    isFeatured: { type: Boolean, default: false },
    sold: { type: Number, default: 0 },
  },
  { timestamps: true }
);

productSchema.index({ name: 'text', description: 'text' });

export default mongoose.model('Product', productSchema);
