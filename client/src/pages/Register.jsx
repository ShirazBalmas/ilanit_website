import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import './Auth.css';

export default function Register() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: '', email: '', phone: '', password: '', confirm: '' });
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  function set(field, value) {
    setForm((f) => ({ ...f, [field]: value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    if (form.password !== form.confirm) {
      setError('הסיסמאות אינן תואמות');
      return;
    }
    setSubmitting(true);
    try {
      await register({ name: form.name, email: form.email, phone: form.phone, password: form.password });
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.message || 'שגיאה בהרשמה');
      setSubmitting(false);
    }
  }

  return (
    <div className="page container auth-page">
      <form className="card auth-card" onSubmit={handleSubmit}>
        <h1>הרשמה</h1>
        {error && <div className="error-msg">{error}</div>}
        <div className="form-row">
          <label htmlFor="name">שם מלא</label>
          <input id="name" required value={form.name} onChange={(e) => set('name', e.target.value)} />
        </div>
        <div className="form-row">
          <label htmlFor="email">אימייל</label>
          <input id="email" type="email" required dir="ltr" value={form.email}
            onChange={(e) => set('email', e.target.value)} />
        </div>
        <div className="form-row">
          <label htmlFor="phone">טלפון</label>
          <input id="phone" type="tel" dir="ltr" value={form.phone}
            onChange={(e) => set('phone', e.target.value)} />
        </div>
        <div className="form-row">
          <label htmlFor="password">סיסמה (לפחות 6 תווים)</label>
          <input id="password" type="password" required minLength={6} dir="ltr" value={form.password}
            onChange={(e) => set('password', e.target.value)} />
        </div>
        <div className="form-row">
          <label htmlFor="confirm">אימות סיסמה</label>
          <input id="confirm" type="password" required dir="ltr" value={form.confirm}
            onChange={(e) => set('confirm', e.target.value)} />
        </div>
        <button className="btn btn-primary" style={{ width: '100%' }} disabled={submitting}>
          {submitting ? 'נרשם...' : 'הרשמה'}
        </button>
        <p className="auth-switch">
          כבר יש לכם חשבון? <Link to="/login">התחברות</Link>
        </p>
      </form>
    </div>
  );
}
