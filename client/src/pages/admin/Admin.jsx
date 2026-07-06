import { NavLink, Navigate, Route, Routes } from 'react-router-dom';
import AdminOrders from './AdminOrders.jsx';
import AdminProducts from './AdminProducts.jsx';
import AdminCategories from './AdminCategories.jsx';
import AdminMessages from './AdminMessages.jsx';
import AdminGallery from './AdminGallery.jsx';
import './Admin.css';

export default function Admin() {
  return (
    <div className="page container">
      <h1 className="section-title">ניהול החנות</h1>
      <nav className="admin-tabs">
        <NavLink to="/admin/orders">הזמנות</NavLink>
        <NavLink to="/admin/products">מוצרים</NavLink>
        <NavLink to="/admin/categories">קטגוריות</NavLink>
        <NavLink to="/admin/messages">פניות לקוחות</NavLink>
        <NavLink to="/admin/gallery">גלריה</NavLink>
      </nav>
      <Routes>
        <Route index element={<Navigate to="orders" replace />} />
        <Route path="orders" element={<AdminOrders />} />
        <Route path="products" element={<AdminProducts />} />
        <Route path="categories" element={<AdminCategories />} />
        <Route path="messages" element={<AdminMessages />} />
        <Route path="gallery" element={<AdminGallery />} />
      </Routes>
    </div>
  );
}
