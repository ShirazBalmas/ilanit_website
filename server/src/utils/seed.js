// Destructive reset: wipes ALL data and rebuilds demo content from scratch.
// For a safe, non-destructive bootstrap (e.g. against MongoDB Atlas) use
// setup-db.js instead.
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { connectDB } from '../config/db.js';
import User from '../models/User.js';
import Category from '../models/Category.js';
import Product from '../models/Product.js';
import GalleryImage from '../models/GalleryImage.js';
import {
  categories,
  products,
  createAdmin,
  createCategories,
  createProducts,
  createGallery,
} from './seedData.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.join(__dirname, '..', '..', '.env') });

async function seed() {
  await connectDB();

  await Promise.all([
    User.deleteMany({}),
    Category.deleteMany({}),
    Product.deleteMany({}),
    GalleryImage.deleteMany({}),
  ]);

  await createAdmin();
  const catDocs = await createCategories();
  await createProducts(catDocs);
  await createGallery();

  console.log('Seed complete:');
  console.log(`  Categories: ${categories.length}`);
  console.log(`  Products:   ${products.length}`);
  console.log(`  Admin user: ${process.env.ADMIN_EMAIL || 'admin@ilanit-rikma.co.il'} / ${process.env.ADMIN_PASSWORD || 'admin123'}`);
  process.exit(0);
}

seed().catch((err) => {
  console.error(err);
  process.exit(1);
});
