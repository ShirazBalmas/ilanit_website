import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import api from '../api/client.js';
import ProductCard from '../components/ProductCard.jsx';
import './Catalog.css';

export default function Catalog() {
  const { categorySlug } = useParams();
  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [search, setSearch] = useState('');
  const [sort, setSort] = useState('newest');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/categories').then((r) => setCategories(r.data.categories));
  }, []);

  useEffect(() => {
    setLoading(true);
    const params = { sort };
    if (categorySlug) params.category = categorySlug;
    if (search) params.search = search;
    const t = setTimeout(() => {
      api
        .get('/products', { params })
        .then((r) => setProducts(r.data.products))
        .finally(() => setLoading(false));
    }, 250);
    return () => clearTimeout(t);
  }, [categorySlug, search, sort]);

  const activeCategory = categories.find((c) => c.slug === categorySlug);

  return (
    <div className="page container">
      <h1 className="section-title">{activeCategory ? activeCategory.name : 'קטלוג המוצרים'}</h1>
      <p className="section-subtitle">
        {activeCategory?.description || 'כל המוצרים ניתנים להתאמה אישית עם רקמה בעיצוב שלכם'}
      </p>

      <div className="catalog-filters">
        <div className="category-chips">
          <Link to="/catalog" className={`pill ${!categorySlug ? 'selected' : ''}`}>הכל</Link>
          {categories.map((c) => (
            <Link
              key={c._id}
              to={`/catalog/${c.slug}`}
              className={`pill ${categorySlug === c.slug ? 'selected' : ''}`}
            >
              {c.name}
            </Link>
          ))}
        </div>
        <div className="catalog-tools">
          <input
            type="search"
            placeholder="חיפוש מוצר..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            aria-label="חיפוש מוצר"
          />
          <select value={sort} onChange={(e) => setSort(e.target.value)} aria-label="מיון">
            <option value="newest">החדשים ביותר</option>
            <option value="popular">הנמכרים ביותר</option>
            <option value="price">מחיר: מהנמוך לגבוה</option>
            <option value="price_desc">מחיר: מהגבוה לנמוך</option>
          </select>
        </div>
      </div>

      {loading ? (
        <p style={{ textAlign: 'center', padding: 40 }}>טוען מוצרים...</p>
      ) : products.length === 0 ? (
        <p style={{ textAlign: 'center', padding: 40 }}>לא נמצאו מוצרים תואמים</p>
      ) : (
        <div className="grid grid-products">
          {products.map((p) => (
            <ProductCard key={p._id} product={p} />
          ))}
        </div>
      )}
    </div>
  );
}
