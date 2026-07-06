import { useEffect, useState } from 'react';
import api from '../../api/client.js';

const empty = { name: '', slug: '', description: '', image: '' };

export default function AdminCategories() {
  const [categories, setCategories] = useState([]);
  const [editing, setEditing] = useState(null);
  const [status, setStatus] = useState(null);

  function load() {
    api.get('/categories').then((r) => setCategories(r.data.categories));
  }

  useEffect(load, []);

  async function save(e) {
    e.preventDefault();
    setStatus(null);
    try {
      if (editing._id) {
        await api.put(`/categories/${editing._id}`, editing);
      } else {
        await api.post('/categories', editing);
      }
      setEditing(null);
      load();
    } catch (err) {
      setStatus({ ok: false, msg: err.response?.data?.message || 'שגיאה בשמירה' });
    }
  }

  async function remove(id) {
    if (!window.confirm('למחוק את הקטגוריה?')) return;
    await api.delete(`/categories/${id}`);
    load();
  }

  return (
    <div>
      {status && <div className={status.ok ? 'success-msg' : 'error-msg'}>{status.msg}</div>}

      {editing ? (
        <form className="admin-panel" onSubmit={save}>
          <h3>{editing._id ? 'עריכת קטגוריה' : 'קטגוריה חדשה'}</h3>
          <div className="admin-form-grid">
            <div>
              <label>שם *</label>
              <input required value={editing.name} onChange={(e) => setEditing({ ...editing, name: e.target.value })} />
            </div>
            <div>
              <label>מזהה כתובת (slug) *</label>
              <input required dir="ltr" value={editing.slug}
                onChange={(e) => setEditing({ ...editing, slug: e.target.value })} />
            </div>
          </div>
          <div className="form-row">
            <label>תיאור</label>
            <input value={editing.description}
              onChange={(e) => setEditing({ ...editing, description: e.target.value })} />
          </div>
          <div className="admin-row-actions">
            <button className="btn btn-primary">שמירה</button>
            <button className="btn btn-outline" type="button" onClick={() => setEditing(null)}>ביטול</button>
          </div>
        </form>
      ) : (
        <div className="admin-toolbar">
          <button className="btn btn-primary" onClick={() => setEditing(empty)}>+ קטגוריה חדשה</button>
        </div>
      )}

      <table className="admin-table">
        <thead>
          <tr>
            <th>שם</th>
            <th>slug</th>
            <th>תיאור</th>
            <th>פעולות</th>
          </tr>
        </thead>
        <tbody>
          {categories.map((c) => (
            <tr key={c._id}>
              <td>{c.name}</td>
              <td dir="ltr">{c.slug}</td>
              <td>{c.description}</td>
              <td>
                <div className="admin-row-actions">
                  <button className="btn btn-outline btn-sm" onClick={() => setEditing(c)}>עריכה</button>
                  <button className="btn btn-outline btn-sm" onClick={() => remove(c._id)}>מחיקה</button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
