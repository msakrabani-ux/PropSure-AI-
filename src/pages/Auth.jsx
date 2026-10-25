import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';

function AuthForm({ mode }) {
  const isLogin = mode === 'login';
  const { login, register } = useAuth();
  const nav = useNavigate();
  const loc = useLocation();
  const [f, setF] = useState({ name: '', email: '', password: '' });
  const [err, setErr] = useState('');
  const [busy, setBusy] = useState(false);
  const set = (k) => (e) => setF({ ...f, [k]: e.target.value });

  async function submit(e) {
    e.preventDefault();
    setErr('');
    if (!isLogin && f.name.trim().length < 2) return setErr('Name must be at least 2 characters');
    if (!/^\S+@\S+\.\S+$/.test(f.email)) return setErr('Enter a valid email');
    if (isLogin ? !f.password : f.password.length < 8) return setErr(isLogin ? 'Enter your password' : 'Password must be at least 8 characters');
    setBusy(true);
    try {
      if (isLogin) await login({ email: f.email, password: f.password });
      else await register({ name: f.name.trim(), email: f.email, password: f.password });
      nav(loc.state?.from || '/', { replace: true });
    } catch (e2) {
      setErr(e2.message);
    } finally {
      setBusy(false);
    }
  }

  const field = (k, label, type) => (
    <div>
      <label htmlFor={k} className="mb-1 block text-sm font-medium text-slate-700">{label}</label>
      <input id={k} type={type} className="input" value={f[k]} onChange={set(k)} autoComplete={k === 'password' ? (isLogin ? 'current-password' : 'new-password') : k} />
    </div>
  );

  return (
    <div className="mx-auto max-w-md px-4 py-14">
      <form onSubmit={submit} noValidate className="space-y-4 rounded-xl bg-white p-6 shadow-sm">
        <h1 className="text-2xl font-bold text-navy-800">{isLogin ? 'Login' : 'Create account'}</h1>
        {!isLogin && field('name', 'Full name', 'text')}
        {field('email', 'Email', 'email')}
        {field('password', 'Password', 'password')}
        {err && <p role="alert" className="text-sm text-red-700">{err}</p>}
        <button className="btn-primary w-full" disabled={busy}>{busy ? 'Please wait...' : isLogin ? 'Login' : 'Sign up'}</button>
        <p className="text-center text-sm text-slate-600">
          {isLogin ? 'New here? ' : 'Already have an account? '}
          <Link to={isLogin ? '/register' : '/login'} state={loc.state} className="font-semibold text-teal-700">{isLogin ? 'Create account' : 'Login'}</Link>
        </p>
      </form>
    </div>
  );
}

export const Login = () => <AuthForm mode="login" />;
export const Register = () => <AuthForm mode="register" />;