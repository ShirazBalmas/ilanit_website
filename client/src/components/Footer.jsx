import { Link } from 'react-router-dom';
import './Footer.css';

export default function Footer() {
  return (
    <footer className="footer" id="contact">
      <div className="container footer-grid">
        <div>
          <h3>אילנית רקמה</h3>
          <p>
            רקמה ממוחשבת, הדפסה אישית ומתנות בעיצוב אישי.
            <br />
            עבודת יד באהבה, שירות אישי ואיכות בלתי מתפשרת.
          </p>
        </div>
        <div>
          <h4>ניווט מהיר</h4>
          <Link to="/catalog">קטלוג מוצרים</Link>
          <Link to="/cart">עגלת קניות</Link>
          <Link to="/login">התחברות</Link>
        </div>
        <div>
          <h4>יצירת קשר</h4>
          <a href="tel:+972500000000">&#128222; 050-0000000</a>
          <a href="https://wa.me/972500000000" target="_blank" rel="noreferrer">
            &#128172; וואטסאפ
          </a>
          <span>&#128205; כרמיאל, ישראל</span>
        </div>
      </div>
      <div className="footer-bottom">
        <div className="container">
          &copy; {new Date().getFullYear()} אילנית רקמה - כל הזכויות שמורות
        </div>
      </div>
    </footer>
  );
}
