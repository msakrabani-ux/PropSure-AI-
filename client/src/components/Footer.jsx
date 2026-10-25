import { Link } from 'react-router-dom';

const cols = [
  ['Explore', [['/search', 'Search Properties'], ['/map', 'Map & Facilities'], ['/compare', 'Compare'], ['/calculator', 'Cost Calculator']]],
  ['Company', [['/about', 'About'], ['/contact', 'Contact'], ['/recommendations', 'AI Recommendations']]],
  ['Legal', [['/privacy', 'Privacy Policy'], ['/terms', 'Terms of Use']]]
];

export default function Footer() {
  return (
    <footer className="bg-navy-900 text-slate-300">
      <div className="mx-auto grid max-w-6xl gap-8 px-4 py-12 md:grid-cols-4">
        <div>
          <p className="text-lg font-bold text-white">PropSure <span className="text-teal-400">AI</span></p>
          <p className="mt-2 text-sm">Find a home that fits your budget, family and daily life.</p>
          <p className="mt-3 text-sm">Contact: <span className="text-white">hello@propsure.example</span></p>
        </div>
        {cols.map(([title, items]) => (
          <div key={title}>
            <p className="mb-2 font-semibold text-white">{title}</p>
            <ul className="space-y-1 text-sm">
              {items.map(([to, label]) => (
                <li key={to}><Link to={to} className="hover:text-teal-400">{label}</Link></li>
              ))}
            </ul>
          </div>
        ))}
      </div>
      <p className="border-t border-white/10 px-4 py-4 text-center text-xs text-slate-400">
        Property data shown is sample data for demonstration. Estimates are not official quotations or financial advice.
      </p>
    </footer>
  );
}
