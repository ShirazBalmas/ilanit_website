import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../api/client.js';
import { useAuth } from '../context/AuthContext.jsx';
import { useCart } from '../context/CartContext.jsx';
import { calcShipping, formatPrice } from '../utils/price.js';
import CustomizationSummary from '../components/CustomizationSummary.jsx';
import './Checkout.css';

export default function Checkout() {
  const { items, subtotal, clearCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    fullName: user?.name || '',
    phone: user?.phone || '',
    email: user?.email || '',
    city: user?.city || '',
    address: user?.address || '',
    notes: '',
  });
  const [shippingMethod, setShippingMethod] = useState('pickup');
  const [paymentMethod, setPaymentMethod] = useState('card');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  // demo card fields (used when the server has no Stripe key)
  const [card, setCard] = useState({ number: '', exp: '', cvc: '' });
  const [payStep, setPayStep] = useState(null); // null | {orderNumber, demo}

  const shippingCost = calcShipping(shippingMethod, subtotal);
  const total = subtotal + shippingCost;

  if (items.length === 0 && !payStep) {
    return (
      <div className="page container" style={{ textAlign: 'center' }}>
        <p>העגלה ריקה</p>
        <Link to="/catalog" className="btn btn-primary" style={{ marginTop: 16 }}>לקטלוג</Link>
      </div>
    );
  }

  function set(field, value) {
    setForm((f) => ({ ...f, [field]: value }));
  }

  async function placeOrder(e) {
    e.preventDefault();
    setError('');
    setSubmitting(true);
    try {
      const res = await api.post('/orders', {
        customer: form,
        items: items.map((i) => ({
          productId: i.productId,
          quantity: i.quantity,
          customization: i.customization,
        })),
        shippingMethod,
        paymentMethod,
      });
      const order = res.data.order;

      if (paymentMethod === 'card') {
        const intent = await api.post('/payment/create-intent', { orderNumber: order.orderNumber });
        if (intent.data.demo) {
          setPayStep({ orderNumber: order.orderNumber, demo: true });
          setSubmitting(false);
          return;
        }
        // with a real Stripe key, integrate Stripe Elements here; for now
        // confirm directly after the intent is created
        await api.post('/payment/confirm', { orderNumber: order.orderNumber });
      }

      clearCart();
      navigate(`/order/${order.orderNumber}`);
    } catch (err) {
      setError(err.response?.data?.message || 'שגיאה ביצירת ההזמנה');
      setSubmitting(false);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }

  async function payDemo(e) {
    e.preventDefault();
    setError('');
    if (card.number.replace(/\s/g, '').length < 12 || !card.exp || card.cvc.length < 3) {
      setError('נא למלא פרטי כרטיס תקינים');
      return;
    }
    setSubmitting(true);
    try {
      await api.post('/payment/confirm', { orderNumber: payStep.orderNumber });
      clearCart();
      navigate(`/order/${payStep.orderNumber}`);
    } catch (err) {
      setError(err.response?.data?.message || 'שגיאה בתשלום');
      setSubmitting(false);
    }
  }

  // demo payment screen
  if (payStep?.demo) {
    return (
      <div className="page container checkout-narrow">
        <h1 className="section-title">תשלום מאובטח</h1>
        <p className="section-subtitle">הזמנה {payStep.orderNumber} - סה"כ {formatPrice(total)}</p>
        <form className="card checkout-card" onSubmit={payDemo}>
          {error && <div className="error-msg">{error}</div>}
          <div className="demo-note">מצב הדגמה - לא מתבצע חיוב אמיתי. לחיבור סליקה אמיתית הוסיפו מפתח Stripe בקובץ .env</div>
          <div className="form-row">
            <label>מספר כרטיס</label>
            <input dir="ltr" placeholder="4580 0000 0000 0000" value={card.number}
              onChange={(e) => setCard({ ...card, number: e.target.value })} />
          </div>
          <div className="form-grid">
            <div className="form-row">
              <label>תוקף</label>
              <input dir="ltr" placeholder="12/28" value={card.exp}
                onChange={(e) => setCard({ ...card, exp: e.target.value })} />
            </div>
            <div className="form-row">
              <label>CVC</label>
              <input dir="ltr" placeholder="123" value={card.cvc}
                onChange={(e) => setCard({ ...card, cvc: e.target.value })} />
            </div>
          </div>
          <button className="btn btn-primary" style={{ width: '100%' }} disabled={submitting}>
            {submitting ? 'מעבד תשלום...' : `תשלום ${formatPrice(total)}`}
          </button>
        </form>
      </div>
    );
  }

  return (
    <div className="page container">
      <h1 className="section-title">קופה</h1>
      <form className="checkout-layout" onSubmit={placeOrder}>
        <div className="checkout-main">
          {error && <div className="error-msg">{error}</div>}

          <section className="card checkout-card">
            <h3>פרטי הלקוח</h3>
            <div className="form-grid">
              <div className="form-row">
                <label>שם מלא *</label>
                <input required value={form.fullName} onChange={(e) => set('fullName', e.target.value)} />
              </div>
              <div className="form-row">
                <label>טלפון *</label>
                <input required type="tel" value={form.phone} onChange={(e) => set('phone', e.target.value)} />
              </div>
              <div className="form-row">
                <label>אימייל *</label>
                <input required type="email" value={form.email} onChange={(e) => set('email', e.target.value)} />
              </div>
              <div className="form-row">
                <label>עיר *</label>
                <input required value={form.city} onChange={(e) => set('city', e.target.value)} />
              </div>
            </div>
            <div className="form-row">
              <label>כתובת {shippingMethod === 'delivery' && '*'}</label>
              <input
                required={shippingMethod === 'delivery'}
                value={form.address}
                onChange={(e) => set('address', e.target.value)}
              />
            </div>
            <div className="form-row">
              <label>הערות להזמנה</label>
              <textarea rows="2" value={form.notes} onChange={(e) => set('notes', e.target.value)} />
            </div>
          </section>

          <section className="card checkout-card">
            <h3>אפשרויות משלוח</h3>
            <label className="radio-option">
              <input type="radio" name="shipping" checked={shippingMethod === 'pickup'}
                onChange={() => setShippingMethod('pickup')} />
              <span>איסוף עצמי מכרמיאל - חינם</span>
            </label>
            <label className="radio-option">
              <input type="radio" name="shipping" checked={shippingMethod === 'delivery'}
                onChange={() => setShippingMethod('delivery')} />
              <span>
                משלוח עד הבית - {calcShipping('delivery', subtotal) === 0 ? 'חינם!' : formatPrice(calcShipping('delivery', subtotal))}
              </span>
            </label>
          </section>

          <section className="card checkout-card">
            <h3>אמצעי תשלום</h3>
            <label className="radio-option">
              <input type="radio" name="payment" checked={paymentMethod === 'card'}
                onChange={() => setPaymentMethod('card')} />
              <span>&#128179; כרטיס אשראי - תשלום מאובטח אונליין</span>
            </label>
            <label className="radio-option">
              <input type="radio" name="payment" checked={paymentMethod === 'bit'}
                onChange={() => setPaymentMethod('bit')} />
              <span>&#128241; ביט / פייבוקס - נשלח בקשת תשלום</span>
            </label>
            <label className="radio-option">
              <input type="radio" name="payment" checked={paymentMethod === 'pickup'}
                onChange={() => setPaymentMethod('pickup')} />
              <span>&#128181; תשלום באיסוף</span>
            </label>
          </section>
        </div>

        <aside className="card checkout-summary">
          <h3>ההזמנה שלך</h3>
          {items.map((item) => (
            <div key={item.lineId} className="checkout-item">
              <img src={item.image} alt="" />
              <div>
                <strong>{item.name} × {item.quantity}</strong>
                <CustomizationSummary customization={item.customization} />
              </div>
            </div>
          ))}
          <div className="summary-line">
            <span>סכום ביניים</span>
            <span>{formatPrice(subtotal)}</span>
          </div>
          <div className="summary-line">
            <span>משלוח</span>
            <span>{shippingCost === 0 ? 'חינם' : formatPrice(shippingCost)}</span>
          </div>
          <div className="summary-line total">
            <span>סה"כ לתשלום</span>
            <span>{formatPrice(total)}</span>
          </div>
          <button className="btn btn-primary" style={{ width: '100%' }} disabled={submitting}>
            {submitting ? 'שולח הזמנה...' : 'אישור והזמנה'}
          </button>
        </aside>
      </form>
    </div>
  );
}
