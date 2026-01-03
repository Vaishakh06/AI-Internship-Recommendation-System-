// src/pages/LoginPage.jsx
import { useState } from "react";
import { useAuth } from "../context/AuthContext.jsx";
import { useNavigate, useLocation, Link } from "react-router-dom";

const LoginPage = ({ mode = "student" }) => {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  // Redirect destination
  const from = location.state?.from?.pathname || "/";

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      // Login user via AuthContext
      const loggedInUser = await login(formData.email, formData.password);

      if (!loggedInUser) {
        throw new Error("Invalid credentials or email not verified.");
      }


      // Navigate based on role
      const destination =
        loggedInUser.role === "admin"
          ? "/admin/dashboard"
          : "/student/dashboard";
      navigate(destination, { replace: true });
    } catch (err) {
      console.error("Login error:", err);
      setError(
        err.response?.data?.message ||
        err.message ||
        "Login failed. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-[#171C1C] text-white">
      <form
        onSubmit={handleSubmit}
        className="bg-gray-800 p-8 rounded-lg shadow-lg w-full max-w-sm"
      >
        <h2 className="text-2xl font-bold mb-6 text-center text-yellow-400">
          {mode === "admin" ? "Admin Login" : "Login"}
        </h2>

        {error && (
          <p className="text-red-500 text-center mb-4 font-medium">{error}</p>
        )}

        <div className="mb-4">
          <label className="block text-gray-300 mb-2" htmlFor="email">
            Email
          </label>
          <input
            type="email"
            id="email"
            value={formData.email}
            onChange={handleChange}
            className="w-full p-2 rounded bg-gray-700 text-white focus:ring-2 focus:ring-yellow-400"
            placeholder="you@example.com"
            required
          />
        </div>

        <div className="mb-6">
          <label className="block text-gray-300 mb-2" htmlFor="password">
            Password
          </label>
          <input
            type="password"
            id="password"
            value={formData.password}
            onChange={handleChange}
            className="w-full p-2 rounded bg-gray-700 text-white focus:ring-2 focus:ring-yellow-400"
            placeholder="••••••••"
            required
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-yellow-500 hover:bg-yellow-600 text-black font-semibold py-2 rounded disabled:opacity-60"
        >
          {loading ? "Logging in..." : "Log In"}
        </button>

        {mode !== "admin" && (
          <p className="text-center text-gray-400 mt-4">
            Don’t have an account?{" "}
            <Link to="/register" className="text-yellow-400 hover:underline">
              Sign Up
            </Link>
          </p>
        )}
      </form>
    </div>
  );
};

export default LoginPage;
