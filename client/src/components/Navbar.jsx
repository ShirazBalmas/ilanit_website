import { useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import { useCart } from '../context/CartContext.jsx';
import './Navbar.css';

export default function Navbar() {
  const { user, logout } = useAuth();
  const { count } = useCart();
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();

  function handleLogout() {
    logout();
    setOpen(false);
    navigate('/');
  }

  const close = () => setOpen(false);

  return (
    <header className="navbar">
      <div className="container navbar-inner">
        <Link to="/" className="brand" onClick={close}>
          <img src="/ilanit.jpeg" alt="אילנית רקמה" className="brand-icon" />
          <span>
            <strong>אילנית רקמה</strong>
            <small>מתנות בעיצוב אישי</small>
          </span>
        </Link>

        <button className="menu-toggle" onClick={() => setOpen(!open)} aria-label="תפריט">
          &#9776;
        </button>

        <nav className={`nav-links ${open ? 'open' : ''}`}>
          <NavLink to="/" onClick={close}>בית</NavLink>
          <NavLink to="/catalog" onClick={close}>קטלוג</NavLink>
          <a href="/#gallery" onClick={close}>גלריה</a>
          <a href="/#contact" onClick={close}>צור קשר</a>
          {user ? (
            <>
              <NavLink to="/profile" onClick={close}>החשבון שלי</NavLink>
              {user.role === 'admin' && <NavLink to="/admin" onClick={close}>ניהול</NavLink>}
              <button className="link-btn" onClick={handleLogout}>התנתקות</button>
            </>
          ) : (
            <NavLink to="/login" onClick={close}>התחברות</NavLink>
          )}
        </nav>

        <Link to="/cart" className="cart-link" onClick={close} aria-label="עגלת קניות">
          &#128722;
          {count > 0 && <span className="cart-badge">{count}</span>}
        </Link>
      </div>
    </header>
  );
}
