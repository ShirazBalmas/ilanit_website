import { useRef, useState } from 'react';
import './BrandsBar.css';

// single logo cell - falls back to the brand name if the logo image is
// missing or fails to load
function BrandLogo({ brand }) {
  const [failed, setFailed] = useState(false);
  const showImage = brand.logo && !failed;
  return (
    <div className="brand-item" title={brand.name}>
      {showImage ? (
        <img src={brand.logo} alt={brand.name} loading="lazy" onError={() => setFailed(true)} />
      ) : (
        <span>{brand.name}</span>
      )}
    </div>
  );
}

export default function BrandsBar({ brands }) {
  const trackRef = useRef(null);

  function scroll(direction) {
    const track = trackRef.current;
    if (!track) return;
    const amount = Math.max(240, track.clientWidth * 0.8);
    track.scrollBy({ left: direction * amount, behavior: 'smooth' });
  }

  return (
    <div className="brands-carousel">
      <button
        type="button"
        className="brands-arrow"
        onClick={() => scroll(-1)}
        aria-label="הקודם"
      >
        &#8249;
      </button>
      <div className="brands-track" ref={trackRef}>
        {brands.map((b) => (
          <BrandLogo key={b.name} brand={b} />
        ))}
      </div>
      <button
        type="button"
        className="brands-arrow"
        onClick={() => scroll(1)}
        aria-label="הבא"
      >
        &#8250;
      </button>
    </div>
  );
}
