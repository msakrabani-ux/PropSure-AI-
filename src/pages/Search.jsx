import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import SearchBar from '../components/SearchBar.jsx';
import PropertyCard from '../components/PropertyCard.jsx';
import { Loading, ErrorBox } from '../components/Status.jsx';
import { api } from '../services/api.js';

export default function Search() {
  const [params, setParams] = useSearchParams();
  const listing = params.get('listing') || 'sale';
  const q = params.get('q') || '';
  const type = params.get('type') || '';
  const max = params.get('max') || '';
  const sort = params.get('sort') || 'newest';
  const page = Number(params.get('page') || 1);
  const [s, setS] = useState({ loading: true, error: '', data: [], total: 0, pages: 1 });

  useEffect(() => {
    const ctrl = new AbortController();
    setS((x) => ({ ...x, loading: true, error: '' }));
    const query = { listing, sort, page, limit: 9 };
    if (q) query.q = q;
    if (type) query.type = type;
    if (max) query.maxPrice = max;
    api.properties(query, ctrl.signal)
      .then((r) => setS({ loading: false, error: '', data: r.data, total: r.total, pages: r.pages }))
      .catch((e) => { if (e.name !== 'AbortError') setS((x) => ({ ...x, loading: false, error: e.message })); });
    return () => ctrl.abort();
  }, [listing, q, type, max, sort, page]);

  function setParam(k, v) {
    const n = new URLSearchParams(params);
    n.set(k, v);
    if (k !== 'page') n.delete('page');
    setParams(n);
  }

  return (
    <div>
      <div className="bg-navy-800 px-4 py-8">
        <div className="mx-auto max-w-6xl">
          <SearchBar key={`${listing}|${q}|${type}|${max}`} initial={{ listing, q, type, max }} />
        </div>
      </div>
      <div className="section">
        <div className="flex flex-wrap items-end justify-between gap-3">
          <div>
            <h1 className="text-2xl font-bold text-navy-800">Search results</h1>
            <p className="mt-1 text-sm text-slate-500" aria-live="polite">{s.loading ? 'Searching...' : `${s.total} properties found`}</p>
          </div>
          <div>
            <label htmlFor="sort" className="mr-2 text-sm text-slate-600">Sort by</label>
            <select id="sort" className="input !w-auto" value={sort} onChange={(e) => setParam('sort', e.target.value)}>
              <option value="newest">Newest</option>
              <option value="price_asc">Price: low to high</option>
              <option value="price_desc">Price: high to low</option>
              <option value="area_desc">Largest area</option>
            </select>
          </div>
        </div>
        <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {s.loading && <Loading />}
          {s.error && <ErrorBox message={s.error} />}
          {!s.loading && !s.error && s.data.length === 0 && (
            <div className="col-span-full rounded-xl border border-dashed border-slate-300 bg-white p-10 text-center">
              <p className="font-semibold text-navy-800">No properties match your search</p>
              <p className="mt-1 text-sm text-slate-500">Try a different locality, a higher budget or "Any type".</p>
            </div>
          )}
          {!s.loading && s.data.map((p) => <PropertyCard key={p._id} p={p} />)}
        </div>
        {s.pages > 1 && (
          <div className="mt-8 flex items-center justify-center gap-4">
            <button className="btn-outline !py-1.5" disabled={page <= 1} onClick={() => setParam('page', page - 1)}>Previous</button>
            <span className="text-sm text-slate-600">Page {page} of {s.pages}</span>
            <button className="btn-outline !py-1.5" disabled={page >= s.pages} onClick={() => setParam('page', page + 1)}>Next</button>
          </div>
        )}
      </div>
    </div>
  );
}