import { useEffect, useState } from 'react';
import api from '../../api/client.js';
import { formatPrice } from '../../utils/price.js';
import {
  ORDER_STATUS_LABELS,
  PAYMENT_STATUS_LABELS,
  PAYMENT_METHOD_LABELS,
  SHIPPING_LABELS,
} from '../../utils/labels.js';
import CustomizationSummary from '../../components/CustomizationSummary.jsx';

export default function AdminOrders() {
  const [orders, setOrders] = useState([]);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [expanded, setExpanded] = useState(null);

  function load() {
    const params = {};
    if (search) params.search = search;
    if (statusFilter) params.status = statusFilter;
    api.get('/orders', { params }).then((r) => setOrders(r.data.orders));
  }

  useEffect(() => {
    const t = setTimeout(load, 250);
    return () => clearTimeout(t);
  }, [search, statusFilter]);

  async function updateStatus(id, status) {
    const res = await api.patch(`/orders/${id}/status`, { status });
    setOrders((prev) => prev.map((o) => (o._id === id ? res.data.order : o)));
  }

  async function updatePayment(id, paymentStatus) {
    const res = await api.patch(`/orders/${id}/status`, { paymentStatus });
    setOrders((prev) => prev.map((o) => (o._id === id ? res.data.order : o)));
  }

  return (
    <div>
      <div className="admin-toolbar">
        <input
          type="search"
          placeholder="חיפוש לפי שם, טלפון או מספר הזמנה..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
          <option value="">כל הסטטוסים</option>
          {Object.entries(ORDER_STATUS_LABELS).map(([k, v]) => (
            <option key={k} value={k}>{v}</option>
          ))}
        </select>
        <span className="badge">{orders.length} הזמנות</span>
      </div>

      {orders.map((o) => (
        <div key={o._id} className="admin-panel">
          <div className="admin-toolbar" style={{ marginBottom: 8 }}>
            <strong>{o.orderNumber}</strong>
            <span>{o.customer.fullName} • {o.customer.phone}</span>
            <span>{new Date(o.createdAt).toLocaleDateString('he-IL')}</span>
            <strong style={{ color: 'var(--gold-dark)' }}>{formatPrice(o.total)}</strong>
            <select
              className="status-select"
              value={o.status}
              onChange={(e) => updateStatus(o._id, e.target.value)}
            >
              {Object.entries(ORDER_STATUS_LABELS).map(([k, v]) => (
                <option key={k} value={k}>{v}</option>
              ))}
            </select>
            <select
              className="status-select"
              value={o.paymentStatus}
              onChange={(e) => updatePayment(o._id, e.target.value)}
            >
              {Object.entries(PAYMENT_STATUS_LABELS).map(([k, v]) => (
                <option key={k} value={k}>{v}</option>
              ))}
            </select>
            <button
              className="btn btn-outline btn-sm"
              onClick={() => setExpanded(expanded === o._id ? null : o._id)}
            >
              {expanded === o._id ? 'סגירה' : 'פרטים'}
            </button>
          </div>

          {expanded === o._id && (
            <div className="order-detail">
              <p>
                <strong>לקוח:</strong> {o.customer.fullName} | {o.customer.phone} | {o.customer.email} |{' '}
                {o.customer.city} {o.customer.address}
              </p>
              {o.customer.notes && <p><strong>הערות לקוח:</strong> {o.customer.notes}</p>}
              <p>
                <strong>משלוח:</strong> {SHIPPING_LABELS[o.shippingMethod]} ({formatPrice(o.shippingCost)}) |{' '}
                <strong>תשלום:</strong> {PAYMENT_METHOD_LABELS[o.paymentMethod]}
              </p>
              <h4 style={{ margin: '12px 0 8px' }}>פריטים:</h4>
              {o.items.map((item, i) => (
                <div key={i} style={{ marginBottom: 10 }}>
                  <strong>{item.name} × {item.quantity}</strong> - {formatPrice(item.unitPrice)} ליחידה
                  <CustomizationSummary customization={item.customization} />
                  {item.customization?.logoUrl && (
                    <a href={item.customization.logoUrl} target="_blank" rel="noreferrer">
                      צפייה בלוגו שהועלה
                    </a>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      ))}
      {orders.length === 0 && <p style={{ textAlign: 'center' }}>לא נמצאו הזמנות</p>}
    </div>
  );
}
