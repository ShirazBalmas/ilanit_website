import { useEffect, useState } from 'react';
import api from '../../api/client.js';

export default function AdminMessages() {
  const [messages, setMessages] = useState([]);

  function load() {
    api.get('/messages').then((r) => setMessages(r.data.messages));
  }

  useEffect(load, []);

  async function toggleHandled(m) {
    await api.patch(`/messages/${m._id}`, { handled: !m.handled });
    load();
  }

  return (
    <div>
      {messages.length === 0 && <p style={{ textAlign: 'center' }}>אין פניות חדשות</p>}
      {messages.map((m) => (
        <div key={m._id} className="admin-panel" style={{ opacity: m.handled ? 0.6 : 1 }}>
          <div className="admin-toolbar" style={{ marginBottom: 8 }}>
            <strong>{m.name}</strong>
            <a href={`tel:${m.phone}`}>{m.phone}</a>
            {m.email && <a href={`mailto:${m.email}`}>{m.email}</a>}
            <span>{new Date(m.createdAt).toLocaleString('he-IL')}</span>
            <button className="btn btn-outline btn-sm" onClick={() => toggleHandled(m)}>
              {m.handled ? 'סימון כלא טופל' : 'סימון כטופל'}
            </button>
          </div>
          <p>{m.content}</p>
        </div>
      ))}
    </div>
  );
}
