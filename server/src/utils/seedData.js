// Shared demo/base data used by both seed.js (destructive reset) and
// setup-db.js (idempotent database bootstrap)
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import User from '../models/User.js';
import Category from '../models/Category.js';
import Product from '../models/Product.js';
import GalleryImage from '../models/GalleryImage.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const uploadsDir = path.join(__dirname, '..', '..', 'uploads');

// generates soft placeholder SVGs so the store looks complete before real
// product photos are uploaded through the admin panel
const palette = ['#F3E9DA', '#EADFCE', '#F6EFE4', '#EFE3D0', '#F1E6D6', '#EDE0CB'];
export function makePlaceholder(dir, filename, label, colorIndex = 0) {
  const bg = palette[colorIndex % palette.length];
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="600" height="600" viewBox="0 0 600 600">
  <rect width="600" height="600" fill="${bg}"/>
  <circle cx="300" cy="255" r="110" fill="none" stroke="#C9A24B" stroke-width="3" stroke-dasharray="10 8"/>
  <text x="300" y="248" text-anchor="middle" font-family="Arial" font-size="52" fill="#C9A24B">&#129525;</text>
  <text x="300" y="300" text-anchor="middle" font-family="Arial" font-size="26" fill="#8A7455">&#10047;</text>
  <text x="300" y="450" text-anchor="middle" font-family="Arial" font-size="30" fill="#6B5A43" direction="rtl">${label}</text>
</svg>`;
  const full = path.join(uploadsDir, dir);
  fs.mkdirSync(full, { recursive: true });
  fs.writeFileSync(path.join(full, filename), svg, 'utf8');
  return `/uploads/${dir}/${filename}`;
}

export const threadColors = [
  { name: 'זהב', hex: '#C9A24B' },
  { name: 'כסף', hex: '#B8BCC4' },
  { name: 'לבן', hex: '#FFFFFF' },
  { name: 'שחור', hex: '#2B2B2B' },
  { name: 'ורוד', hex: '#E8A0B4' },
  { name: 'תכלת', hex: '#9CC3E4' },
  { name: 'אדום', hex: '#C0392B' },
];

export const fonts = ['אלגנטי', 'קלאסי', 'כתב יד', 'מודגש', 'ילדותי', 'מודרני'];

export const baseColors = [
  { name: 'לבן', hex: '#FFFFFF' },
  { name: 'שמנת', hex: '#F5EEDC' },
  { name: 'ורוד', hex: '#F2C4CE' },
  { name: 'תכלת', hex: '#BBD5EA' },
  { name: 'אפור', hex: '#C8C8C8' },
  { name: 'שחור', hex: '#2B2B2B' },
];

export const categories = [
  { name: 'סטים לחתן וכלה', slug: 'bride-groom', description: 'סטים מפנקים ליום המיוחד' },
  { name: 'חלוקי רחצה', slug: 'bathrobes', description: 'חלוקים רכים עם רקמה אישית' },
  { name: 'מגבות', slug: 'towels', description: 'מגבות איכותיות עם שם או ברכה' },
  { name: 'מתנות לתינוקות', slug: 'baby-gifts', description: 'מתנות מרגשות לרך הנולד' },
  { name: 'יודאיקה ומסורת', slug: 'judaica', description: 'מוצרי יודאיקה בעבודת יד' },
  { name: 'כיסויי חלה', slug: 'challah-covers', description: 'כיסויי חלה מעוצבים לשבת וחג' },
  { name: 'כיסויי טלית ותפילין', slug: 'tallit-covers', description: 'כיסויים מהודרים עם רקמה אישית' },
  { name: 'כיפות', slug: 'kippahs', description: 'כיפות רקומות לכל אירוע' },
  { name: 'סטים לחלאקה', slug: 'upsherin', description: 'סטים חגיגיים לתספורת הראשונה' },
  { name: 'מיתוג עסקי', slug: 'business', description: 'רקמה והדפסה ממותגת לעסקים' },
  { name: 'חולצות', slug: 'shirts', description: 'חולצות מודפסות ורקומות' },
  { name: 'תיקים', slug: 'bags', description: 'תיקים בעיצוב אישי' },
  { name: 'מתנות בהדפסה אישית', slug: 'custom-prints', description: 'מתנות מודפסות בעיצוב שלכם' },
];

export const defaultCustomization = {
  allowEmbroidery: true,
  allowText: true,
  allowLogoUpload: false,
  threadColors,
  fontOptions: fonts,
  embroideryLocations: ['חזית', 'גב'],
  extraPriceForEmbroidery: 25,
  extraPriceForLongText: 15,
  longTextThreshold: 15,
  extraPriceForLogo: 40,
  extraPriceForGiftPackaging: 20,
};

// [name, slug, categorySlug, basePrice, short, description, overrides]
export const products = [
  ['חלוק רחצה מגבת יוקרתי', 'luxury-bathrobe', 'bathrobes', 189,
    'חלוק מגבת רך במיוחד עם רקמת שם אישית',
    'חלוק רחצה ממגבת כותנה 100% סופגת ורכה. ניתן לרקום שם, ראשי תיבות או ברכה אישית בחזית, בגב או על השרוול. מושלם כמתנה לחתן וכלה, ימי הולדת או פינוק אישי.',
    { availableSizes: ['XS', 'S', 'M', 'L', 'XL', 'XXL'], material: 'כותנה 100%', isFeatured: true,
      customizationOptions: { ...defaultCustomization, embroideryLocations: ['חזית', 'גב', 'שרוול'] } }],
  ['חלוק סאטן לכלה', 'satin-bride-robe', 'bathrobes', 149,
    'חלוק סאטן מרהיב לבוקר החתונה',
    'חלוק סאטן משי מחמיא עם רקמה אישית - "כלה", שם פרטי או תאריך החתונה. הפריט המושלם לצילומי ההתארגנות.',
    { availableSizes: ['S', 'M', 'L', 'XL'], material: 'סאטן', isFeatured: true }],
  ['סט זוגי לחתן וכלה', 'bride-groom-set', 'bride-groom', 349,
    'זוג חלוקים תואמים עם רקמה אישית',
    'סט חלוקים זוגי לחתן ולכלה עם רקמת שמות ותאריך החתונה. מתנה בלתי נשכחת לזוג הטרי - כולל אריזת מתנה מהודרת.',
    { availableSizes: ['S', 'M', 'L', 'XL', 'XXL'], material: 'כותנה 100%', isFeatured: true,
      customizationOptions: { ...defaultCustomization, extraPriceForGiftPackaging: 0 } }],
  ['סט מגבות זוגי', 'couple-towels', 'bride-groom', 159,
    'זוג מגבות רקומות "שלו" ו"שלה"',
    'סט שתי מגבות איכותיות עם רקמה אישית לכל אחד מבני הזוג. אפשרות לשמות, כינויים או תאריך מיוחד.',
    { availableSizes: [], material: 'כותנה 100%' }],
  ['מגבת רחצה גדולה', 'large-bath-towel', 'towels', 89,
    'מגבת גוף סופגת עם שם רקום',
    'מגבת רחצה גדולה ואיכותית 70x140 ס"מ. רקמת שם בפינת המגבת בשלל צבעי חוט וגופנים.',
    { material: 'כותנה 100%',
      customizationOptions: { ...defaultCustomization, embroideryLocations: ['פינת המגבת', 'מרכז'] } }],
  ['סט מגבות אמבטיה', 'towel-set', 'towels', 139,
    'סט 3 מגבות עם רקמה תואמת',
    'סט הכולל מגבת גוף, מגבת ידיים ומגבת פנים - כולן עם רקמה אישית תואמת.',
    { material: 'כותנה 100%' }],
  ['שמיכת תינוק רקומה', 'baby-blanket', 'baby-gifts', 129,
    'שמיכה רכה עם שם התינוק',
    'שמיכת תינוק רכה ומפנקת עם רקמת שם, תאריך לידה או איור מתוק. מתנת לידה מרגשת שנשארת למזכרת.',
    { isFeatured: true, material: 'פלנל רך',
      customizationOptions: { ...defaultCustomization, embroideryLocations: ['פינה', 'מרכז'] } }],
  ['סט לידה מפנק', 'newborn-set', 'baby-gifts', 199,
    'סט מתנה מושלם לרך הנולד',
    'סט הכולל שמיכה, כובע וגוף עם רקמת שם אישית. ארוז באריזת מתנה מהודרת - המתנה המושלמת לביקור בבית החולים.',
    { availableSizes: ['0-3 חודשים', '3-6 חודשים', '6-12 חודשים'], isFeatured: true }],
  ['כרית עם שם לתינוק', 'baby-pillow', 'baby-gifts', 99,
    'כרית נוי רקומה לחדר התינוק',
    'כרית נוי מעוצבת עם שם התינוק ותאריך הלידה. תוספת מקסימה לעיצוב חדר הילדים.',
    {}],
  ['כיסוי חלה קטיפה', 'velvet-challah-cover', 'challah-covers', 119,
    'כיסוי חלה מהודר עם רקמת זהב',
    'כיסוי חלה מקטיפה איכותית עם רקמה מסורתית "לכבוד שבת וחג". ניתן להוסיף שם משפחה או הקדשה אישית.',
    { availableColors: [{ name: 'לבן', hex: '#FFFFFF' }, { name: 'שמנת', hex: '#F5EEDC' }, { name: 'כחול כהה', hex: '#1F3A5F' }, { name: 'בורדו', hex: '#6E1423' }],
      material: 'קטיפה', isFeatured: true }],
  ['כיסוי טלית מהודר', 'tallit-cover', 'tallit-covers', 139,
    'כיסוי טלית עם רקמת שם מוזהבת',
    'כיסוי טלית מהודר עם רקמת שם אישית. אפשרות לסט תואם עם כיסוי תפילין - מתנה מושלמת לבר מצווה.',
    { availableColors: [{ name: 'כחול כהה', hex: '#1F3A5F' }, { name: 'שחור', hex: '#2B2B2B' }, { name: 'בורדו', hex: '#6E1423' }, { name: 'לבן', hex: '#FFFFFF' }],
      material: 'קטיפה' }],
  ['סט טלית ותפילין', 'tallit-tefillin-set', 'tallit-covers', 249,
    'סט כיסויים תואם לבר מצווה',
    'סט מהודר הכולל כיסוי טלית וכיסוי תפילין תואמים עם רקמת שם. מתנה נהדרת לחתן בר המצווה.',
    { availableColors: [{ name: 'כחול כהה', hex: '#1F3A5F' }, { name: 'שחור', hex: '#2B2B2B' }, { name: 'בורדו', hex: '#6E1423' }],
      material: 'קטיפה', isFeatured: true }],
  ['כיפה רקומה', 'embroidered-kippah', 'kippahs', 35,
    'כיפה עם רקמת שם אישית',
    'כיפה איכותית עם רקמת שם. מחירים מיוחדים לכמויות לאירועים - בר מצוות, חתונות ובריתות.',
    { availableColors: [{ name: 'לבן', hex: '#FFFFFF' }, { name: 'כחול כהה', hex: '#1F3A5F' }, { name: 'שחור', hex: '#2B2B2B' }, { name: 'אפור', hex: '#C8C8C8' }],
      customizationOptions: { ...defaultCustomization, extraPriceForEmbroidery: 10, embroideryLocations: ['שוליים'] } }],
  ['סט חלאקה חגיגי', 'upsherin-set', 'upsherin', 179,
    'סט מושלם לתספורת הראשונה',
    'סט חגיגי לחלאקה הכולל כיפה רקומה, טלית קטן וכיסוי אישי עם שם הילד. יום שכולו שמחה עם מזכרת לכל החיים.',
    { isFeatured: true }],
  ['רקמת לוגו לעסקים', 'business-logo', 'business', 45,
    'מיתוג בגדי עבודה ברקמת לוגו',
    'רקמת לוגו איכותית על חולצות, כובעים, סינרים ומדים. מחיר ליחידה - הנחות לכמויות. העלו את הלוגו שלכם ונחזור אליכם עם הדמיה.',
    { customizationOptions: { ...defaultCustomization, allowLogoUpload: true, allowText: false, extraPriceForLogo: 0, embroideryLocations: ['חזה שמאל', 'חזה ימין', 'גב', 'שרוול'] } }],
  ['חולצת פולו רקומה', 'polo-shirt', 'shirts', 79,
    'חולצת פולו עם רקמה אישית או לוגו',
    'חולצת פולו איכותית עם רקמת שם, כיתוב או לוגו עסקי. מתאימה למיתוג צוותים ולמתנות.',
    { availableSizes: ['S', 'M', 'L', 'XL', 'XXL', 'XXXL'], material: 'פיקה כותנה',
      customizationOptions: { ...defaultCustomization, allowLogoUpload: true, embroideryLocations: ['חזה שמאל', 'חזה ימין', 'גב', 'שרוול'] } }],
  ['תיק צד מעוצב', 'tote-bag', 'bags', 69,
    'תיק בד עם רקמה או הדפסה אישית',
    'תיק צד מבד איכותי עם רקמת שם, משפט או איור אישי. ידידותי לסביבה ומעוצב בדיוק בשבילכם.',
    { availableColors: [{ name: 'טבעי', hex: '#E8DCC8' }, { name: 'שחור', hex: '#2B2B2B' }, { name: 'ורוד', hex: '#F2C4CE' }],
      material: 'בד קנבס', customizationOptions: { ...defaultCustomization, allowLogoUpload: true } }],
  ['תיק גן לילדים', 'kids-bag', 'bags', 89,
    'תיק גן עם שם הילד רקום',
    'תיק גן צבעוני ואיכותי עם רקמת שם הילד ואיור לבחירה. הילדים מזהים את התיק שלהם ממרחק!',
    { isFeatured: true }],
  ['כרית מודפסת בעיצוב אישי', 'custom-pillow', 'custom-prints', 79,
    'כרית עם תמונה או עיצוב שלכם',
    'כרית נוי עם הדפסה אישית - תמונה משפחתית, איור או כיתוב. מתנה מרגשת לכל אירוע.',
    { customizationOptions: { ...defaultCustomization, allowEmbroidery: false, allowLogoUpload: true, extraPriceForLogo: 0 } }],
  ['ספל מודפס', 'custom-mug', 'custom-prints', 49,
    'ספל עם הדפסה אישית',
    'ספל קרמיקה איכותי עם הדפסת תמונה, שם או משפט אישי. מתנה קטנה שעושה שמח כל בוקר.',
    { availableColors: [{ name: 'לבן', hex: '#FFFFFF' }, { name: 'שחור', hex: '#2B2B2B' }],
      customizationOptions: { ...defaultCustomization, allowEmbroidery: false, allowLogoUpload: true, extraPriceForLogo: 0 } }],
];

export const galleryCaptions = [
  'חלוק כלה עם רקמת זהב',
  'סט לידה לתינוקת אלמה',
  'כיסוי חלה לשבת חתן',
  'מיתוג צוות למסעדה',
  'תיקי גן לקבוצת חברים',
  'סט חלאקה מרגש',
];

export async function createAdmin() {
  return User.create({
    name: 'אילנית - מנהלת',
    email: process.env.ADMIN_EMAIL || 'admin@ilanit-rikma.co.il',
    password: process.env.ADMIN_PASSWORD || 'admin123',
    role: 'admin',
    phone: '050-0000000',
    city: 'כרמיאל',
  });
}

export async function createCategories() {
  const catDocs = {};
  for (let i = 0; i < categories.length; i++) {
    const c = categories[i];
    const image = makePlaceholder('categories', `${c.slug}.svg`, c.name, i);
    catDocs[c.slug] = await Category.create({ ...c, image, order: i });
  }
  return catDocs;
}

export async function createProducts(catDocs) {
  for (let i = 0; i < products.length; i++) {
    const [name, slug, catSlug, basePrice, shortDescription, description, overrides] = products[i];
    const image = makePlaceholder('products', `${slug}.svg`, name, i);
    await Product.create({
      name,
      slug,
      category: catDocs[catSlug]._id,
      basePrice,
      shortDescription,
      description,
      images: [image],
      availableSizes: overrides.availableSizes ?? [],
      availableColors: overrides.availableColors ?? baseColors,
      material: overrides.material ?? '',
      isFeatured: overrides.isFeatured ?? false,
      customizationOptions: overrides.customizationOptions ?? defaultCustomization,
      sold: Math.floor(Math.random() * 60),
    });
  }
}

export async function createGallery() {
  for (let i = 0; i < galleryCaptions.length; i++) {
    const image = makePlaceholder('gallery', `work-${i + 1}.svg`, galleryCaptions[i], i);
    await GalleryImage.create({ image, caption: galleryCaptions[i], order: i });
  }
}
