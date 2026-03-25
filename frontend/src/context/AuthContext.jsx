import { createContext, useContext, useState, useEffect } from "react";
import api from "../services/api";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // On mount: try to restore session from the httpOnly cookie.
  // If the cookie is absent or expired the API returns 401 and we stay logged out.
  useEffect(() => {
    fetchUser();
  }, []);

  const fetchUser = async () => {
    try {
      // _skipRedirect: true — a 401 here just means "not logged in", don't redirect
      const response = await api.get("/user", { _skipRedirect: true });
      setUser(response.data);
    } catch {
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  const login = async (email, password) => {
    const response = await api.post("/login", { email, password });
    const { user: userData } = response.data;
    // Cookie is set by the server response — nothing to store in JS
    localStorage.removeItem("artisan_cart");
    localStorage.removeItem("artisan_wishlist");
    setUser(userData);
    return userData;
  };

  const register = async (data) => {
    const response = await api.post("/register", data);
    const { user: userData } = response.data;
    setUser(userData);
    return userData;
  };

  const logout = async () => {
    try {
      await api.post("/logout");
    } finally {
      localStorage.removeItem("artisan_cart");
      localStorage.removeItem("artisan_wishlist");
      setUser(null);
      window.location.href = "/";
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
