import { useEffect, useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import api from '../api/client.js';
import { useCart } from '../context/CartContext.jsx';
import { calcUnitPrice, formatPrice, FONT_PREVIEWS } from '../utils/price.js';
import './ProductDetails.css';

const emptyCustomization = {
  size: '',
  color: '',
  embroidery: { enabled: false, text: '', threadColor: '', font: '', location: '' },
  logoUrl: '',
  giftPackaging: false,
  notes: '',
};

export default function ProductDetails() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const { addItem } = useCart();

  const [product, setProduct] = useState(null);
  const [notFound, setNotFound] = useState(false);
  const [activeImage, setActiveImage] = useState(0);
  const [customization, setCustomization] = useState(emptyCustomization);
  const [quantity, setQuantity] = useState(1);
  const [errors, setErrors] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [added, setAdded] = useState(false);

  useEffect(() => {
    setProduct(null);
    setNotFound(false);
    setCustomization(emptyCustomization);
    setQuantity(1);
    setErrors([]);
    setAdded(false);
    api
      .get(`/products/${slug}`)
      .then((r) => setProduct(r.data.product))
      .catch(() => setNotFound(true));
  }, [slug]);

  const opts = product?.customizationOptions || {};
  const emb = customization.embroidery;

  const unitPrice = useMemo(
    () => (product ? calcUnitPrice(product, customization) : 0),
    [product, customization]
  );

  function setEmb(patch) {
    setCustomization((c) => ({ ...c, embroidery: { ...c.embroidery, ...patch } }));
  }

  async function handleLogoUpload(e) {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      const form = new FormData();
      form.append('file', file);
      const res = await api.post('/upload/logo', form);
      setCustomization((c) => ({ ...c, logoUrl: res.data.url }));
    } catch {
      setErrors(['שגיאה בהעלאת הקובץ, נסו שוב']);
    } finally {
      setUploading(false);
    }
  }

  function validate() {
    const errs = [];
    if (product.availableSizes?.length && !customization.size) errs.push('יש לבחור מידה');
    if (product.availableColors?.length && !customization.color) errs.push('יש לבחור צבע מוצר');
    if (emb.enabled) {
      if (opts.allowText && !emb.text.trim()) errs.push('יש למלא את הטקסט לרקמה');
      if (!emb.threadColor) errs.push('יש לבחור צבע חוט');
      if (!emb.font) errs.push('יש לבחור סוג גופן');
      if (opts.embroideryLocations?.length && !emb.location) errs.push('יש לבחור מיקום רקמה');
    }
    return errs;
  }

  function handleAddToCart() {
    const errs = validate();
    setErrors(errs);
    if (errs.length) {
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }
    addItem(product, customization, quantity);
    setAdded(true);
    setTimeout(() => navigate('/cart'), 900);
  }

  if (notFound) return <div className="page container">המוצר לא נמצא</div>;
  if (!product) return <div className="page container">טוען...</div>;

  return (
    <div className="page container">
      <div className="product-layout">
        {/* images */}
        <div className="product-images">
          <div className="card main-image">
            <img src={product.images?.[activeImage]} alt={product.name} />
          </div>
          {product.images?.length > 1 && (
            <div className="thumbs">
              {product.images.map((img, i) => (
                <button key={i} className={i === activeImage ? 'selected' : ''} onClick={() => setActiveImage(i)}>
                  <img src={img} alt="" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* details + customization */}
        <div className="product-info">
          <span className="badge">{product.category?.name}</span>
          <h1>{product.name}</h1>
          <p className="product-desc">{product.description}</p>
          {product.material && <p className="product-material">חומר: {product.material}</p>}
          <div className="product-price">
            {formatPrice(unitPrice)}
            {unitPrice !== product.basePrice && (
              <small> (מחיר בסיס: {formatPrice(product.basePrice)})</small>
            )}
          </div>

          {errors.length > 0 && (
            <div className="error-msg">
              {errors.map((e, i) => (
                <div key={i}>• {e}</div>
              ))}
            </div>
          )}

          {/* size */}
          {product.availableSizes?.length > 0 && (
            <div className="option-block">
              <label>מידה *</label>
              <div className="pill-group">
                {product.availableSizes.map((s) => (
                  <button
                    key={s}
                    type="button"
                    className={`pill ${customization.size === s ? 'selected' : ''}`}
                    onClick={() => setCustomization({ ...customization, size: s })}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* color */}
          {product.availableColors?.length > 0 && (
            <div className="option-block">
              <label>צבע המוצר * {customization.color && <span className="chosen">({customization.color})</span>}</label>
              <div className="pill-group">
                {product.availableColors.map((c) => (
                  <button
                    key={c.name}
                    type="button"
                    title={c.name}
                    aria-label={c.name}
                    className={`color-swatch ${customization.color === c.name ? 'selected' : ''}`}
                    style={{ background: c.hex }}
                    onClick={() => setCustomization({ ...customization, color: c.name })}
                  />
                ))}
              </div>
            </div>
          )}

          {/* embroidery */}
          {opts.allowEmbroidery && (
            <div className="option-block embroidery-block card">
              <label className="toggle-label">
                <input
                  type="checkbox"
                  checked={emb.enabled}
                  onChange={(e) => setEmb({ enabled: e.target.checked })}
                />
                <span>
                  הוספת רקמה אישית
                  {opts.extraPriceForEmbroidery > 0 && ` (+${formatPrice(opts.extraPriceForEmbroidery)})`}
                </span>
              </label>

              {emb.enabled && (
                <div className="embroidery-fields">
                  {opts.allowText && (
                    <div className="form-row">
                      <label>טקסט לרקמה * <small>שם, ראשי תיבות, תאריך או ברכה</small></label>
                      <input
                        value={emb.text}
                        maxLength={60}
                        placeholder='לדוגמה: "אור" או "מזל טוב לזוג המאושר"'
                        onChange={(e) => setEmb({ text: e.target.value })}
                      />
                      {opts.extraPriceForLongText > 0 && (
                        <small className="hint">
                          מעל {opts.longTextThreshold} תווים: תוספת {formatPrice(opts.extraPriceForLongText)}
                          {' '}({emb.text.length}/{opts.longTextThreshold})
                        </small>
                      )}
                    </div>
                  )}

                  {opts.threadColors?.length > 0 && (
                    <div className="form-row">
                      <label>צבע החוט * {emb.threadColor && <span className="chosen">({emb.threadColor})</span>}</label>
                      <div className="pill-group">
                        {opts.threadColors.map((c) => (
                          <button
                            key={c.name}
                            type="button"
                            title={c.name}
                            aria-label={c.name}
                            className={`color-swatch ${emb.threadColor === c.name ? 'selected' : ''}`}
                            style={{ background: c.hex }}
                            onClick={() => setEmb({ threadColor: c.name })}
                          />
                        ))}
                      </div>
                    </div>
                  )}

                  {opts.fontOptions?.length > 0 && (
                    <div className="form-row">
                      <label>סוג הגופן *</label>
                      <div className="pill-group">
                        {opts.fontOptions.map((f) => (
                          <button
                            key={f}
                            type="button"
                            className={`pill ${emb.font === f ? 'selected' : ''}`}
                            style={{ fontFamily: FONT_PREVIEWS[f] }}
                            onClick={() => setEmb({ font: f })}
                          >
                            {f}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  {opts.embroideryLocations?.length > 0 && (
                    <div className="form-row">
                      <label>מיקום הרקמה *</label>
                      <div className="pill-group">
                        {opts.embroideryLocations.map((l) => (
                          <button
                            key={l}
                            type="button"
                            className={`pill ${emb.location === l ? 'selected' : ''}`}
                            onClick={() => setEmb({ location: l })}
                          >
                            {l}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* live embroidery preview */}
                  {emb.text && (
                    <div className="embroidery-preview">
                      <small>תצוגה מקדימה:</small>
                      <div
                        className="preview-text"
                        style={{
                          fontFamily: FONT_PREVIEWS[emb.font] || 'inherit',
                          color:
                            opts.threadColors?.find((c) => c.name === emb.threadColor)?.hex ||
                            'var(--gold-dark)',
                        }}
                      >
                        {emb.text}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          {/* logo upload */}
          {opts.allowLogoUpload && (
            <div className="option-block">
              <label>
                העלאת לוגו / תמונה
                {opts.extraPriceForLogo > 0 && ` (+${formatPrice(opts.extraPriceForLogo)})`}
              </label>
              <input type="file" accept="image/*" onChange={handleLogoUpload} disabled={uploading} />
              {uploading && <small className="hint">מעלה קובץ...</small>}
              {customization.logoUrl && (
                <div className="logo-preview">
                  <img src={customization.logoUrl} alt="הלוגו שהועלה" />
                  <button
                    type="button"
                    className="btn btn-outline btn-sm"
                    onClick={() => setCustomization({ ...customization, logoUrl: '' })}
                  >
                    הסרה
                  </button>
                </div>
              )}
            </div>
          )}

          {/* gift packaging */}
          {opts.extraPriceForGiftPackaging > 0 && (
            <div className="option-block">
              <label className="toggle-label">
                <input
                  type="checkbox"
                  checked={customization.giftPackaging}
                  onChange={(e) =>
                    setCustomization({ ...customization, giftPackaging: e.target.checked })
                  }
                />
                <span>אריזת מתנה מהודרת (+{formatPrice(opts.extraPriceForGiftPackaging)})</span>
              </label>
            </div>
          )}

          {/* notes */}
          <div className="option-block">
            <label>הערות למוכרת</label>
            <textarea
              rows="2"
              placeholder="בקשות מיוחדות, דגשים לעיצוב..."
              value={customization.notes}
              onChange={(e) => setCustomization({ ...customization, notes: e.target.value })}
            />
          </div>

          {/* quantity + add */}
          <div className="buy-row">
            <div className="qty-control">
              <button type="button" onClick={() => setQuantity(Math.max(1, quantity - 1))}>-</button>
              <span>{quantity}</span>
              <button type="button" onClick={() => setQuantity(quantity + 1)}>+</button>
            </div>
            <button
              className="btn btn-primary"
              onClick={handleAddToCart}
              disabled={!product.inStock || added}
            >
              {added ? 'נוסף לסל ✓' : `הוספה לסל - ${formatPrice(unitPrice * quantity)}`}
            </button>
          </div>

          {/* order summary */}
          <div className="card order-summary">
            <h3>סיכום ההזמנה שלך</h3>
            <ul>
              <li><span>מוצר:</span> {product.name}</li>
              {customization.size && <li><span>מידה:</span> {customization.size}</li>}
              {customization.color && <li><span>צבע:</span> {customization.color}</li>}
              {emb.enabled && (
                <>
                  <li><span>טקסט רקמה:</span> {emb.text || '-'}</li>
                  {emb.threadColor && <li><span>צבע חוט:</span> {emb.threadColor}</li>}
                  {emb.font && <li><span>גופן:</span> {emb.font}</li>}
                  {emb.location && <li><span>מיקום:</span> {emb.location}</li>}
                </>
              )}
              {customization.logoUrl && <li><span>לוגו:</span> הועלה ✓</li>}
              {customization.giftPackaging && <li><span>אריזת מתנה:</span> כן</li>}
              <li><span>כמות:</span> {quantity}</li>
              <li className="summary-total"><span>סה"כ:</span> {formatPrice(unitPrice * quantity)}</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
