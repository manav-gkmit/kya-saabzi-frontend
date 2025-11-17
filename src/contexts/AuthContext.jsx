import { createContext, useState, useEffect } from 'react';
import apiClient from '../api/axios';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('jwt'));

  useEffect(() => {
    if (token) {
      apiClient.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      setUser({ username: 'testuser' });
    } else {
      delete apiClient.defaults.headers.common['Authorization'];
      setUser(null);
    }
  }, [token]);

  const login = async (credentials) => {
    const { data } = await apiClient.post('/auth/login', credentials);
    localStorage.setItem('jwt', data.access_token);
    setToken(data.access_token);
  };

  const register = async (userData) => {
    await apiClient.post('/auth/register', userData);
  };

  const logout = () => {
    localStorage.removeItem('jwt');
    setToken(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout, token }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
