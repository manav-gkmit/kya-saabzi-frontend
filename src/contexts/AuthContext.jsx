import { createContext, useState, useEffect, useCallback, useRef } from 'react';
import apiClient from '../api/axios';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('jwt'));
  const [refreshToken, setRefreshToken] = useState(localStorage.getItem('refresh_token'));
  const [isLoading, setIsLoading] = useState(!!localStorage.getItem('jwt'));
  const hasFetchedUser = useRef(false);

  // Fetch the real user profile from /auth/me
  const fetchUserProfile = useCallback(async (jwt) => {
    if (!jwt) return;
    try {
      apiClient.defaults.headers.common['Authorization'] = `Bearer ${jwt}`;
      const { data } = await apiClient.get('/auth/me');
      setUser(data);
    } catch (err) {
      console.error("Failed to fetch user profile:", err);
      // Only clear session if it's an authentication failure (401 or 403)
      if (err.response?.status === 401 || err.response?.status === 403) {
        localStorage.removeItem('jwt');
        localStorage.removeItem('refresh_token');
        delete apiClient.defaults.headers.common['Authorization'];
        setToken(null);
        setRefreshToken(null);
        setUser(null);
      }
    } finally {
      setIsLoading(false);
    }
  }, []);

  // On mount: rehydrate session from localStorage token
  useEffect(() => {
    if (token && !hasFetchedUser.current) {
      hasFetchedUser.current = true;
      fetchUserProfile(token);
    } else if (!token) {
      delete apiClient.defaults.headers.common['Authorization'];
      setUser(null);
      setIsLoading(false);
    }
  }, [token, fetchUserProfile]);

  const login = async (credentials) => {
    const { data } = await apiClient.post('/auth/login', credentials);
    localStorage.setItem('jwt', data.access_token);
    if (data.refresh_token) {
      localStorage.setItem('refresh_token', data.refresh_token);
      setRefreshToken(data.refresh_token);
    }
    apiClient.defaults.headers.common['Authorization'] = `Bearer ${data.access_token}`;
    setUser(data.user);
    setToken(data.access_token);
  };

  const register = async (userData) => {
    await apiClient.post('/auth/register', userData);
  };

  const logout = () => {
    if (refreshToken) {
      apiClient.post('/auth/logout', { refresh_token: refreshToken }).catch(err => {
        console.error("Logout request failed:", err);
      });
    }
    localStorage.removeItem('jwt');
    localStorage.removeItem('refresh_token');
    delete apiClient.defaults.headers.common['Authorization'];
    setToken(null);
    setRefreshToken(null);
    setUser(null);
    hasFetchedUser.current = false;
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout, token, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
