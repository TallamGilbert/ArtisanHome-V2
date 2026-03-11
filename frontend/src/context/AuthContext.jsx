import { createContext, useContext, useState, useEffect } from "react";
import api from "../services/api";
import { use } from "react";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [token, setToken] = useState(localStorage.getItem("artisan_token"));

  useEffect(() => {
    if (token) {
      api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
      fetchUser();
    } else {
      setLoading(false);
    }
  }, [token]);

  const fetchUser = async () => {
    try {
      const response = await api.get("/user");
      setUser(response.data);
    } catch (err) {
      localStorage.removeItem("artisan_token");
      setToken(null);
      delete api.defaults.headers.common["Authorization"];
    } finally {
      setLoading(false);
    }
  };

  const login = async (email, password) => {
    const response = await api.post("/login", { email, password });
    const { token: newToken, user: userData } = response.data;
    localStorage.setItem("artisan_token", newToken);
    api.defaults.headers.common["Authorization"] = `Bearer ${newToken}`;
    localStorage.removeItem("artisan_cart");
    localStorage.removeItem("artisan_wishlist");
    window.location.href = userData.is_admin ? "/admin" : "/";
  };

  const register = async (data) => {
    const response = await api.post("/register", data);
    const { token: newToken, user: userData } = response.data;
    localStorage.setItem("artisan_token", newToken);
    api.defaults.headers.common["Authorization"] = `Bearer ${newToken}`;
    setToken(newToken);
    setUser(userData);
    return userData;
  };

  const logout = async () => {
    try {
      await api.post("/logout");
    } finally {
      localStorage.removeItem("artisan_token");
      localStorage.removeItem("artisan_cart");
      localStorage.removeItem("artisan_wishlist");
      setToken(null);
      setUser(null);
      delete api.defaults.headers.common["Authorization"];

      window.location.href = "/";
    }
  };

  return (
    <AuthContext.Provider
      value={{ user, loading, token, login, register, logout }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
