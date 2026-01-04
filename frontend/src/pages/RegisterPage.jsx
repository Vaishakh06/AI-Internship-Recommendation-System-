import { useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";

// Backend URL
const BACKEND_URL =
  import.meta.env.VITE_API_URL || "http://localhost:8080";

const RegisterPage = () => {
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState({ type: "", message: "" });
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus({ type: "", message: "" });

    if (!formData.fullName || !formData.email || !formData.password) {
      setStatus({ type: "error", message: "All fields are required." });
      return;
    }

    try {
      setLoading(true);

      const res = await axios.post(
        `${BACKEND_URL}/api/auth/register`,
        formData
      );

      setStatus({
        type: "success",
        message:
          res.data?.message ||
          "Registration successful! You can now log in.",
      });

      setTimeout(() => {
        navigate("/login");
      }, 2000);
    } catch (err) {
      console.error("Signup Error:", err);
      const msg =
        err.response?.data?.message ||
        "Registration failed. Try again later.";
      setStatus({ type: "error", message: msg });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-[#171C1C] text-white">
      <form
        onSubmit={handleSubmit}
        className="bg-gray-800 p-8 rounded-lg shadow-lg w-full max-w-md"
      >
        <h2 className="text-3xl font-bold mb-6 text-center text-yellow-400">
          Create Account
        </h2>

        {status.message && (
          <div
            className={`text-center mb-4 ${status.type === "error"
                ? "text-red-500"
                : "text-green-400"
              }`}
          >
            {status.message}
          </div>
        )}

        <div className="mb-4">
          <label className="block text-gray-300 mb-2" htmlFor="fullName">
            Full Name
          </label>
          <input
            type="text"
            id="fullName"
            value={formData.fullName}
            onChange={handleChange}
            className="w-full p-2 rounded bg-gray-700 text-white focus:ring-2 focus:ring-yellow-400"
            placeholder="Your full name"
            required
          />
        </div>

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
          {loading ? "Registering..." : "Sign Up"}
        </button>

        <p className="text-center text-gray-400 mt-4">
          Already have an account?{" "}
          <Link to="/login" className="text-yellow-400 hover:underline">
            Log In
          </Link>
        </p>
      </form>
    </div>
  );
};

export default RegisterPage;
