import { Link } from 'react-router-dom';
import SearchBar from '../components/SearchBar.jsx';
import PropertyCard from '../components/PropertyCard.jsx';
import { useEffect, useState } from 'react';
import { api } from '../services/api.js';
import { Loading, ErrorBox } from '../components/Status.jsx';

const types = [['apartment', 'Apartments', '🏢'], ['house', 'Independent Houses', '🏠'], ['villa', 'Villas', '🏡'], ['plot', 'Plots', '🗺️']];
const facilities = [['🏫', 'Schools & Colleges'], ['🏥', 'Hospitals & Clinics'], ['💊', 'Pharmacies'], ['⛽', 'Petrol Stations'], ['🔌', 'EV Charging'], ['🚌', 'Bus & Rail'], ['🛒', 'Supermarkets'], ['🌳', 'Parks']];
const steps = [
  ['1', 'Tell us your needs', 'Budget, family size, workplace and must-have features.'],
  ['2', 'Search & filter', 'Browse properties that match your requirements.'],
  ['3', 'Check the surroundings', 'See nearby facilities and commute for each property.'],
  ['4', 'Compare & decide', 'Compare costs, commute and suitability side by side.']
];
const benefits = [
  ['Transparent scoring', 'Every suitability score shows how each factor contributes.'],
  ['Total cost view', 'Upfront cost, EMI, maintenance and commute in one place.'],
  ['Commute aware', 'Compare houses by distance and time to your workplace.'],
  ['Honest data', 'Sample data is always labelled. Nothing is marked verified without a real process.']
];

export default function Home() {
  const [feat, setFeat] = useState({ loading: true, error: '', data: [] });
  useEffect(() => {
    const ctrl = new AbortController();
    api.properties({ listing: 'sale', limit: 3 }, ctrl.signal)
      .then((r) => setFeat({ loading: false, error: '', data: r.data }))
      .catch((e) => { if (e.name !== 'AbortError') setFeat({ loading: false, error: e.message, data: [] }); });
    return () => ctrl.abort();
  }, []);

  return (
    <>
      <section className="bg-gradient-to-br from-navy-900 via-navy-800 to-navy-700 px-4 pb-16 pt-14 text-white">
        <div className="mx-auto max-w-6xl">
          <p className="text-sm font-semibold uppercase tracking-widest text-teal-300">AI-powered home discovery</p>
          <h1 className="mt-3 max-w-2xl text-4xl font-bold leading-tight md:text-5xl">Find a Home That Fits Your Life</h1>
          <p className="mt-4 max-w-xl text-slate-200">
            Search by budget, then check schools, hospitals, transport, workplace distance and total cost before you decide.
          </p>
          <div className="mt-8"><SearchBar /></div>
        </div>
      </section>

      <section className="section">
        <div className="flex items-end justify-between">
          <h2 className="text-2xl font-bold text-navy-800">Featured properties</h2>
          <Link to="/search" className="text-sm font-semibold text-teal-700 hover:underline">View all →</Link>
        </div>
        <p className="mt-1 text-sm text-slate-500">Sample data for demonstration only.</p>
        <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {(feat.loading ? <Loading /> : feat.error ? <ErrorBox message={feat.error} /> : feat.data.map((p) => <PropertyCard key={p._id} p={p} />))}
        </div>
      </section>

      <section className="bg-white">
        <div className="section">
          <h2 className="text-2xl font-bold text-navy-800">Explore by property type</h2>
          <div className="mt-6 grid grid-cols-2 gap-4 md:grid-cols-4">
            {types.map(([value, label, icon]) => (
              <Link key={value} to={`/search?type=${value}`} className="rounded-xl border border-slate-200 p-6 text-center transition hover:border-teal-600 hover:shadow">
                <span className="text-4xl" aria-hidden="true">{icon}</span>
                <p className="mt-2 font-semibold text-navy-800">{label}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="section">
        <h2 className="text-2xl font-bold text-navy-800">Know what is nearby</h2>
        <p className="mt-1 max-w-2xl text-sm text-slate-600">
          Interactive map with facility filters arrives in Phase 3. Availability varies by area, and distances will be labelled as straight-line or road distance.
        </p>
        <div className="mt-6 grid grid-cols-2 gap-4 md:grid-cols-4">
          {facilities.map(([icon, label]) => (
            <div key={label} className="rounded-xl bg-white p-4 text-center shadow-sm">
              <span className="text-3xl" aria-hidden="true">{icon}</span>
              <p className="mt-1 text-sm font-medium text-slate-700">{label}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="bg-white">
        <div className="section">
          <h2 className="text-2xl font-bold text-navy-800">How it works</h2>
          <ol className="mt-6 grid gap-6 md:grid-cols-4">
            {steps.map(([n, title, text]) => (
              <li key={n}>
                <span className="grid h-10 w-10 place-items-center rounded-full bg-teal-600 font-bold text-white">{n}</span>
                <p className="mt-3 font-semibold text-navy-800">{title}</p>
                <p className="text-sm text-slate-600">{text}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className="section">
        <h2 className="text-2xl font-bold text-navy-800">Why PropSure AI</h2>
        <div className="mt-6 grid gap-4 md:grid-cols-2">
          {benefits.map(([title, text]) => (
            <div key={title} className="rounded-xl border-l-4 border-teal-600 bg-white p-5 shadow-sm">
              <p className="font-semibold text-navy-800">{title}</p>
              <p className="text-sm text-slate-600">{text}</p>
            </div>
          ))}
        </div>
      </section>
    </>
  );
}
