import { useState } from 'react';
import { Link, Navigate, useLocation, useNavigate } from 'react-router-dom';
import { useMovieLibrary } from '../state/MovieLibraryContext';

export default function Login({ mode = 'login' }) {
  const isRegister = mode === 'register';
  const { profile, signIn, signUp } = useMovieLibrary();
  const navigate = useNavigate();
  const location = useLocation();
  const redirectTo = location.state?.from?.pathname || '/';

  const [form, setForm] = useState({ displayName: '', email: '', password: '' });
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  if (profile && !busy) return <Navigate to={redirectTo} replace />;

  const set = (name) => (e) => {
    setForm((f) => ({ ...f, [name]: e.target.value }));
    setError('');
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    setBusy(true);
    const res = isRegister ? await signUp(form) : await signIn(form.email, form.password);
    setBusy(false);
    if (res.ok) navigate(redirectTo, { replace: true });
    else setError(res.error);
  };

  return (
    <section className="form-page">
      <h1 className="page-title">{isRegister ? 'Create your account' : 'Sign in'}</h1>
      <p className="muted">
        {isRegister
          ? 'Save your Favorites and Watch Later lists under your own account.'
          : 'Sign in to save movies and see your lists.'}
      </p>

      <form onSubmit={onSubmit} noValidate className="form">
        {isRegister && (
          <div className="field">
            <label htmlFor="displayName">Name <span className="req">(required)</span></label>
            <input id="displayName" type="text" maxLength={40} autoComplete="name" value={form.displayName} onChange={set('displayName')} />
          </div>
        )}

        <div className="field">
          <label htmlFor="email">Email <span className="req">(required)</span></label>
          <input id="email" type="email" autoComplete="email" value={form.email} onChange={set('email')} />
        </div>

        <div className="field">
          <label htmlFor="password">Password <span className="req">(required)</span></label>
          <input
            id="password"
            type={showPassword ? 'text' : 'password'}
            autoComplete={isRegister ? 'new-password' : 'current-password'}
            value={form.password}
            onChange={set('password')}
            aria-describedby={isRegister ? 'password-hint' : undefined}
          />
          {isRegister && <p className="hint" id="password-hint">At least 6 characters.</p>}
          <label className="check">
            <input type="checkbox" checked={showPassword} onChange={(e) => setShowPassword(e.target.checked)} />
            Show password
          </label>
        </div>

        {error && <p className="form-error" role="alert">{error}</p>}

        <div className="form-actions">
          <button type="submit" className="btn btn-primary" disabled={busy}>
            {busy ? 'Please wait…' : isRegister ? 'Create account' : 'Sign in'}
          </button>
        </div>

        <p className="muted">
          {isRegister ? (
            <>Already have an account? <Link className="text-link" to="/login" state={location.state}>Sign in</Link></>
          ) : (
            <>New here? <Link className="text-link" to="/register" state={location.state}>Create an account</Link></>
          )}
        </p>
      </form>

      <div className="notice" role="note">
        Accounts are stored in this browser only. Passwords are saved as salted hashes, never as plain text, but
        this is not server-grade security and your lists do not sync across devices.
      </div>
    </section>
  );
}
