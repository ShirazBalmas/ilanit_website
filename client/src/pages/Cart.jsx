import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext.jsx';
import { calcUnitPrice, formatPrice, FREE_SHIPPING_ABOVE } from '../utils/price.js';
import CustomizationSummary from '../components/CustomizationSummary.jsx';
import './Cart.css';

export default function Cart() {
  const { items, updateQuantity, removeItem, subtotal } = useCart();
  const navigate = useNavigate();

  if (items.length === 0) {
    return (
      <div className="page container" style={{ textAlign: 'center' }}>
        <h1 className="section-title">עגלת הקניות</h1>
        <p style={{ margin: '24px 0' }}>העגלה שלכם ריקה</p>
        <Link to="/catalog" className="btn btn-primary">לצפייה בקטלוג</Link>
      </div>
    );
  }

  return (
    <div className="page container">
      <h1 className="section-title">עגלת הקניות</h1>
      <div className="cart-layout">
        <div className="cart-items">
          {items.map((item) => {
            const unit = calcUnitPrice(
              { basePrice: item.basePrice, customizationOptions: item.customizationOptions },
              item.customization
            );
            return (
              <div key={item.lineId} className="card cart-item">
                <Link to={`/product/${item.slug}`}>
                  <img src={item.image} alt={item.name} />
                </Link>
                <div className="cart-item-details">
                  <h3>
                    <Link to={`/product/${item.slug}`}>{item.name}</Link>
                  </h3>
                  <CustomizationSummary customization={item.customization} />
                  <div className="cart-item-bottom">
                    <div className="qty-control">
                      <button onClick={() => updateQuantity(item.lineId, item.quantity - 1)}>-</button>
                      <span>{item.quantity}</span>
                      <button onClick={() => updateQuantity(item.lineId, item.quantity + 1)}>+</button>
                    </div>
                    <strong>{formatPrice(unit * item.quantity)}</strong>
                    <button className="remove-btn" onClick={() => removeItem(item.lineId)}>
                      הסרה
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        <aside className="card cart-summary">
          <h3>סיכום הזמנה</h3>
          <div className="summary-line">
            <span>סכום ביניים</span>
            <span>{formatPrice(subtotal)}</span>
          </div>
          <div className="summary-line">
            <span>משלוח</span>
            <span>{subtotal >= FREE_SHIPPING_ABOVE ? 'חינם!' : 'יחושב בקופה'}</span>
          </div>
          {subtotal < FREE_SHIPPING_ABOVE && (
            <small className="hint">משלוח חינם בקנייה מעל {formatPrice(FREE_SHIPPING_ABOVE)}</small>
          )}
          <div className="summary-line total">
            <span>סה"כ</span>
            <span>{formatPrice(subtotal)}</span>
          </div>
          <button className="btn btn-primary" style={{ width: '100%' }} onClick={() => navigate('/checkout')}>
            למעבר לתשלום
          </button>
          <Link to="/catalog" className="continue-link">להמשך קניות</Link>
        </aside>
      </div>
    </div>
  );
}
