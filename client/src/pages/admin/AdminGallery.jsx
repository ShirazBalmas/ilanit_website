import { useEffect, useState } from 'react';
import api from '../../api/client.js';

export default function AdminGallery() {
  const [images, setImages] = useState([]);
  const [caption, setCaption] = useState('');
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);

  function load() {
    api.get('/gallery').then((r) => setImages(r.data.images));
  }

  useEffect(load, []);

  async function add(e) {
    e.preventDefault();
    if (!file) return;
    setUploading(true);
    try {
      const form = new FormData();
      form.append('file', file);
      const res = await api.post('/upload/gallery', form);
      await api.post('/gallery', { image: res.data.url, caption });
      setCaption('');
      setFile(null);
      e.target.reset();
      load();
    } finally {
      setUploading(false);
    }
  }

  async function remove(id) {
    if (!window.confirm('למחוק את התמונה?')) return;
    await api.delete(`/gallery/${id}`);
    load();
  }

  return (
    <div>
      <form className="admin-panel" onSubmit={add}>
        <h3>הוספת תמונה לגלריה</h3>
        <div className="admin-form-grid">
          <div>
            <label>תמונה *</label>
            <input type="file" accept="image/*" required onChange={(e) => setFile(e.target.files?.[0])} />
          </div>
          <div>
            <label>כיתוב</label>
            <input value={caption} onChange={(e) => setCaption(e.target.value)} />
          </div>
        </div>
        <button className="btn btn-primary" disabled={uploading}>
          {uploading ? 'מעלה...' : 'הוספה'}
        </button>
      </form>

      <div className="grid grid-categories">
        {images.map((img) => (
          <div key={img._id} className="card" style={{ padding: 10, textAlign: 'center' }}>
            <img src={img.image} alt={img.caption} style={{ aspectRatio: 1, objectFit: 'cover', borderRadius: 8 }} />
            <p style={{ fontSize: '0.85rem', margin: '8px 0' }}>{img.caption}</p>
            <button className="btn btn-outline btn-sm" onClick={() => remove(img._id)}>מחיקה</button>
          </div>
        ))}
      </div>
    </div>
  );
}
