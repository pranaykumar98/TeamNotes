import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { UserPlus, User, Mail, Lock } from "lucide-react"; 
import apiClient from "../api/apiClient";
import { useAuth } from "../context/AuthContext";
import toast from "react-hot-toast";

export default function Signup() {
  const [formData, setFormData] = useState({ name: "", email: "", password: "" });
  const [errors, setErrors] = useState({ name: "", email: "", password: "" });
  const navigate = useNavigate();
  const { login } = useAuth();

  const validateEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });

    if (name === "email") {
      if (!value) setErrors((prev) => ({ ...prev, email: "Email is required" }));
      else if (!validateEmail(value))
        setErrors((prev) => ({ ...prev, email: "Invalid email address" }));
      else setErrors((prev) => ({ ...prev, email: "" }));
    } else setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { name, email, password } = formData;
    let tempErrors = { name: "", email: "", password: "" };
    let hasError = false;

    if (!name) {
      tempErrors.name = "Name is required";
      hasError = true;
    }
    if (!email) {
      tempErrors.email = "Email is required";
      hasError = true;
    } else if (!validateEmail(email)) {
      tempErrors.email = "Invalid email address";
      hasError = true;
    }
    if (!password) {
      tempErrors.password = "Password is required";
      hasError = true;
    } else if (password.length < 8) {
      tempErrors.password = "Password must be at least 8 characters long";
      hasError = true;
    }

    if (hasError) return setErrors(tempErrors);

    try {
      const res = await apiClient.post("/auth/signup", { name, email, password });
      if (res?.status === 201) {
        login(res.data.token, res.data.user);
        setFormData({ name: "", email: "", password: "" });
        setErrors({ name: "", email: "", password: "" });
        navigate("/notes");
        toast.success("Signup successful and Logged In!");
      }
    } catch (err) {
      const apiError = err.response?.data?.message || "Signup failed";
      toast.error(apiError);
      setErrors({ name: apiError, email: apiError, password: apiError });
    }
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row">
      {/* Left Illustration Panel */}
      <div className="hidden md:flex flex-1 bg-gradient-to-br from-blue-600 via-indigo-500 to-purple-600 items-center justify-center text-white p-10 relative overflow-hidden">
        <div className="max-w-md text-center relative z-10">
          <div className="flex items-center justify-center gap-3 mb-4">
            <UserPlus className="w-10 h-10 text-white drop-shadow-md" /> 
            <h1 className="text-4xl font-bold">Join TeamNotes</h1>
          </div>
          <p className="text-indigo-100 text-lg leading-relaxed">
            Create your free account and start organizing your ideas,
            inspirations, and notes effortlessly.
          </p>
        </div>
      </div>

      {/* Right Form Panel */}
      <div className="flex-1 flex items-center justify-center bg-gradient-to-br from-indigo-50 via-white to-blue-50 px-6 py-12 sm:px-12">
        <div className="w-full max-w-md bg-white/80 backdrop-blur-md shadow-2xl rounded-2xl border border-gray-100 p-8 sm:p-10">
          <h2 className="text-3xl font-bold text-center mb-8 text-gray-800 flex items-center justify-center gap-2">
            <User className="w-6 h-6 text-indigo-600" /> Create an Account
          </h2>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Name */}
            <div>
              <label className="block text-gray-700 font-semibold mb-2">
                Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Your name"
                className={`w-full px-4 py-2.5 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 transition ${
                  errors.name ? "border-red-500" : "border-gray-300"
                }`}
              />
              {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
            </div>

            {/* Email */}
            <div>
              <label className="block text-gray-700 font-semibold mb-2">
                Email <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-3.5 text-gray-400 w-5 h-5" />
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="you@example.com"
                  className={`w-full pl-10 pr-3 py-2.5 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 transition ${
                    errors.email ? "border-red-500" : "border-gray-300"
                  }`}
                />
              </div>
              {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
            </div>

            {/* Password */}
            <div>
              <label className="block text-gray-700 font-semibold mb-2">
                Password <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-3.5 text-gray-400 w-5 h-5" />
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="••••••••"
                  className={`w-full pl-10 pr-3 py-2.5 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 transition ${
                    errors.password ? "border-red-500" : "border-gray-300"
                  }`}
                />
              </div>
              {errors.password && (
                <p className="text-red-500 text-sm mt-1">{errors.password}</p>
              )}
            </div>

            <button
              type="submit"
              className="w-full bg-gradient-to-r from-indigo-600 to-blue-500 text-white py-2.5 rounded-lg font-semibold shadow-md hover:opacity-90 transition"
            >
              Sign Up
            </button>
          </form>

          <p className="text-sm text-gray-600 mt-6 text-center">
            Already have an account?{" "}
            <Link to="/login" className="text-indigo-600 font-semibold hover:underline">
              Log in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
