import { useEffect, useState } from 'react';
import api from '../../api/client.js';
import { formatPrice } from '../../utils/price.js';

const emptyProduct = {
  name: '',
  slug: '',
  shortDescription: '',
  description: '',
  category: '',
  basePrice: 0,
  images: [],
  availableSizes: '',
  availableColors: '',
  material: '',
  inStock: true,
  isFeatured: false,
  customizationOptions: {
    allowEmbroidery: true,
    allowText: true,
    allowLogoUpload: false,
    threadColors: 'זהב:#C9A24B, כסף:#B8BCC4, לבן:#FFFFFF, שחור:#2B2B2B, ורוד:#E8A0B4, תכלת:#9CC3E4',
    fontOptions: 'אלגנטי, קלאסי, כתב יד, מודגש, ילדותי, מודרני',
    embroideryLocations: 'חזית, גב',
    extraPriceForEmbroidery: 25,
    extraPriceForLongText: 15,
    longTextThreshold: 15,
    extraPriceForLogo: 40,
    extraPriceForGiftPackaging: 20,
  },
};

// admin edits colors as 'name:hex, name:hex' and lists as comma strings -
// these helpers convert between the form shape and the API shape
const listToStr = (arr) => (arr || []).join(', ');
const strToList = (s) => s.split(',').map((x) => x.trim()).filter(Boolean);
const colorsToStr = (arr) => (arr || []).map((c) => `${c.name}:${c.hex}`).join(', ');
const strToColors = (s) =>
  strToList(s).map((pair) => {
    const [name, hex] = pair.split(':').map((x) => x.trim());
    return { name, hex: hex || '#FFFFFF' };
  });

function toForm(p) {
  return {
    ...p,
    availableSizes: listToStr(p.availableSizes),
    availableColors: colorsToStr(p.availableColors),
    customizationOptions: {
      ...p.customizationOptions,
      threadColors: colorsToStr(p.customizationOptions?.threadColors),
      fontOptions: listToStr(p.customizationOptions?.fontOptions),
      embroideryLocations: listToStr(p.customizationOptions?.embroideryLocations),
    },
  };
}

function toApi(form) {
  return {
    ...form,
    category: typeof form.category === 'object' ? form.category._id : form.category,
    basePrice: Number(form.basePrice),
    availableSizes: strToList(form.availableSizes),
    availableColors: strToColors(form.availableColors),
    customizationOptions: {
      ...form.customizationOptions,
      threadColors: strToColors(form.customizationOptions.threadColors),
      fontOptions: strToList(form.customizationOptions.fontOptions),
      embroideryLocations: strToList(form.customizationOptions.embroideryLocations),
      extraPriceForEmbroidery: Number(form.customizationOptions.extraPriceForEmbroidery),
      extraPriceForLongText: Number(form.customizationOptions.extraPriceForLongText),
      longTextThreshold: Number(form.customizationOptions.longTextThreshold),
      extraPriceForLogo: Number(form.customizationOptions.extraPriceForLogo),
      extraPriceForGiftPackaging: Number(form.customizationOptions.extraPriceForGiftPackaging),
    },
  };
}

export default function AdminProducts() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [editing, setEditing] = useState(null); // form state or null
  const [status, setStatus] = useState(null);
  const [uploading, setUploading] = useState(false);

  function load() {
    api.get('/products').then((r) => setProducts(r.data.products));
    api.get('/categories').then((r) => setCategories(r.data.categories));
  }

  useEffect(load, []);

  function setField(field, value) {
    setEditing((f) => ({ ...f, [field]: value }));
  }

  function setOpt(field, value) {
    setEditing((f) => ({
      ...f,
      customizationOptions: { ...f.customizationOptions, [field]: value },
    }));
  }

  async function uploadImage(e) {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      const form = new FormData();
      form.append('file', file);
      const res = await api.post('/upload/product', form);
      setEditing((f) => ({ ...f, images: [...(f.images || []), res.data.url] }));
    } finally {
      setUploading(false);
    }
  }

  async function save(e) {
    e.preventDefault();
    setStatus(null);
    try {
      const data = toApi(editing);
      if (editing._id) {
        await api.put(`/products/${editing._id}`, data);
      } else {
        await api.post('/products', data);
      }
      setEditing(null);
      setStatus({ ok: true, msg: 'המוצר נשמר בהצלחה' });
      load();
    } catch (err) {
      setStatus({ ok: false, msg: err.response?.data?.message || 'שגיאה בשמירה' });
    }
  }

  async function remove(id) {
    if (!window.confirm('למחוק את המוצר?')) return;
    await api.delete(`/products/${id}`);
    load();
  }

  if (editing) {
    const opts = editing.customizationOptions;
    return (
      <form className="admin-panel" onSubmit={save}>
        <h3>{editing._id ? 'עריכת מוצר' : 'מוצר חדש'}</h3>
        <div className="admin-form-grid">
          <div>
            <label>שם המוצר *</label>
            <input required value={editing.name} onChange={(e) => setField('name', e.target.value)} />
          </div>
          <div>
            <label>מזהה כתובת (slug)</label>
            <input dir="ltr" value={editing.slug} onChange={(e) => setField('slug', e.target.value)} />
          </div>
          <div>
            <label>קטגוריה *</label>
            <select
              required
              value={typeof editing.category === 'object' ? editing.category?._id : editing.category}
              onChange={(e) => setField('category', e.target.value)}
            >
              <option value="">בחרו קטגוריה</option>
              {categories.map((c) => (
                <option key={c._id} value={c._id}>{c.name}</option>
              ))}
            </select>
          </div>
          <div>
            <label>מחיר בסיס (₪) *</label>
            <input required type="number" min="0" value={editing.basePrice}
              onChange={(e) => setField('basePrice', e.target.value)} />
          </div>
          <div>
            <label>חומר</label>
            <input value={editing.material} onChange={(e) => setField('material', e.target.value)} />
          </div>
        </div>

        <div className="form-row">
          <label>תיאור קצר</label>
          <input value={editing.shortDescription} onChange={(e) => setField('shortDescription', e.target.value)} />
        </div>
        <div className="form-row">
          <label>תיאור מלא</label>
          <textarea rows="3" value={editing.description} onChange={(e) => setField('description', e.target.value)} />
        </div>

        <div className="admin-form-grid">
          <div>
            <label>מידות (מופרד בפסיקים)</label>
            <input value={editing.availableSizes} placeholder="S, M, L, XL"
              onChange={(e) => setField('availableSizes', e.target.value)} />
          </div>
          <div>
            <label>צבעי מוצר (שם:קוד, שם:קוד)</label>
            <input value={editing.availableColors} placeholder="לבן:#FFFFFF, שחור:#2B2B2B"
              onChange={(e) => setField('availableColors', e.target.value)} />
          </div>
        </div>

        <div className="form-row">
          <label>תמונות</label>
          <input type="file" accept="image/*" onChange={uploadImage} disabled={uploading} />
          <div style={{ display: 'flex', gap: 8, marginTop: 8, flexWrap: 'wrap' }}>
            {(editing.images || []).map((img, i) => (
              <div key={i} style={{ position: 'relative' }}>
                <img src={img} className="thumb-sm" alt="" />
                <button type="button" className="remove-btn"
                  onClick={() => setField('images', editing.images.filter((_, j) => j !== i))}>
                  ✕
                </button>
              </div>
            ))}
          </div>
        </div>

        <h3 style={{ margin: '18px 0 12px' }}>אפשרויות התאמה אישית</h3>
        <div className="admin-form-grid">
          <label className="checkbox-inline">
            <input type="checkbox" checked={opts.allowEmbroidery}
              onChange={(e) => setOpt('allowEmbroidery', e.target.checked)} />
            מאפשר רקמה
          </label>
          <label className="checkbox-inline">
            <input type="checkbox" checked={opts.allowText}
              onChange={(e) => setOpt('allowText', e.target.checked)} />
            מאפשר טקסט חופשי
          </label>
          <label className="checkbox-inline">
            <input type="checkbox" checked={opts.allowLogoUpload}
              onChange={(e) => setOpt('allowLogoUpload', e.target.checked)} />
            מאפשר העלאת לוגו
          </label>
          <label className="checkbox-inline">
            <input type="checkbox" checked={editing.inStock}
              onChange={(e) => setField('inStock', e.target.checked)} />
            במלאי
          </label>
          <label className="checkbox-inline">
            <input type="checkbox" checked={editing.isFeatured}
              onChange={(e) => setField('isFeatured', e.target.checked)} />
            מוצר מומלץ
          </label>
        </div>
        <div className="admin-form-grid">
          <div>
            <label>צבעי חוט (שם:קוד)</label>
            <input value={opts.threadColors} onChange={(e) => setOpt('threadColors', e.target.value)} />
          </div>
          <div>
            <label>גופנים (מופרד בפסיקים)</label>
            <input value={opts.fontOptions} onChange={(e) => setOpt('fontOptions', e.target.value)} />
          </div>
          <div>
            <label>מיקומי רקמה (מופרד בפסיקים)</label>
            <input value={opts.embroideryLocations} onChange={(e) => setOpt('embroideryLocations', e.target.value)} />
          </div>
          <div>
            <label>תוספת מחיר לרקמה (₪)</label>
            <input type="number" min="0" value={opts.extraPriceForEmbroidery}
              onChange={(e) => setOpt('extraPriceForEmbroidery', e.target.value)} />
          </div>
          <div>
            <label>תוספת לטקסט ארוך (₪)</label>
            <input type="number" min="0" value={opts.extraPriceForLongText}
              onChange={(e) => setOpt('extraPriceForLongText', e.target.value)} />
          </div>
          <div>
            <label>סף טקסט ארוך (תווים)</label>
            <input type="number" min="1" value={opts.longTextThreshold}
              onChange={(e) => setOpt('longTextThreshold', e.target.value)} />
          </div>
          <div>
            <label>תוספת ללוגו (₪)</label>
            <input type="number" min="0" value={opts.extraPriceForLogo}
              onChange={(e) => setOpt('extraPriceForLogo', e.target.value)} />
          </div>
          <div>
            <label>תוספת לאריזת מתנה (₪)</label>
            <input type="number" min="0" value={opts.extraPriceForGiftPackaging}
              onChange={(e) => setOpt('extraPriceForGiftPackaging', e.target.value)} />
          </div>
        </div>

        <div className="admin-row-actions" style={{ marginTop: 16 }}>
          <button className="btn btn-primary" type="submit">שמירה</button>
          <button className="btn btn-outline" type="button" onClick={() => setEditing(null)}>ביטול</button>
        </div>
      </form>
    );
  }

  return (
    <div>
      {status && <div className={status.ok ? 'success-msg' : 'error-msg'}>{status.msg}</div>}
      <div className="admin-toolbar">
        <button className="btn btn-primary" onClick={() => setEditing(emptyProduct)}>+ מוצר חדש</button>
        <span className="badge">{products.length} מוצרים</span>
      </div>
      <table className="admin-table">
        <thead>
          <tr>
            <th></th>
            <th>שם</th>
            <th>קטגוריה</th>
            <th>מחיר</th>
            <th>מלאי</th>
            <th>פעולות</th>
          </tr>
        </thead>
        <tbody>
          {products.map((p) => (
            <tr key={p._id}>
              <td><img src={p.images?.[0]} className="thumb-sm" alt="" /></td>
              <td>{p.name}{p.isFeatured && ' ⭐'}</td>
              <td>{p.category?.name}</td>
              <td>{formatPrice(p.basePrice)}</td>
              <td>{p.inStock ? 'במלאי' : 'אזל'}</td>
              <td>
                <div className="admin-row-actions">
                  <button className="btn btn-outline btn-sm" onClick={() => setEditing(toForm(p))}>עריכה</button>
                  <button className="btn btn-outline btn-sm" onClick={() => remove(p._id)}>מחיקה</button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
