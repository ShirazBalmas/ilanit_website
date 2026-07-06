import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import './Auth.css';

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    setSubmitting(true);
    try {
      const user = await login(email, password);
      navigate(user.role === 'admin' ? '/admin' : '/');
    } catch (err) {
      setError(err.response?.data?.message || 'שגיאה בהתחברות');
      setSubmitting(false);
    }
  }

  return (
    <div className="page container auth-page">
      <form className="card auth-card" onSubmit={handleSubmit}>
        <h1>התחברות</h1>
        {error && <div className="error-msg">{error}</div>}
        <div className="form-row">
          <label htmlFor="email">אימייל</label>
          <input id="email" type="email" required dir="ltr" value={email}
            onChange={(e) => setEmail(e.target.value)} />
        </div>
        <div className="form-row">
          <label htmlFor="password">סיסמה</label>
          <input id="password" type="password" required dir="ltr" value={password}
            onChange={(e) => setPassword(e.target.value)} />
        </div>
        <button className="btn btn-primary" style={{ width: '100%' }} disabled={submitting}>
          {submitting ? 'מתחבר...' : 'התחברות'}
        </button>
        <p className="auth-switch">
          אין לכם חשבון? <Link to="/register">הרשמה</Link>
        </p>
      </form>
    </div>
  );
}
