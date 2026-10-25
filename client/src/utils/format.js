export const TYPE_LABELS = {
  apartment: 'Apartment',
  house: 'Independent House',
  villa: 'Villa',
  plot: 'Plot'
};

export function formatPrice(value, listing = 'sale') {
  if (listing === 'rent') return `₹${value.toLocaleString('en-IN')}/month`;
  if (value >= 10000000) return `₹${(value / 10000000).toFixed(2).replace(/\.?0+$/, '')} Cr`;
  if (value >= 100000) return `₹${(value / 100000).toFixed(2).replace(/\.?0+$/, '')} Lakh`;
  return `₹${value.toLocaleString('en-IN')}`;
}
