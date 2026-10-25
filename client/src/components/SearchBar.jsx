import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const BUDGETS = {
  sale: [[2500000, 'Up to ₹25 Lakh'], [5000000, 'Up to ₹50 Lakh'], [7500000, 'Up to ₹75 Lakh'], [10000000, 'Up to ₹1 Crore'], [20000000, 'Up to ₹2 Crore'], [50000000, 'Up to ₹5 Crore']],
  rent: [[10000, 'Up to ₹10,000/mo'], [20000, 'Up to ₹20,000/mo'], [30000, 'Up to ₹30,000/mo'], [50000, 'Up to ₹50,000/mo'], [100000, 'Up to ₹1,00,000/mo']]
};

export default function SearchBar({ initial = {} }) {
  const navigate = useNavigate();
  const [listing, setListing] = useState(initial.listing || 'sale');
  const [q, setQ] = useState(initial.q || '');
  const [type, setType] = useState(initial.type || '');
  const [max, setMax] = useState(initial.max || '');

  function switchListing(value) {
    setListing(value);
    setMax(''); // budget options differ for buy and rent
  }

  function submit(e) {
    e.preventDefault();
    const params = new URLSearchParams({ listing });
    if (q.trim()) params.set('q', q.trim());
    if (type) params.set('type', type);
    if (max) params.set('max', max);
    navigate(`/search?${params.toString()}`);
  }

  const tab = (v) =>
    `px-5 py-2 text-sm font-semibold rounded-t-lg ${listing === v ? 'bg-white text-navy-800' : 'bg-white/20 text-white hover:bg-white/30'}`;

  return (
    <div>
      <div className="flex gap-1" role="tablist" aria-label="Listing type">
        <button type="button" role="tab" aria-selected={listing === 'sale'} className={tab('sale')} onClick={() => switchListing('sale')}>Buy</button>
        <button type="button" role="tab" aria-selected={listing === 'rent'} className={tab('rent')} onClick={() => switchListing('rent')}>Rent</button>
      </div>
      <form onSubmit={submit} className="grid gap-3 rounded-b-xl rounded-tr-xl bg-white p-4 shadow-lg md:grid-cols-[2fr_1fr_1fr_auto]">
        <div>
          <label htmlFor="q" className="sr-only">City or locality</label>
          <input id="q" className="input" placeholder="City or locality (e.g. Salem, Velachery)" value={q} onChange={(e) => setQ(e.target.value)} />
        </div>
        <div>
          <label htmlFor="type" className="sr-only">Property type</label>
          <select id="type" className="input" value={type} onChange={(e) => setType(e.target.value)}>
            <option value="">Any type</option>
            <option value="apartment">Apartment</option>
            <option value="house">Independent House</option>
            <option value="villa">Villa</option>
            <option value="plot">Plot</option>
          </select>
        </div>
        <div>
          <label htmlFor="max" className="sr-only">Maximum budget</label>
          <select id="max" className="input" value={max} onChange={(e) => setMax(e.target.value)}>
            <option value="">Any budget</option>
            {BUDGETS[listing].map(([v, label]) => <option key={v} value={v}>{label}</option>)}
          </select>
        </div>
        <button type="submit" className="btn-primary">Search</button>
      </form>
    </div>
  );
}
