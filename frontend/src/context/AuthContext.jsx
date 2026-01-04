import { createContext, useState, useContext, useEffect } from "react";
import axios from "axios";

const AuthContext = createContext();
export const useAuth = () => useContext(AuthContext);

// Backend URL
const BACKEND_URL =
  import.meta.env.VITE_API_URL || "http://localhost:8080";

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(
    JSON.parse(localStorage.getItem("user")) || null
  );
  const [token, setToken] = useState(
    localStorage.getItem("token") || null
  );
  const [loading, setLoading] = useState(true);

  // Run once on app load
  useEffect(() => {
    setLoading(false);
  }, []);

  // LOGIN
  const login = async (email, password) => {
    try {
      const res = await axios.post(`${BACKEND_URL}/api/auth/login`, {
        email,
        password,
      });

      const { token, user } = res.data;
      if (!token || !user) {
        throw new Error("Invalid response from server");
      }

      // Save to localStorage
      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(user));

      setToken(token);
      setUser(user);

      return user;
    } catch (err) {
      console.error("Login error:", err.response?.data || err.message);
      throw new Error(err.response?.data?.message || "Login failed");
    }
  };

  // LOGOUT
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
