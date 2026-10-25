import { useEffect, useState } from 'react';
import { Link, Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import { api } from '../services/api.js';
import PropertyCard from '../components/PropertyCard.jsx';
import { Loading, ErrorBox } from '../components/Status.jsx';

export default function Saved() {
  const { user, ready, saved } = useAuth();
  const [s, setS] = useState({ loading: true, error: '', data: [] });

  useEffect(() => {
    if (!user) return;
    api.favorites()
      .then((data) => setS({ loading: false, error: '', data }))
      .catch((e) => setS({ loading: false, error: e.message, data: [] }));
  }, [user, saved.size]);

  if (!ready) return <div className="section"><Loading /></div>;
  if (!user) return <Navigate to="/login" state={{ from: '/saved' }} replace />;

  return (
    <div className="section">
      <h1 className="text-2xl font-bold text-navy-800">Saved properties</h1>
      <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {s.loading && <Loading />}
        {s.error && <ErrorBox message={s.error} />}
        {!s.loading && !s.error && s.data.length === 0 && (
          <div className="col-span-full rounded-xl border border-dashed border-slate-300 bg-white p-10 text-center">
            <p className="font-semibold text-navy-800">Nothing saved yet</p>
            <Link to="/search" className="btn-primary mt-4">Browse properties</Link>
          </div>
        )}
        {s.data.map((p) => <PropertyCard key={p._id} p={p} />)}
      </div>
    </div>
  );
}