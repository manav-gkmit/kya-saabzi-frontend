import { createContext, useState, useEffect } from "react";
import apiClient from "../api/axios";
import { jwtDecode } from "jwt-decode";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem("jwt"));
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    if (token) {
      apiClient.defaults.headers.common["Authorization"] = `Bearer ${token}`;
      try {
        const decodedToken = jwtDecode(token);
        setUser({ username: decodedToken.sub });
      } catch (error) {
        console.error("Invalid token", error);
        localStorage.removeItem("jwt");
        setToken(null);
        setUser(null);
      }
    } else {
      delete apiClient.defaults.headers.common["Authorization"];
      setUser(null);
    }
    setLoading(false);
  }, [token]);

  const login = async (credentials) => {
    const { data } = await apiClient.post("/auth/login", credentials);
    localStorage.setItem("jwt", data.access_token);
    setToken(data.access_token);
  };

  const register = async (userData) => {
    await apiClient.post("/auth/register", userData);
  };

  const logout = () => {
    localStorage.removeItem("jwt");
    setToken(null);
  };

  return (
    <AuthContext.Provider
      value={{ user, token, loading, login, register, logout }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
