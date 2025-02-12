import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { FiUser, FiLock } from "react-icons/fi";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify"; // Import ToastContainer and toast
import "react-toastify/dist/ReactToastify.css"; // Import the Toastify CSS

export default function Login() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ username: "", password: "" });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleLogin = async () => {
    if (!formData.username || !formData.password) {
      toast.error("Username and Password are required.");
      return;
    }

    setLoading(true);

    try {
      const response = await axios.post("https://amnii-bt.onrender.com/api/auth/login/", formData, {
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (response.status === 200) {
        const { access_token, refresh_token } = response.data;
        localStorage.setItem("access_token", access_token);
        document.cookie = `${refresh_token}; path=/; secure; HttpOnly; SameSite=Strict`;
        navigate("/");
        toast.success("Login successful!");
      }
    } catch (err) {
      if (err.response) {
        const backendErrors = err.response.data;
        let errorMessages = [];
        for (const field in backendErrors) {
          if (Object.prototype.hasOwnProperty.call(backendErrors, field)) {
            errorMessages.push(...backendErrors[field]);
          }
        }

        toast.error(errorMessages.join(" | "));
      } else if (err.request) {
        toast.error("Network error. Try again later.");
      } else {
        toast.error("An unexpected error occurred.");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleRegisterRedirect = () => {
    navigate("/register");
  };

  return (
    <div className="w-full h-screen flex items-center justify-center bg-gray-100">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        className="w-96 bg-white p-6 rounded-xl shadow-lg"
      >
        <h2 className="text-2xl font-semibold text-center mb-6 text-gray-800">
          Welcome Back 👋
        </h2>

        <div className="relative mb-4">
          <FiUser className="absolute left-3 top-3 text-gray-400" />
          <input
            type="text"
            name="username"
            placeholder="Username"
            className="w-full pl-10 pr-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={formData.username}
            onChange={handleChange}
          />
        </div>

        <div className="relative mb-4">
          <FiLock className="absolute left-3 top-3 text-gray-400" />
          <input
            type="password"
            name="password"
            placeholder="Password"
            className="w-full pl-10 pr-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={formData.password}
            onChange={handleChange}
          />
        </div>

        <button
          onClick={handleLogin}
          disabled={loading}
          className={`w-full py-2 text-white font-semibold rounded-lg transition ${
            loading ? "bg-blue-300 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-700"
          }`}
        >
          {loading ? "Logging in..." : "Login"}
        </button>

        <p className="text-sm text-center mt-4">
          Don&#8217;t have an account?{" "}
          <span
            onClick={handleRegisterRedirect}
            className="text-blue-600 cursor-pointer hover:underline"
          >
            Register
          </span>
        </p>
      </motion.div>

      {/* Toast Container to show toast notifications */}
      <ToastContainer />
    </div>
  );
}
