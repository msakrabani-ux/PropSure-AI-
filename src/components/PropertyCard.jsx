import { Link, useNavigate } from 'react-router-dom';
import { formatPrice, TYPE_LABELS } from '../utils/format.js';
import { useAuth } from '../context/AuthContext.jsx';

const looks = {
  apartment: ['from-sky-200 to-sky-400', '\u{1F3E2}'],
  house: ['from-emerald-200 to-teal-400', '\u{1F3E0}'],
  villa: ['from-amber-200 to-orange-300', '\u{1F3E1}'],
  plot: ['from-lime-200 to-green-400', '\u{1F5FA}\uFE0F']
};

export default function PropertyCard({ p }) {
  const [grad, icon] = looks[p.type] || looks.apartment;
  const { user, saved, toggleSave } = useAuth();
  const nav = useNavigate();
  const isSaved = saved.has(p._id);
  const perSqft = p.listing === 'sale' && p.area ? Math.round(p.price / p.area) : null;

  async function onSave() {
    if (!user) return nav('/login', { state: { from: '/search' } });
    try { await toggleSave(p._id); } catch (e) { alert(e.message); }
  }

  return (
    <article className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm transition hover:shadow-md">
      <div className={`relative grid h-40 place-items-center bg-gradient-to-br ${grad} text-5xl`}>
        {p.images?.[0] ? <img src={p.images[0]} alt={p.title} className="h-full w-full object-cover" /> : <span aria-hidden="true">{icon}</span>}
        {p.isSample && <span className="absolute left-2 top-2 rounded bg-navy-800 px-2 py-0.5 text-xs font-semibold text-white">SAMPLE DATA</span>}
        <span className="absolute right-2 top-2 rounded bg-white/90 px-2 py-0.5 text-xs font-medium text-slate-600">
          {p.verificationStatus === 'verified' ? 'Verified' : 'Unverified'}
        </span>
        <button type="button" onClick={onSave} aria-pressed={isSaved}
          className="absolute bottom-2 right-2 rounded bg-white/95 px-3 py-1 text-xs font-semibold text-navy-800 shadow">
          {isSaved ? 'Saved' : 'Save'}
        </button>
      </div>
      <div className="p-4">
        <p className="text-xs font-medium uppercase tracking-wide text-teal-700">
          {TYPE_LABELS[p.type]} | For {p.listing === 'sale' ? 'Sale' : 'Rent'}
        </p>
        <h3 className="mt-1 font-semibold text-navy-800">{p.title}</h3>
        <p className="text-sm text-slate-500">{[p.address?.locality, p.address?.city].filter(Boolean).join(', ')}</p>
        <p className="mt-2 text-xl font-bold text-navy-800">{formatPrice(p.price, p.listing)}</p>
        {perSqft && <p className="text-xs text-slate-500">about {'\u20B9'}{perSqft.toLocaleString('en-IN')} / sq ft (calculated)</p>}
        <p className="mt-2 text-sm text-slate-600">
          {p.bedrooms > 0 ? `${p.bedrooms} BHK | ${p.bathrooms} bath | ` : ''}{p.area} sq ft{p.parking ? ' | Parking' : ''}
        </p>
        <Link to={`/properties/${p._id}`} className="btn-outline mt-3 w-full !py-2 text-sm">View details</Link>
      </div>
    </article>
  );
}