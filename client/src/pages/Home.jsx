import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/client.js';
import ProductCard from '../components/ProductCard.jsx';
import BrandsBar from '../components/BrandsBar.jsx';
import Reviews from '../components/Reviews.jsx';
import './Home.css';

// black line icons for the benefit strip
const svgProps = {
  viewBox: '0 0 24 24',
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 1.6,
  strokeLinecap: 'round',
  strokeLinejoin: 'round',
  width: 40,
  height: 40,
};

const TruckIcon = () => (
  <svg {...svgProps}>
    <path d="M2 6h11v10H2z" />
    <path d="M13 9h4l3 3v4h-7z" />
    <circle cx="6" cy="18" r="1.6" />
    <circle cx="16.5" cy="18" r="1.6" />
  </svg>
);
const BadgeIcon = () => (
  <svg {...svgProps}>
    <circle cx="12" cy="9" r="6" />
    <path d="M9.3 9.3l2 2 3.6-3.8" />
    <path d="M8.5 14.2l-1.5 6 5-2.5 5 2.5-1.5-6" />
  </svg>
);
const ChatIcon = () => (
  <svg {...svgProps}>
    <path d="M4 6a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v7a2 2 0 0 1-2 2H9l-4 3v-3H6a2 2 0 0 1-2-2z" />
    <circle cx="8.5" cy="10" r=".7" fill="currentColor" stroke="none" />
    <circle cx="12" cy="10" r=".7" fill="currentColor" stroke="none" />
    <circle cx="15.5" cy="10" r=".7" fill="currentColor" stroke="none" />
  </svg>
);
const SewingIcon = () => (
  <svg {...svgProps}>
    <path d="M3 19h18" />
    <path d="M5 19v-3.5h9V19" />
    <path d="M6 15.5V9h11a1 1 0 0 1 1 1v2.5" />
    <path d="M18 12.5V16" />
    <path d="M18 16v2.5" />
    <circle cx="8.5" cy="12.2" r="1.2" />
  </svg>
);

// benefit highlights shown as a strip under the hero
const features = [
  { icon: <TruckIcon />, title: 'משלוח חינם', text: 'משלוח מהיר לכל הארץ בקנייה מעל 350 ₪' },
  { icon: <BadgeIcon />, title: 'איכות ללא פשרות', text: 'חומרים מעולים ורקמה מדויקת בעבודת יד' },
  { icon: <ChatIcon />, title: 'שירות אישי', text: 'ליווי צמוד מהרעיון ועד המוצר המוגמר' },
  { icon: <SewingIcon />, title: 'רקמה ממוחשבת', text: 'עיצוב אישי מקצועי לכל מוצר' },
];

// "trusted by" logo bar. Replace with your real clients.
// For a real logo image put the file in client/public (e.g. /brands/name.png)
// and add `logo: '/brands/name.png'` to that entry.
const brands = [
  { name: 'משטרת ישראל', logo: '/brands/police.png' },
  { name: 'עיריית כרמיאל', logo: '/brands/karmiel.png'},
  { name: 'צה"ל' , logo: '/brands/IDF.jpg'},
  { name: 'רשת אורט', logo: '/brands/ort.jpg' },
  { name: 'רשת המתנסים כרמיאל' , logo: '/brands/matnas.jpg'},
  { name: 'מסעדת ממן', logo: '/brands/maman.jpg' },
  { name: 'מסעדת הבשורה', logo: '/brands/besora.png' },
  { name: 'לוטם דרעי', logo: '/brands/lotem.jpg' },
  { name: 'יקב כמיסה' , logo: '/brands/kamisa.jpg'},
  { name: 'קרמיקה פרימיום' , logo: '/brands/premium.jpg'},
  { name: 'Pitmaster' , logo: '/brands/pitmaster.jpg'},
  { name: 'מילס טכנולוגיות', logo: '/brands/myls.png' },
  { name: 'ביקור רופא', logo: '/brands/bikor.jpg' },
];

export default function Home() {
  const [featured, setFeatured] = useState([]);
  const [bestSellers, setBestSellers] = useState([]);
  const [categories, setCategories] = useState([]);
  const [gallery, setGallery] = useState([]);
  const [contact, setContact] = useState({ name: '', phone: '', email: '', content: '' });
  const [contactStatus, setContactStatus] = useState(null);

  useEffect(() => {
    api.get('/products', { params: { featured: 1, limit: 4 } }).then((r) => setFeatured(r.data.products));
    api.get('/products', { params: { sort: 'popular', limit: 4 } }).then((r) => setBestSellers(r.data.products));
    api.get('/categories').then((r) => setCategories(r.data.categories.slice(0, 6)));
    api.get('/gallery').then((r) => setGallery(r.data.images));
  }, []);

  async function submitContact(e) {
    e.preventDefault();
    setContactStatus(null);
    try {
      await api.post('/messages', contact);
      setContactStatus({ ok: true, msg: 'תודה! ההודעה התקבלה ונחזור אליכם בהקדם.' });
      setContact({ name: '', phone: '', email: '', content: '' });
    } catch (err) {
      setContactStatus({ ok: false, msg: err.response?.data?.message || 'שגיאה בשליחת ההודעה' });
    }
  }

  return (
    <div>
      {/* Hero */}
      <section className="hero">
        <div className="container hero-inner">
          <h1>אילנית מעצבת לכם חלומות</h1>
          <p className="hero-subtitle">רקמה ממוחשבת • הדפסה אישית • מתנות בעיצוב אישי</p>
          <p className="hero-desc">
            בסטודיו שלנו בכרמיאל כל מוצר נתפר בדיוק בשבילכם - עם שירות אישי, חומרים איכותיים
            ורקמה שמספרת את הסיפור שלכם. מתנות לחתונות, לידות, בר מצוות, עסקים וכל רגע מיוחד.
          </p>
          <div className="hero-actions">
            <Link to="/catalog" className="btn btn-primary">לצפייה בקטלוג</Link>
            <Link to="/catalog" className="btn btn-outline">עצבו מוצר משלכם</Link>
            <a href="#contact" className="btn btn-outline">צרו קשר</a>
          </div>
        </div>
      </section>

      {/* Feature highlights */}
      <section className="features-strip">
        <div className="container features-bar">
          {features.map((f) => (
            <div className="feature-item" key={f.title}>
              <span className="feature-icon">{f.icon}</span>
              <div>
                <strong>{f.title}</strong>
                <p>{f.text}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Categories */}
      <section className="container section">
        <h2 className="section-title">קטגוריות מובילות</h2>
        <p className="section-subtitle">מצאו את המתנה המושלמת לכל אירוע</p>
        <div className="grid grid-categories">
          {categories.map((c) => (
            <Link key={c._id} to={`/catalog/${c.slug}`} className="card category-card">
              <img src={c.image} alt={c.name} loading="lazy" />
              <span>{c.name}</span>
            </Link>
          ))}
        </div>
      </section>

      {/* Featured */}
      {featured.length > 0 && (
        <section className="container section">
          <h2 className="section-title">המוצרים המומלצים שלנו</h2>
          <p className="section-subtitle">הפריטים שהלקוחות שלנו הכי אוהבים</p>
          <div className="grid grid-products">
            {featured.map((p) => (
              <ProductCard key={p._id} product={p} />
            ))}
          </div>
        </section>
      )}

      {/* Best sellers */}
      {bestSellers.length > 0 && (
        <section className="container section">
          <h2 className="section-title">הנמכרים ביותר</h2>
          <div className="grid grid-products">
            {bestSellers.map((p) => (
              <ProductCard key={p._id} product={p} />
            ))}
          </div>
        </section>
      )}

      {/* Trusted by / client logos */}
      <section className="brands-section">
        <div className="container">
          <h2 className="section-title">חברות ועסקים שסמכו עלינו</h2>
          <p className="section-subtitle">גאים לעבוד עם ארגונים, עסקים ומותגים מכל הארץ</p>
          <BrandsBar brands={brands} />
        </div>
      </section>

      {/* Gallery */}
      <section className="section gallery-section" id="gallery">
        <div className="container">
          <h2 className="section-title">מהעבודות שלנו</h2>
          <p className="section-subtitle">הצצה לעבודות שיצרנו ללקוחות מרוצים</p>
          <div className="gallery-grid">
            {gallery.map((g) => (
              <figure key={g._id} className="card gallery-item">
                <img src={g.image} alt={g.caption} loading="lazy" />
                <figcaption>{g.caption}</figcaption>
              </figure>
            ))}
          </div>
        </div>
      </section>

      {/* Google reviews */}
      <section className="section" style={{ paddingBottom: 0 }}>
        <h2 className="section-title">לקוחות ממליצים</h2>
        <p className="section-subtitle">מאות ביקורות חמישה כוכבים בגוגל</p>
      </section>
      <Reviews />

      {/* Contact */}
      <section className="container section contact-section">
        <h2 className="section-title">דברו איתנו</h2>
        <p className="section-subtitle">נשמח לעזור לכם לעצב את המתנה המושלמת</p>
        <div className="contact-grid">
          <div className="contact-info">
            <a href="tel:+972509984731" className="card contact-item">&#128222; 050-9984731</a>
            <a href="https://wa.me/972509984731" target="_blank" rel="noreferrer" className="card contact-item">
              &#128172; שלחו הודעת וואטסאפ
            </a>
            <div className="card contact-item">&#128205; כרמיאל, ישראל - איסוף עצמי בתיאום מראש</div>
          </div>
          <form className="card contact-form" onSubmit={submitContact}>
            {contactStatus && (
              <div className={contactStatus.ok ? 'success-msg' : 'error-msg'}>{contactStatus.msg}</div>
            )}
            <div className="form-grid">
              <div className="form-row">
                <label htmlFor="c-name">שם מלא *</label>
                <input id="c-name" required value={contact.name}
                  onChange={(e) => setContact({ ...contact, name: e.target.value })} />
              </div>
              <div className="form-row">
                <label htmlFor="c-phone">טלפון *</label>
                <input id="c-phone" required type="tel" value={contact.phone}
                  onChange={(e) => setContact({ ...contact, phone: e.target.value })} />
              </div>
            </div>
            <div className="form-row">
              <label htmlFor="c-email">אימייל</label>
              <input id="c-email" type="email" value={contact.email}
                onChange={(e) => setContact({ ...contact, email: e.target.value })} />
            </div>
            <div className="form-row">
              <label htmlFor="c-content">איך נוכל לעזור? *</label>
              <textarea id="c-content" rows="4" required value={contact.content}
                onChange={(e) => setContact({ ...contact, content: e.target.value })} />
            </div>
            <button className="btn btn-primary" type="submit">שליחת הודעה</button>
          </form>
        </div>
      </section>
    </div>
  );
}
