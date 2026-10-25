import { Link } from 'react-router-dom';

export default function Placeholder({ title, phase, description }) {
  return (
    <div className="section text-center">
      <h1 className="text-3xl font-bold text-navy-800">{title}</h1>
      {description && <p className="mx-auto mt-2 max-w-xl text-slate-600">{description}</p>}
      {phase && (
        <p className="mx-auto mt-4 inline-block rounded-full bg-teal-50 px-4 py-1 text-sm font-medium text-teal-700">
          Planned for Phase {phase}
        </p>
      )}
      <div className="mt-8"><Link to="/" className="btn-primary">Back to home</Link></div>
    </div>
  );
}
