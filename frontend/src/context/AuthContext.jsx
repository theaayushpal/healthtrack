import { createContext, useContext, useState } from 'react';
import api from '../utils/api';
const AuthContext = createContext(null);
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => JSON.parse(localStorage.getItem('ht_user') || 'null'));
  const login = async (email, password) => {
    const { data } = await api.post('/auth/login', { email, password });
    localStorage.setItem('ht_token', data.token); localStorage.setItem('ht_user', JSON.stringify(data.user));
    setUser(data.user); return data;
  };
  const register = async (username, email, password) => {
    const { data } = await api.post('/auth/register', { username, email, password });
    localStorage.setItem('ht_token', data.token); localStorage.setItem('ht_user', JSON.stringify(data.user));
    setUser(data.user); return data;
  };
  const logout = () => { localStorage.removeItem('ht_token'); localStorage.removeItem('ht_user'); setUser(null); };
  const updateUser = u => { localStorage.setItem('ht_user', JSON.stringify(u)); setUser(u); };
  return <AuthContext.Provider value={{ user, login, register, logout, updateUser }}>{children}</AuthContext.Provider>;
};
export const useAuth = () => useContext(AuthContext);
