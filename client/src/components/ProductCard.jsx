import { Link, useNavigate } from 'react-router-dom';
import { formatPrice } from '../utils/price.js';
import './ProductCard.css';

export default function ProductCard({ product }) {
  const navigate = useNavigate();

  return (
    <div className="card product-card">
      <Link to={`/product/${product.slug}`} className="product-card-img">
        <img src={product.images?.[0]} alt={product.name} loading="lazy" />
        {product.isFeatured && <span className="featured-tag">מומלץ</span>}
        {!product.inStock && <span className="oos-tag">אזל מהמלאי</span>}
      </Link>
      <div className="product-card-body">
        <h3>
          <Link to={`/product/${product.slug}`}>{product.name}</Link>
        </h3>
        <p className="product-card-desc">{product.shortDescription}</p>
        <div className="product-card-price">
          החל מ-<strong>{formatPrice(product.basePrice)}</strong>
        </div>
        <div className="product-card-actions">
          <button
            className="btn btn-primary btn-sm"
            onClick={() => navigate(`/product/${product.slug}`)}
            disabled={!product.inStock}
          >
            התאמה אישית
          </button>
          <button
            className="btn btn-outline btn-sm"
            onClick={() => navigate(`/product/${product.slug}`)}
            disabled={!product.inStock}
          >
            הוספה לסל
          </button>
        </div>
      </div>
    </div>
  );
}
