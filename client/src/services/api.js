const BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';
const KEY = 'propsure_token';

export const getToken = () => localStorage.getItem(KEY);
export const setToken = (t) => (t ? localStorage.setItem(KEY, t) : localStorage.removeItem(KEY));

async function request(path, { method = 'GET', body, signal } = {}) {
  const headers = {};
  if (body) headers['Content-Type'] = 'application/json';
  const token = getToken();
  if (token) headers.Authorization = `Bearer ${token}`;
  let res;
  try {
    res = await fetch(`${BASE}${path}`, { method, headers, body: body ? JSON.stringify(body) : undefined, signal });
  } catch (e) {
    if (e.name === 'AbortError') throw e;
    throw new Error('Cannot reach the server. Is the backend running?');
  }
  const data = await res.json().catch(() => null);
  if (!res.ok) {
    const err = new Error(data?.errors?.[0]?.message || data?.message || 'Request failed');
    err.status = res.status;
    throw err;
  }
  return data;
}

export const api = {
  register: (b) => request('/auth/register', { method: 'POST', body: b }),
  login: (b) => request('/auth/login', { method: 'POST', body: b }),
  me: () => request('/users/me'),
  properties: (params, signal) => request(`/properties?${new URLSearchParams(params)}`, { signal }),
  property: (id) => request(`/properties/${id}`),
  favorites: () => request('/favorites'),
  saveFavorite: (id) => request(`/favorites/${id}`, { method: 'POST' }),
  removeFavorite: (id) => request(`/favorites/${id}`, { method: 'DELETE' }),
  inquiry: (b) => request('/inquiries', { method: 'POST', body: b })
};