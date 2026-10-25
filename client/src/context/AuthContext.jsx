import { createContext, useCallback, useContext, useEffect, useState } from 'react';
import { api, getToken, setToken } from '../services/api.js';

const Ctx = createContext(null);
export const useAuth = () => useContext(Ctx);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [ready, setReady] = useState(!getToken());
  const [saved, setSaved] = useState(new Set());

  const loadSaved = useCallback(async () => {
    try {
      const list = await api.favorites();
      setSaved(new Set(list.map((p) => p._id)));
    } catch {
      setSaved(new Set());
    }
  }, []);

  useEffect(() => {
    if (!getToken()) return;
    api.me()
      .then((u) => { setUser(u); return loadSaved(); })
      .catch(() => setToken(null))
      .finally(() => setReady(true));
  }, [loadSaved]);

  const finish = async (res) => {
    setToken(res.token);
    setUser(res.user);
    await loadSaved();
    return res.user;
  };
  const login = async (b) => finish(await api.login(b));
  const register = async (b) => finish(await api.register(b));
  const logout = () => { setToken(null); setUser(null); setSaved(new Set()); };

  const toggleSave = async (id) => {
    if (saved.has(id)) {
      await api.removeFavorite(id);
      setSaved((s) => { const n = new Set(s); n.delete(id); return n; });
    } else {
      await api.saveFavorite(id);
      setSaved((s) => new Set(s).add(id));
    }
  };

  return <Ctx.Provider value={{ user, ready, saved, login, register, logout, toggleSave }}>{children}</Ctx.Provider>;
}