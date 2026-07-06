import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import api from '../api/client.js';
import { formatPrice } from '../utils/price.js';
import CustomizationSummary from '../components/CustomizationSummary.jsx';
import './OrderConfirmation.css';

const paymentLabels = { pending: 'ממתין לתשלום', paid: 'שולם', failed: 'נכשל' };
const methodLabels = { card: 'כרטיס אשראי', bit: 'ביט / פייבוקס', pickup: 'תשלום באיסוף' };
const shippingLabels = { pickup: 'איסוף עצמי מכרמיאל', delivery: 'משלוח עד הבית' };

export default function OrderConfirmation() {
  const { orderNumber } = useParams();
  const [order, setOrder] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    api
      .get(`/orders/number/${orderNumber}`)
      .then((r) => setOrder(r.data.order))
      .catch(() => setError('הזמנה לא נמצאה'));
  }, [orderNumber]);

  if (error) return <div className="page container">{error}</div>;
  if (!order) return <div className="page container">טוען...</div>;

  return (
    <div className="page container confirmation-page">
      <div className="confirmation-hero">
        <div className="check-circle">&#10003;</div>
        <h1>תודה רבה! ההזמנה האישית שלכם התקבלה</h1>
        <p>
          מספר הזמנה: <strong>{order.orderNumber}</strong>
        </p>
        <p>אישור נוסף ישלח לכתובת {order.customer.email}</p>
      </div>

      <div className="confirmation-grid">
        <section className="card conf-card">
          <h3>פרטי ההזמנה</h3>
          {order.items.map((item, i) => (
            <div key={i} className="conf-item">
              <strong>{item.name} × {item.quantity}</strong>
              <CustomizationSummary customization={item.customization} />
              <span>{formatPrice(item.unitPrice * item.quantity)}</span>
            </div>
          ))}
          <div className="conf-totals">
            <div><span>סכום ביניים</span><span>{formatPrice(order.subtotal)}</span></div>
            <div><span>משלוח ({shippingLabels[order.shippingMethod]})</span><span>{order.shippingCost === 0 ? 'חינם' : formatPrice(order.shippingCost)}</span></div>
            <div className="conf-total"><span>סה"כ</span><span>{formatPrice(order.total)}</span></div>
          </div>
        </section>

        <section className="card conf-card">
          <h3>פרטי הלקוח</h3>
          <p>{order.customer.fullName}</p>
          <p>{order.customer.phone}</p>
          <p>{order.customer.email}</p>
          <p>{order.customer.city}{order.customer.address && `, ${order.customer.address}`}</p>
          <h3 style={{ marginTop: 20 }}>תשלום</h3>
          <p>{methodLabels[order.paymentMethod]}</p>
          <p>
            סטטוס: <span className={`badge ${order.paymentStatus === 'paid' ? 'badge-paid' : ''}`}>
              {paymentLabels[order.paymentStatus]}
            </span>
          </p>
        </section>
      </div>

      <div style={{ textAlign: 'center', marginTop: 32 }}>
        <Link to="/catalog" className="btn btn-primary">להמשך קניות</Link>
      </div>
    </div>
  );
}
