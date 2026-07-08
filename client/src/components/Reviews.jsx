import { useRef } from 'react';
import './Reviews.css';

// Real reviews from the business's Google profile. Live-pulling Google reviews
// requires the paid Google Places API + key; these are the actual review texts,
// with a link out to the full Google reviews page.
const GOOGLE_URL =
  'https://www.google.com/search?q=%D7%90%D7%99%D7%9C%D7%A0%D7%99%D7%AA+%D7%9E%D7%A2%D7%A6%D7%91%D7%AA+%D7%9C%D7%9B%D7%9D+%D7%97%D7%9C%D7%95%D7%9E%D7%95%D7%AA+%D7%91%D7%99%D7%A7%D7%95%D7%A8%D7%95%D7%AA';

const RATING = 5.0;
const COUNT = 13;

const reviews = [
  { name: 'אוהד בר יצחק', initial: 'א', color: '#C0392B',
    text: 'אילנית מקצוענית מאוד. שירות חם ודואג לכל הפרטים הקטנים. תודה על זמינות ותשומת לב שלא מוצאים היום בבעלי מקצוע! 10/10' },
  { name: 'Michal Gal', initial: 'M', color: '#8E44AD',
    text: 'אני רוצה להמליץ מכל הלב על השירותים והמוצרים של אילנית. קודם כל היחס השירותי והאדיב שאין בכל מקום, וכמובן שעל יופי ואיכות אין פשרות. ממליצה לכולם להזמין וליהנות משירות מספר 1 באמת!' },
  { name: 'Shiraz Balmas', initial: 'S', color: '#16A085',
    text: 'קיבלתי שירות נהדר, מחיר נוח לכל כיס. הזמנתי בהתראה קצרה והכל היה מוכן בזמן ופשוט מהמם. אילנית תודה רבה לך, אישה מדהימה, מחכה להזמין ממך שוב בקרוב ❤️' },
  { name: 'natalie shterenshus', initial: 'N', color: '#E67E22',
    text: 'אלופה! האחראית היחידה לכל המיתוג של מסיבת הרווקות/חינה/מקווה וחתונה שלנו ❤️ תודה מכל הלב' },
  { name: 'תומר פוירשטיין', initial: 'ת', color: '#2E86C1',
    text: 'מתנה מושלמת, נשארת בתור מזכרת לילד לאחר שגדל. שירות מהיר ואדיב מאוד! תודה' },
  { name: 'שלמה קדוש', initial: 'ש', color: '#6B5A43',
    text: 'איכות ללא פשרות, יחס אדיב, מחירים סבירים, שירות מעולה. ממליץ בחום' },
  { name: 'מוטי קדוש', initial: 'מ', color: '#D35400',
    text: 'עבודה מקצועית, אמינה ומדויקת להפליא! במחירים מצוינים. מומלץ באהבה!' },
  { name: 'אלברטו קדוש', initial: 'א', color: '#27AE60',
    text: 'שירות מעולה, מקצועי ואמין, מחירים מעולים.' },
  { name: 'בת אל שטרית', initial: 'ב', color: '#C2185B',
    text: 'שירות מושלם, איכות ממש טובה 🥰 ללא ספק עוד אחזור 😍' },
  { name: 'Limor Kriaf', initial: 'L', color: '#5D4037',
    text: 'אלופה, שירות ויחס מעל המצופה.' },
  { name: 'עינת מוטעי', initial: 'ע', color: '#00796B',
    text: 'מהממת ומוכשרת.' },
];

const Stars = () => <span className="stars">{'★★★★★'}</span>;

const GoogleG = () => (
  <svg viewBox="0 0 48 48" width="20" height="20" aria-hidden="true">
    <path fill="#4285F4" d="M45.12 24.5c0-1.56-.14-3.06-.4-4.5H24v8.51h11.84c-.51 2.75-2.06 5.08-4.39 6.64v5.52h7.11c4.16-3.83 6.56-9.47 6.56-16.17z" />
    <path fill="#34A853" d="M24 46c5.94 0 10.92-1.97 14.56-5.33l-7.11-5.52c-1.97 1.32-4.49 2.1-7.45 2.1-5.73 0-10.58-3.87-12.31-9.07H4.34v5.7A21.99 21.99 0 0 0 24 46z" />
    <path fill="#FBBC05" d="M11.69 28.18A13.2 13.2 0 0 1 11 24c0-1.45.25-2.86.69-4.18v-5.7H4.34A21.99 21.99 0 0 0 2 24c0 3.55.85 6.91 2.34 9.88l7.35-5.7z" />
    <path fill="#EA4335" d="M24 10.75c3.23 0 6.13 1.11 8.41 3.29l6.31-6.31C34.91 4.18 29.93 2 24 2 15.4 2 7.96 6.94 4.34 14.12l7.35 5.7c1.73-5.2 6.58-9.07 12.31-9.07z" />
  </svg>
);

export default function Reviews() {
  const trackRef = useRef(null);
  const scroll = (dir) => {
    const t = trackRef.current;
    if (!t) return;
    const amount = Math.max(280, t.clientWidth * 0.8);
    const max = t.scrollWidth - t.clientWidth;
    const cur = t.scrollLeft;
    // wrap to the other end at the boundaries so the arrows never get stuck
    let target;
    if (dir > 0) target = cur >= max - 2 ? 0 : Math.min(max, cur + amount);
    else target = cur <= 2 ? max : Math.max(0, cur - amount);
    t.scrollLeft = target;
  };

  return (
    <section className="reviews-section">
      <div className="container reviews-inner">
        <div className="reviews-summary">
          <GoogleG />
          <div className="reviews-score">{RATING.toFixed(1)}</div>
          <Stars />
          <div className="reviews-count">{COUNT} ביקורות בגוגל</div>
          <a href={GOOGLE_URL} target="_blank" rel="noreferrer" className="btn btn-primary btn-sm">
            כתבו ביקורת
          </a>
        </div>

        <div className="reviews-carousel">
          <button className="reviews-arrow" onClick={() => scroll(-1)} aria-label="שמאלה">
            &#8592;
          </button>

          <div className="reviews-track" ref={trackRef}>
            {reviews.map((r) => (
              <div className="review-card" key={r.name}>
                <div className="review-head">
                  <span className="review-avatar" style={{ background: r.color }}>
                    {r.initial}
                  </span>
                  <div className="review-meta">
                    <strong>{r.name}</strong>
                    <Stars />
                  </div>
                  <GoogleG />
                </div>
                <p className="review-text">{r.text}</p>
              </div>
            ))}
          </div>

          <button className="reviews-arrow" onClick={() => scroll(1)} aria-label="ימינה">
            &#8594;
          </button>
        </div>
      </div>
    </section>
  );
}
