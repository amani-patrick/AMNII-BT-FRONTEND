import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { FiUser, FiLock, FiMail } from "react-icons/fi";
import { FaUserCircle } from "react-icons/fa";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify"; // Import ToastContainer and toast
import "react-toastify/dist/ReactToastify.css"; // Import the Toastify CSS

export default function Register() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    username: "",
    password: "",
    email: "",
    first_name: "",
    last_name: "",
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleRegister = async () => {
    // Validate form fields
    if (!formData.username || !formData.password || !formData.email || !formData.first_name || !formData.last_name) {
      toast.error("All fields are required.");
      return;
    }

    setLoading(true);

    try {
      // Send data to backend
      const response = await axios.post("http://127.0.0.1:8000/api/auth/register/", {
        username: formData.username,
        password: formData.password,
        email: formData.email,
        first_name: formData.first_name,
        last_name: formData.last_name,
      }, {
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (response.status === 201) {
        toast.success("Registration successful! Redirecting to login...");
        setTimeout(() => navigate("/login"), 2000);
      }
    } catch (err) {
      if (err.response) {
        // Server responded with an error
        const backendErrors = err.response.data;
        let errorMessages = [];

        // Loop through the errors and create a list of messages
        for (const field in backendErrors) {
          if (Object.prototype.hasOwnProperty.call(backendErrors, field)) {
            errorMessages.push(...backendErrors[field]);
          }
        }

        // Join all error messages into a single string and show error toast
        toast.error(errorMessages.join(" | "));
      } else if (err.request) {
        // Request was made but no response received
        toast.error("Network error. Try again later.");
      } else {
        // Something else happened in setting up the request
        toast.error("An unexpected error occurred.");
      }
    } finally {
      setLoading(false);
    }
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
          Create an Account 🚀
        </h2>

        <div className="relative mb-4">
          <FaUserCircle className="absolute left-3 top-3 text-gray-400" />
          <input
            type="text"
            name="first_name"
            placeholder="First Name"
            className="w-full pl-10 pr-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={formData.first_name}
            onChange={handleChange}
          />
        </div>

        <div className="relative mb-4">
          <FaUserCircle className="absolute left-3 top-3 text-gray-400" />
          <input
            type="text"
            name="last_name"
            placeholder="Last Name"
            className="w-full pl-10 pr-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={formData.last_name}
            onChange={handleChange}
          />
        </div>

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
          <FiMail className="absolute left-3 top-3 text-gray-400" />
          <input
            type="email"
            name="email"
            placeholder="Email"
            className="w-full pl-10 pr-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={formData.email}
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
          onClick={handleRegister}
          disabled={loading}
          className={`w-full py-2 text-white font-semibold rounded-lg transition ${
            loading ? "bg-blue-300 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-700"
          }`}
        >
          {loading ? "Creating Account..." : "Register"}
        </button>

        <p className="text-sm text-center mt-4">
          Already have an account?{" "}
          <span
            onClick={() => navigate("/login")}
            className="text-blue-600 cursor-pointer hover:underline"
          >
            Login
          </span>
        </p>
      </motion.div>

      {/* Toast Container to show toast notifications */}
      <ToastContainer />
    </div>
  );
}
