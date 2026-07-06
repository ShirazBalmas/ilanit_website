// one-off: adds the gift-boxes category + premium army gift box to an existing
// database without wiping anything. safe to run repeatedly (upsert by slug).
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import path from 'path';
import { fileURLToPath } from 'url';
import Category from '../models/Category.js';
import Product from '../models/Product.js';
import { makePlaceholder, giftBoxCustomization } from './seedData.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.join(__dirname, '..', '..', '.env') });

async function run() {
  await mongoose.connect(process.env.MONGO_URI);

  let cat = await Category.findOne({ slug: 'gift-boxes' });
  if (!cat) {
    cat = await Category.create({
      name: 'מארזי מתנה',
      slug: 'gift-boxes',
      description: 'מארזים מפנקים בהתאמה אישית מלאה',
      image: makePlaceholder('categories', 'gift-boxes.svg', 'מארזי מתנה', 3),
      order: 13,
    });
    console.log('Category created: מארזי מתנה');
  } else {
    console.log('Category already exists: מארזי מתנה');
  }

  const slug = 'army-gift-box-premium';
  const data = {
    name: 'מארז מתנת גיוס פרימיום',
    slug,
    category: cat._id,
    basePrice: 290,
    shortDescription: 'מארז מפנק לגיוס עם רקמה אישית מלאה',
    description:
      'מארז פרימיום לגיוס הכולל מגבת גוף, מגבת פנים, כיסוי לדיסקית, חוגרון ושק כביסה - הכל עם רקמה אישית. בחרו צבע לכל פריט, צבע רקמה, צורה מעל הכיתוב והוסיפו תוספות לבחירתכם.',
    images: [makePlaceholder('products', `${slug}.svg`, 'מארז מתנת גיוס', 5)],
    availableSizes: [],
    availableColors: [],
    material: 'כותנה 100%',
    isFeatured: true,
    customizationOptions: giftBoxCustomization,
  };

  const existing = await Product.findOne({ slug });
  if (existing) {
    await Product.updateOne({ slug }, data);
    console.log('Product updated: מארז מתנת גיוס פרימיום');
  } else {
    await Product.create(data);
    console.log('Product created: מארז מתנת גיוס פרימיום');
  }

  await mongoose.disconnect();
  process.exit(0);
}

run().catch((e) => {
  console.error(e);
  process.exit(1);
});
