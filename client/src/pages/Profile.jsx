import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/client.js';
import { useAuth } from '../context/AuthContext.jsx';
import { formatPrice } from '../utils/price.js';
import { ORDER_STATUS_LABELS } from '../utils/labels.js';
import './Profile.css';

export default function Profile() {
  const { user, updateProfile } = useAuth();
  const [orders, setOrders] = useState([]);
  const [wishlist, setWishlist] = useState([]);
  const [form, setForm] = useState({
    name: user?.name || '',
    phone: user?.phone || '',
    city: user?.city || '',
    address: user?.address || '',
    password: '',
  });
  const [status, setStatus] = useState(null);

  useEffect(() => {
    api.get('/orders/mine').then((r) => setOrders(r.data.orders));
    api.get('/auth/wishlist').then((r) => setWishlist(r.data.wishlist));
  }, []);

  async function saveProfile(e) {
    e.preventDefault();
    setStatus(null);
    try {
      const data = { ...form };
      if (!data.password) delete data.password;
      await updateProfile(data);
      setForm((f) => ({ ...f, password: '' }));
      setStatus({ ok: true, msg: 'הפרטים נשמרו בהצלחה' });
    } catch (err) {
      setStatus({ ok: false, msg: err.response?.data?.message || 'שגיאה בשמירה' });
    }
  }

  return (
    <div className="page container">
      <h1 className="section-title">שלום, {user?.name}</h1>

      <div className="profile-grid">
        <section className="card profile-card">
          <h3>ההזמנות שלי</h3>
          {orders.length === 0 ? (
            <p>עדיין אין הזמנות. <Link to="/catalog">לקטלוג &larr;</Link></p>
          ) : (
            orders.map((o) => (
              <Link key={o._id} to={`/order/${o.orderNumber}`} className="order-row">
                <span>{o.orderNumber}</span>
                <span>{new Date(o.createdAt).toLocaleDateString('he-IL')}</span>
                <span className="badge">{ORDER_STATUS_LABELS[o.status]}</span>
                <strong>{formatPrice(o.total)}</strong>
              </Link>
            ))
          )}

          {wishlist.length > 0 && (
            <>
              <h3 style={{ marginTop: 24 }}>מוצרים שאהבתי</h3>
              {wishlist.map((p) => (
                <Link key={p._id} to={`/product/${p.slug}`} className="order-row">
                  <span>{p.name}</span>
                  <strong>{formatPrice(p.basePrice)}</strong>
                </Link>
              ))}
            </>
          )}
        </section>

        <section className="card profile-card">
          <h3>עדכון פרטים</h3>
          {status && <div className={status.ok ? 'success-msg' : 'error-msg'}>{status.msg}</div>}
          <form onSubmit={saveProfile}>
            <div className="form-row">
              <label>שם מלא</label>
              <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
            </div>
            <div className="form-row">
              <label>טלפון</label>
              <input value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
            </div>
            <div className="form-row">
              <label>עיר</label>
              <input value={form.city} onChange={(e) => setForm({ ...form, city: e.target.value })} />
            </div>
            <div className="form-row">
              <label>כתובת</label>
              <input value={form.address} onChange={(e) => setForm({ ...form, address: e.target.value })} />
            </div>
            <div className="form-row">
              <label>סיסמה חדשה (אופציונלי)</label>
              <input type="password" dir="ltr" value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })} />
            </div>
            <button className="btn btn-primary">שמירה</button>
          </form>
        </section>
      </div>
    </div>
  );
}
