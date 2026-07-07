import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext.jsx';
import { calcUnitPrice, formatPrice } from '../utils/price.js';
import CustomizationSummary from './CustomizationSummary.jsx';
import './CartDrawer.css';

export default function CartDrawer({ open, onClose }) {
  const { items, subtotal, removeItem, updateQuantity } = useCart();

  return (
    <>
      <div className={`drawer-overlay ${open ? 'show' : ''}`} onClick={onClose} />
      <aside className={`cart-drawer ${open ? 'open' : ''}`} aria-hidden={!open}>
        <div className="cart-drawer-head">
          <button className="drawer-close" onClick={onClose} aria-label="סגירה">
            &#10005;
          </button>
          <h3>עגלת הקניות</h3>
        </div>

        {items.length === 0 ? (
          <p className="cart-empty">לא נמצאו מוצרים בעגלת הקניות.</p>
        ) : (
          <>
            <div className="cart-drawer-items">
              {items.map((item) => {
                const unit = calcUnitPrice(
                  { basePrice: item.basePrice, customizationOptions: item.customizationOptions },
                  item.customization
                );
                return (
                  <div className="drawer-item" key={item.lineId}>
                    <img src={item.image} alt={item.name} />
                    <div className="drawer-item-info">
                      <strong>{item.name}</strong>
                      <CustomizationSummary customization={item.customization} />
                      <div className="drawer-item-row">
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

            <div className="cart-drawer-foot">
              <div className="drawer-total">
                <span>סה"כ ביניים</span>
                <strong>{formatPrice(subtotal)}</strong>
              </div>
              <Link to="/cart" className="btn btn-outline" onClick={onClose}>
                צפייה בעגלה
              </Link>
              <Link to="/checkout" className="btn btn-primary" onClick={onClose}>
                למעבר לתשלום
              </Link>
            </div>
          </>
        )}
      </aside>
    </>
  );
}
