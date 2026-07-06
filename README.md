# אילנית רקמה - חנות אונליין 🧵

חנות אינטרנט מלאה (Full-Stack) לעסק רקמה ממוחשבת ומתנות בעיצוב אישי.

**טכנולוגיות:** React (Vite) • Node.js + Express • MongoDB + Mongoose • JWT • Stripe (אופציונלי)

## דרישות מוקדמות

- Node.js 18 ומעלה
- MongoDB רץ על `mongodb://127.0.0.1:27017`

## התקנה והרצה

```bash
# 1. התקנת תלויות
npm install
npm run install-all

# 2. אתחול הנתונים (קטגוריות, מוצרים לדוגמה, משתמש מנהל)
npm run seed

# 3. הרצת השרת והאתר יחד
npm run dev
```

- האתר: http://localhost:5173
- ה-API: http://localhost:5000

### בניית מסד הנתונים (Collections + אינדקסים)

| פקודה | מה היא עושה | מתי להשתמש |
|---|---|---|
| `npm run setup-db` | בונה את כל האוספים, האינדקסים, משתמש המנהל ונתוני הפתיחה - **בלי למחוק כלום** | הקמה ראשונה, או מול מסד בענן (Atlas) |
| `npm run seed` | **מוחק הכול** ובונה מחדש נתוני דוגמה | איפוס מלא בסביבת פיתוח |

הרצה מול מסד מרוחק (למשל MongoDB Atlas):

```bash
cd server
node src/utils/setup-db.js "mongodb+srv://user:password@cluster.mongodb.net/ilanit-rikma"
```

### הרצת MongoDB ידנית (אם השירות לא פועל)

```powershell
& 'C:\Program Files\MongoDB\Server\7.0\bin\mongod.exe' --dbpath C:\Users\95923\mongodb-data
```

## משתמש מנהל

| שדה | ערך |
|---|---|
| אימייל | admin@ilanit-rikma.co.il |
| סיסמה | admin123 |

לאחר התחברות יופיע קישור "ניהול" בתפריט - ניהול מוצרים, קטגוריות, הזמנות, פניות וגלריה.
**חשוב:** שנו את הסיסמה בקובץ `server/.env` לפני עלייה לאוויר והריצו seed מחדש.

## תשלומים

כברירת מחדל האתר רץ במצב הדגמה (ללא חיוב אמיתי). לחיבור Stripe אמיתי:

1. פתחו חשבון ב-https://stripe.com
2. העתיקו את המפתח הסודי אל `server/.env`:
   ```
   STRIPE_SECRET_KEY=sk_live_...
   ```
3. הפעילו מחדש את השרת.

אפשרויות תשלום נוספות: ביט/פייבוקס ותשלום באיסוף (מנוהלות ידנית דרך לוח הניהול).

## מבנה הפרויקט

```
ilanit-rikma/
├── server/                 # Backend - Express + MongoDB
│   ├── src/
│   │   ├── index.js        # נקודת כניסה
│   │   ├── config/db.js    # חיבור MongoDB
│   │   ├── models/         # User, Product, Category, Order, Message, GalleryImage
│   │   ├── routes/         # auth, products, categories, orders, payment, upload, messages, gallery
│   │   ├── middleware/     # JWT auth, admin guard, multer uploads, error handler
│   │   └── utils/          # price.js (חישוב מחירים), seed.js
│   ├── uploads/            # קבצים שהועלו (תמונות מוצרים, לוגואים, גלריה)
│   └── .env                # הגדרות (פורט, מסד נתונים, JWT, Stripe)
└── client/                 # Frontend - React + Vite (RTL עברית)
    └── src/
        ├── pages/          # Home, Catalog, ProductDetails, Cart, Checkout, ...
        ├── pages/admin/    # לוח ניהול
        ├── components/     # Navbar, Footer, ProductCard, ...
        ├── context/        # AuthContext, CartContext
        └── utils/          # price.js (תצוגת מחיר חי), labels.js
```

## תכונות עיקריות

- 🎨 התאמה אישית מלאה: מידה, צבע, טקסט רקמה, צבע חוט, גופן (עם תצוגה מקדימה חיה), מיקום רקמה, העלאת לוגו, אריזת מתנה
- 💰 מחיר מתעדכן בזמן אמת לפי הבחירות; התמחור הסופי מחושב בשרת
- 🛒 עגלה ששומרת את כל פרטי ההתאמה (נשמרת גם אחרי רענון)
- 🔐 הרשמה/התחברות עם JWT והצפנת סיסמאות (bcrypt); תפקידי לקוח ומנהל
- 📦 לוח ניהול: מוצרים, קטגוריות, הזמנות עם עדכון סטטוס, חיפוש לפי שם/טלפון/מספר הזמנה, פניות לקוחות, גלריה
- 📱 רספונסיבי מלא, RTL, כפתור וואטסאפ צף
- 🔎 חיפוש, סינון לפי קטגוריה, מיון לפי מחיר/פופולריות/חדשים

## עדכון פרטי העסק

- טלפון ווואטסאפ: חפשו `972500000000` בקבצי `client/src` והחליפו למספר האמיתי
- תמונות מוצרים: העלו תמונות אמיתיות דרך לוח הניהול (התמונות הנוכחיות הן ממלאות מקום)
