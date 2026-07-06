// Builds the entire MongoDB database: collections, indexes, admin user and
// starter data. Safe to run repeatedly - existing data is never deleted.
//
// Usage:
//   npm run setup-db                                   (local MongoDB from .env)
//   node src/utils/setup-db.js "mongodb+srv://..."     (remote, e.g. Atlas)
//   MONGO_URI="mongodb+srv://..." npm run setup-db
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import path from 'path';
import { fileURLToPath } from 'url';
import User from '../models/User.js';
import Category from '../models/Category.js';
import Product from '../models/Product.js';
import Order from '../models/Order.js';
import Message from '../models/Message.js';
import GalleryImage from '../models/GalleryImage.js';
import { createAdmin, createCategories, createProducts, createGallery } from './seedData.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.join(__dirname, '..', '..', '.env') });

const models = { User, Category, Product, Order, Message, GalleryImage };

async function setup() {
  const uri = process.argv[2] || process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/ilanit-rikma';
  console.log(`Connecting to: ${uri.replace(/\/\/([^:]+):[^@]+@/, '//$1:****@')}`);
  await mongoose.connect(uri);
  console.log(`Database: ${mongoose.connection.name}\n`);

  // 1. create every collection explicitly (createCollection is a no-op if it
  //    already exists) and sync the indexes defined on the schemas
  for (const [name, model] of Object.entries(models)) {
    await model.createCollection();
    await model.syncIndexes();
    const count = await model.estimatedDocumentCount();
    console.log(`Collection ready: ${model.collection.name.padEnd(15)} (${name}, ${count} documents)`);
  }

  // 2. admin user - created only if missing
  const adminEmail = (process.env.ADMIN_EMAIL || 'admin@ilanit-rikma.co.il').toLowerCase();
  const adminExists = await User.findOne({ email: adminEmail });
  if (adminExists) {
    console.log(`\nAdmin user already exists: ${adminEmail}`);
  } else {
    await createAdmin();
    console.log(`\nAdmin user created: ${adminEmail} / ${process.env.ADMIN_PASSWORD || 'admin123'}`);
  }

  // 3. starter content - only when the store is empty, so real data is
  //    never touched or duplicated
  if ((await Category.estimatedDocumentCount()) === 0) {
    const catDocs = await createCategories();
    console.log(`Categories created: ${Object.keys(catDocs).length}`);
    if ((await Product.estimatedDocumentCount()) === 0) {
      await createProducts(catDocs);
      console.log(`Products created:   ${await Product.estimatedDocumentCount()}`);
    }
  } else {
    console.log('Categories already exist - skipping starter products');
  }

  if ((await GalleryImage.estimatedDocumentCount()) === 0) {
    await createGallery();
    console.log(`Gallery images created: ${await GalleryImage.estimatedDocumentCount()}`);
  }

  console.log('\nDatabase setup complete ✓');
  await mongoose.disconnect();
  process.exit(0);
}

setup().catch((err) => {
  console.error('Setup failed:', err.message);
  process.exit(1);
});
