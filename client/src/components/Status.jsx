export const Loading = ({ text = 'Loading...' }) => (
  <p role="status" className="col-span-full py-10 text-center text-slate-500">{text}</p>
);

export const ErrorBox = ({ message }) => (
  <div role="alert" className="col-span-full rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700">{message}</div>
);