export const notFound = (req, res) => res.status(404).json({ message: `Route not found: ${req.method} ${req.originalUrl}` });

export function errorHandler(err, _req, res, _next) {
  if (err.name === 'CastError') return res.status(400).json({ message: 'Invalid ID or value' });
  if (err.name === 'ValidationError') return res.status(400).json({ message: err.message });
  if (err.code === 11000) return res.status(409).json({ message: 'Already exists' });
  console.error(err);
  res.status(500).json({ message: 'Something went wrong on the server' });
}