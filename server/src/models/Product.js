import mongoose from 'mongoose';

const colorSchema = new mongoose.Schema({ name: String, hex: String }, { _id: false });

// A choice inside a selection group. extraPrice lets a specific choice add to
// the price (usually 0). hex is optional - if set the choice renders as a
// color swatch instead of a text pill.
const choiceSchema = new mongoose.Schema(
  { label: String, extraPrice: { type: Number, default: 0 }, hex: String },
  { _id: false }
);

// A configurable dropdown/pill group, e.g. "צבע המגבת גוף" with its colors,
// or "צורה מעל הכיתוב" with its shapes.
const optionGroupSchema = new mongoose.Schema(
  { label: String, required: { type: Boolean, default: true }, choices: [choiceSchema] },
  { _id: false }
);

// A free-text field, e.g. "פירוט הרקמה במגבת גוף".
const textFieldSchema = new mongoose.Schema(
  { label: String, required: { type: Boolean, default: false }, placeholder: String },
  { _id: false }
);

// A paid yes/no add-on, e.g. "תוספת שרשרת לדיסקית" (+10 ₪).
const addonSchema = new mongoose.Schema(
  { label: String, price: { type: Number, default: 0 } },
  { _id: false }
);

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
      // flexible per-product options (gift-box style products)
      optionGroups: [optionGroupSchema],
      extraTextFields: [textFieldSchema],
      addons: [addonSchema],
    },
    inStock: { type: Boolean, default: true },
    isFeatured: { type: Boolean, default: false },
    sold: { type: Number, default: 0 },
  },
  { timestamps: true }
);

productSchema.index({ name: 'text', description: 'text' });

export default mongoose.model('Product', productSchema);
