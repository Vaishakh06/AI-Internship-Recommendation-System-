// src/context/AuthContext.jsx
import { createContext, useState, useContext, useEffect } from "react";
import axios from "axios";

const AuthContext = createContext();
export const useAuth = () => useContext(AuthContext);

// ✅ 1. Define your Backend URL here (Copy from your ngrok terminal)
const BACKEND_URL = import.meta.env.VITE_API_URL || "http://localhost:8080";

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem("token"));
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (token) {
      try {
        const decoded = JSON.parse(atob(token.split(".")[1]));
        setUser(decoded);
      } catch (err) {
        console.error("Invalid token:", err);
        localStorage.removeItem("token");
        setToken(null);
      }
    }
    setLoading(false);
  }, [token]);

  const login = async (email, password) => {
    try {
      // ✅ 2. CHANGED: Use the public ngrok URL instead of localhost
      const res = await axios.post(`${BACKEND_URL}/api/auth/login`, {
        email,
        password,
      });

      // ✅ Check what you got back
      console.log("🟢 Login response:", res.data);

      const { token, user } = res.data;
      if (!token || !user) throw new Error("Invalid response from server");

      // Save to localStorage
      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(user));

      setToken(token);
      setUser(user);

      return user; // Return user so LoginPage can navigate
    } catch (err) {
      console.error("Login error:", err.response?.data || err.message);
      throw new Error(err.response?.data?.message || "Login failed");
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, token, login, logout, loading }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};