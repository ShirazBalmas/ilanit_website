import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/client.js';
import ProductCard from '../components/ProductCard.jsx';
import './Home.css';

const testimonials = [
  {
    name: 'מיכל מחיפה',
    text: 'הזמנתי סט חלוקים לחתונה של אחותי - התוצאה הייתה מושלמת! הרקמה עדינה ומדויקת והשירות של אילנית פשוט מכל הלב.',
  },
  {
    name: 'יוסי מכרמיאל',
    text: 'מיתגנו את כל צוות המסעדה בחולצות רקומות. איכות מעולה, מחיר הוגן וזמני אספקה מהירים. ממליץ בחום!',
  },
  {
    name: 'רותם מתל אביב',
    text: 'מתנת הלידה הכי מרגשת שנתתי אי פעם. השמיכה עם השם של התינוקת הייתה בדיוק כמו שדמיינתי ואפילו יותר יפה.',
  },
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

      {/* Testimonials */}
      <section className="container section">
        <h2 className="section-title">לקוחות ממליצים</h2>
        <div className="testimonials">
          {testimonials.map((t, i) => (
            <blockquote key={i} className="card testimonial">
              <p>"{t.text}"</p>
              <cite>- {t.name}</cite>
            </blockquote>
          ))}
        </div>
      </section>

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
