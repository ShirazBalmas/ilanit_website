import { useEffect, useState } from 'react';
import './AccessibilityWidget.css';

const DEFAULTS = {
  fontStep: 0, // 0..4
  grayscale: false,
  contrast: false,
  invert: false,
  lightBg: false,
  highlightLinks: false,
  readableFont: false,
};

function load() {
  try {
    return { ...DEFAULTS, ...JSON.parse(localStorage.getItem('a11y') || '{}') };
  } catch {
    return { ...DEFAULTS };
  }
}

export default function AccessibilityWidget() {
  const [open, setOpen] = useState(false);
  const [s, setS] = useState(load);

  // apply settings to the document whenever they change
  useEffect(() => {
    const el = document.documentElement;
    const filters = [];
    if (s.grayscale) filters.push('grayscale(1)');
    if (s.contrast) filters.push('contrast(1.4)');
    if (s.invert) filters.push('invert(1) hue-rotate(180deg)');
    el.style.filter = filters.join(' ');

    el.style.zoom = s.fontStep ? String(1 + s.fontStep * 0.1) : '';

    el.classList.toggle('a11y-light', s.lightBg);
    el.classList.toggle('a11y-links', s.highlightLinks);
    el.classList.toggle('a11y-readable', s.readableFont);

    localStorage.setItem('a11y', JSON.stringify(s));
  }, [s]);

  const toggle = (key) => setS((p) => ({ ...p, [key]: !p[key] }));
  const setFont = (dir) =>
    setS((p) => ({ ...p, fontStep: Math.min(4, Math.max(0, p.fontStep + dir)) }));
  const reset = () => setS({ ...DEFAULTS });

  return (
    <div className="a11y">
      <button
        className="a11y-toggle"
        onClick={() => setOpen((o) => !o)}
        aria-label="כלי נגישות"
        title="כלי נגישות"
      >
        &#9855;
      </button>

      {open && (
        <div className="a11y-panel" role="dialog" aria-label="כלי נגישות">
          <h4>כלי נגישות</h4>
          <button onClick={() => setFont(1)}>&#128269; הגדל טקסט</button>
          <button onClick={() => setFont(-1)}>&#128270; הקטן טקסט</button>
          <button className={s.grayscale ? 'active' : ''} onClick={() => toggle('grayscale')}>
            &#9680; גווני אפור
          </button>
          <button className={s.contrast ? 'active' : ''} onClick={() => toggle('contrast')}>
            &#9681; ניגודיות גבוהה
          </button>
          <button className={s.invert ? 'active' : ''} onClick={() => toggle('invert')}>
            &#128065; ניגודיות הפוכה
          </button>
          <button className={s.lightBg ? 'active' : ''} onClick={() => toggle('lightBg')}>
            &#128161; רקע בהיר
          </button>
          <button className={s.highlightLinks ? 'active' : ''} onClick={() => toggle('highlightLinks')}>
            &#128279; הדגשת קישורים
          </button>
          <button className={s.readableFont ? 'active' : ''} onClick={() => toggle('readableFont')}>
            A פונט קריא
          </button>
          <button className="a11y-reset" onClick={reset}>
            &#8635; איפוס
          </button>
        </div>
      )}
    </div>
  );
}
