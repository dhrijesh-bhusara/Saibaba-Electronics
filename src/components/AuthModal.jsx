import { useState } from 'react';
import { LoaderCircle, X } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import './AuthModal.css';

export default function AuthModal() {
  const { isAuthModalOpen, closeAuthModal, signIn, signUp } = useAuth();
  const [mode, setMode] = useState('signin');
  const [form, setForm] = useState({ fullName: '', email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  if (!isAuthModalOpen) return null;
  const update = (event) => setForm((current) => ({ ...current, [event.target.name]: event.target.value }));
  const submit = async (event) => {
    event.preventDefault();
    if (mode === 'signup' && form.fullName.trim().length < 2) return setError('Please enter your full name.');
    setError('');
    setLoading(true);
    const result = mode === 'signin' ? await signIn(form.email, form.password) : await signUp(form.email, form.password, form.fullName);
    if (result.error) setError(result.error.message);
    else closeAuthModal();
    setLoading(false);
  };

  return <div className="auth-overlay" onClick={closeAuthModal}><form className="auth-modal" onSubmit={submit} onClick={(event) => event.stopPropagation()}>
    <button type="button" className="auth-close" onClick={closeAuthModal} aria-label="Close authentication"><X size={20} /></button>
    <div className="auth-tabs"><button type="button" className={mode === 'signin' ? 'active' : ''} onClick={() => setMode('signin')}>Login</button><button type="button" className={mode === 'signup' ? 'active' : ''} onClick={() => setMode('signup')}>Create Account</button></div>
    <h2>{mode === 'signin' ? 'Welcome back' : 'Create your account'}</h2>
    {mode === 'signup' && <label>Full Name<input name="fullName" value={form.fullName} onChange={update} minLength="2" required /></label>}
    <label>Email<input name="email" type="email" value={form.email} onChange={update} required /></label>
    <label>Password<input name="password" type="password" value={form.password} onChange={update} minLength="6" required /></label>
    {error && <p className="auth-error" role="alert">{error}</p>}
    <button className="btn btn-primary auth-submit" disabled={loading}>{loading && <LoaderCircle className="spinner" size={17} />}{mode === 'signin' ? 'Sign In' : 'Create Account'}</button>
  </form></div>;
}
