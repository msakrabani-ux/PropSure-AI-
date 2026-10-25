import { useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';

const links = [
  { to: '/search', label: 'Search' },
  { to: '/saved', label: 'Saved' },
  { to: '/compare', label: 'Compare' },
  { to: '/calculator', label: 'Cost Calculator' },
  { to: '/recommendations', label: 'AI Recommendations' }
];

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const cls = ({ isActive }) =>
    `text-sm font-medium px-2 py-1 rounded transition ${isActive ? 'text-teal-600' : 'text-slate-700 hover:text-teal-600'}`;

  function out() {
    logout();
    setOpen(false);
    navigate('/');
  }

  const authLinks = user ? (
    <>
      <span className="px-2 text-sm text-slate-600">Hi, {user.name.split(' ')[0]}</span>
      <button onClick={out} className="px-3 py-1.5 text-sm font-medium text-navy-800">Logout</button>
    </>
  ) : (
    <>
      <Link to="/login" className="px-3 py-1.5 text-sm font-medium text-navy-800" onClick={() => setOpen(false)}>Login</Link>
      <Link to="/register" className="btn-primary !py-1.5 text-sm" onClick={() => setOpen(false)}>Sign up</Link>
    </>
  );

  return (
    <header className="sticky top-0 z-40 border-b border-slate-200 bg-white/95 backdrop-blur">
      <nav className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4" aria-label="Main">
        <Link to="/" className="flex items-center gap-2 text-lg font-bold text-navy-800">
          <span className="grid h-8 w-8 place-items-center rounded-lg bg-navy-800 text-white">P</span>
          PropSure <span className="text-teal-600">AI</span>
        </Link>
        <div className="hidden items-center gap-3 md:flex">
          {links.map((l) => <NavLink key={l.to} to={l.to} className={cls}>{l.label}</NavLink>)}
          {authLinks}
        </div>
        <button className="rounded p-2 text-xl md:hidden" aria-expanded={open} aria-label="Toggle menu" onClick={() => setOpen(!open)}>
          {open ? 'X' : '='}
        </button>
      </nav>
      {open && (
        <div className="flex flex-col gap-1 border-t border-slate-200 bg-white px-4 py-3 md:hidden">
          {links.map((l) => (
            <NavLink key={l.to} to={l.to} className={cls} onClick={() => setOpen(false)}>{l.label}</NavLink>
          ))}
          <div className="mt-1 flex items-center gap-2">{authLinks}</div>
        </div>
      )}
    </header>
  );
}