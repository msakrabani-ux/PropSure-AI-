import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { api } from '../services/api.js';
import { useAuth } from '../context/AuthContext.jsx';
import { formatPrice, TYPE_LABELS } from '../utils/format.js';
import { Loading, ErrorBox } from '../components/Status.jsx';

export default function PropertyDetails() {
  const { id } = useParams();
  const { user, saved, toggleSave } = useAuth();
  const nav = useNavigate();
  const [p, setP] = useState(null);
  const [error, setError] = useState('');
  const [form, setForm] = useState({ name: '', email: '', phone: '', message: '' });
  const [msg, setMsg] = useState({ type: '', text: '' });
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    setP(null); setError('');
    api.property(id).then(setP).catch((e) => setError(e.status === 404 ? 'Property not found' : e.message));
  }, [id]);

  useEffect(() => {
    if (user) setForm((f) => ({ ...f, name: f.name || user.name, email: f.email || user.email }));
  }, [user]);

  async function onSave() {
    if (!user) return nav('/login', { state: { from: `/properties/${id}` } });
    try { await toggleSave(id); } catch (e) { setMsg({ type: 'error', text: e.message }); }
  }

  async function sendInquiry(e) {
    e.preventDefault();
    setMsg({ type: '', text: '' });
    if (form.name.trim().length < 2) return setMsg({ type: 'error', text: 'Enter your name' });
    if (!/^\S+@\S+\.\S+$/.test(form.email)) return setMsg({ type: 'error', text: 'Enter a valid email' });
    if (form.message.trim().length < 5) return setMsg({ type: 'error', text: 'Message must be at least 5 characters' });
    setBusy(true);
    try {
      const body = { property: id, name: form.name.trim(), email: form.email, message: form.message.trim() };
      if (form.phone.trim()) body.phone = form.phone.trim();
      await api.inquiry(body);
      setMsg({ type: 'ok', text: 'Inquiry sent. The seller can now follow up with you.' });
      setForm((f) => ({ ...f, message: '' }));
    } catch (err) {
      setMsg({ type: 'error', text: err.message });
    } finally {
      setBusy(false);
    }
  }

  if (error) return <div className="section"><ErrorBox message={error} /><Link to="/search" className="btn-primary mt-4">Back to search</Link></div>;
  if (!p) return <div className="section"><Loading /></div>;

  const rows = [
    ['Type', TYPE_LABELS[p.type]], ['Listing', p.listing === 'sale' ? 'For sale' : 'For rent'],
    ['Built-up area', `${p.area} sq ft`], ['Bedrooms', p.bedrooms], ['Bathrooms', p.bathrooms],
    ['Floors', p.floors], ['Parking', p.parking ? 'Yes' : 'No'], ['Furnishing', p.furnished],
    ['Age', p.ageYears != null ? `${p.ageYears} years` : 'Not given'],
    ['Verification', p.verificationStatus === 'verified' ? 'Verified' : 'Unverified']
  ];
  const isSaved = saved.has(p._id);
  const input = (k, label, type = 'text') => (
    <div>
      <label htmlFor={k} className="mb-1 block text-sm font-medium text-slate-700">{label}</label>
      <input id={k} type={type} className="input" value={form[k]} onChange={(e) => setForm({ ...form, [k]: e.target.value })} />
    </div>
  );

  return (
    <div className="section">
      <Link to="/search" className="text-sm font-medium text-teal-700 hover:underline">Back to search</Link>
      <div className="mt-4 grid gap-8 lg:grid-cols-[2fr_1fr]">
        <div>
          {p.isSample && <span className="rounded bg-navy-800 px-2 py-0.5 text-xs font-semibold text-white">SAMPLE DATA</span>}
          <h1 className="mt-2 text-3xl font-bold text-navy-800">{p.title}</h1>
          <p className="text-slate-500">{[p.address?.locality, p.address?.city, p.address?.state].filter(Boolean).join(', ')}</p>
          <p className="mt-3 text-3xl font-bold text-navy-800">{formatPrice(p.price, p.listing)}</p>
          {p.listing === 'sale' && p.area > 0 && <p className="text-sm text-slate-500">about {'\u20B9'}{Math.round(p.price / p.area).toLocaleString('en-IN')} / sq ft (calculated)</p>}
          <button type="button" onClick={onSave} aria-pressed={isSaved} className="btn-outline mt-4">{isSaved ? 'Saved (click to remove)' : 'Save property'}</button>
          <dl className="mt-6 grid grid-cols-2 gap-3 rounded-xl bg-white p-5 shadow-sm md:grid-cols-3">
            {rows.map(([k, v]) => (
              <div key={k}><dt className="text-xs uppercase text-slate-500">{k}</dt><dd className="font-medium text-navy-800">{v}</dd></div>
            ))}
          </dl>
          {p.description && <p className="mt-6 text-slate-700">{p.description}</p>}
          <p className="mt-6 rounded-lg bg-teal-50 p-4 text-sm text-teal-800">
            Nearby facilities, commute and cost estimates for this property are coming in the next phases.
          </p>
        </div>
        <form onSubmit={sendInquiry} className="h-fit space-y-3 rounded-xl bg-white p-5 shadow-sm" noValidate>
          <h2 className="text-lg font-bold text-navy-800">Contact about this property</h2>
          {input('name', 'Your name')}
          {input('email', 'Email', 'email')}
          {input('phone', 'Phone (optional)', 'tel')}
          <div>
            <label htmlFor="message" className="mb-1 block text-sm font-medium text-slate-700">Message</label>
            <textarea id="message" rows="4" className="input" value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} />
          </div>
          {msg.text && <p role="alert" className={`text-sm ${msg.type === 'ok' ? 'text-green-700' : 'text-red-700'}`}>{msg.text}</p>}
          <button className="btn-primary w-full" disabled={busy}>{busy ? 'Sending...' : 'Send inquiry'}</button>
        </form>
      </div>
    </div>
  );
}