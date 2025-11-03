import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Mail, Lock, LogIn, UserCheck } from "lucide-react";
import apiClient from "../api/apiClient";
import { useAuth } from "../context/AuthContext";
import toast from "react-hot-toast";

export default function Login() {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [errors, setErrors] = useState({ email: "", password: "" });
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

    let tempErrors = { email: "", password: "" };
    let hasError = false;

    if (!formData.email) {
      tempErrors.email = "Email is required";
      hasError = true;
    } else if (!validateEmail(formData.email)) {
      tempErrors.email = "Invalid email address";
      hasError = true;
    }
    if (!formData.password) {
      tempErrors.password = "Password is required";
      hasError = true;
    }

    if (hasError) {
      setErrors(tempErrors);
      return;
    }

    try {
      const res = await apiClient.post("/auth/login", formData);
      if (res?.status === 200) {
        login(res.data.token, res.data.user);
        setFormData({ email: "", password: "" });
        setErrors({ email: "", password: "" });
        navigate("/notes");
        toast.success(res?.data?.message || "Login successful");
      }
    } catch (err) {
      const apiError = err.response?.data?.message || "Login failed";
      toast.error(apiError);

      if (apiError.includes("password")) {
        setErrors({ email: "", password: apiError });
      } else if (apiError.includes("email") || apiError.includes("account")) {
        setErrors({ email: apiError, password: "" });
      } else {
        setErrors({ email: "", password: "" });
      }
    }
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row">
      {/* Left Illustration Panel */}
      <div className="hidden md:flex flex-1 bg-gradient-to-br from-indigo-600 via-blue-500 to-indigo-700 items-center justify-center text-white p-10 relative overflow-hidden">
        <div className="max-w-md text-center relative z-10">
          <div className="flex items-center justify-center gap-3 mb-4">
            <UserCheck className="w-10 h-10 text-white drop-shadow-md" />
            <h1 className="text-4xl font-bold">Welcome Back</h1>
          </div>
          <p className="text-indigo-100 text-lg leading-relaxed">
            Sign in to <span className="font-semibold">TeamNotes</span> and
            continue managing your ideas, thoughts, and notes seamlessly.
          </p>
        </div>
      </div>

      {/* Right Form Panel */}
      <div className="flex-1 flex items-center justify-center bg-gradient-to-br from-indigo-50 via-white to-blue-50 px-6 py-12 sm:px-12">
        <div className="w-full max-w-md bg-white/80 backdrop-blur-md shadow-2xl rounded-2xl border border-gray-100 p-8 sm:p-10">
          <h2 className="text-3xl font-bold text-center text-gray-800 mb-6">
            Log In
          </h2>

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Email */}
            <div>
              <label className="block text-gray-700 font-semibold mb-1">
                Email <span className="text-red-500">*</span>
              </label>
              <div className="flex items-center border rounded-lg px-3 py-2 focus-within:ring-2 focus-within:ring-indigo-500">
                <Mail className="w-5 h-5 text-gray-500 mr-2" />
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="you@example.com"
                  className="w-full bg-transparent outline-none focus:ring-0 focus:outline-none text-gray-800"
                />
              </div>
              {errors.email && (
                <p className="text-red-500 text-sm mt-1">{errors.email}</p>
              )}
            </div>

            {/* Password */}
            <div>
              <label className="block text-gray-700 font-semibold mb-1">
                Password <span className="text-red-500">*</span>
              </label>
              <div className="flex items-center border rounded-lg px-3 py-2 focus-within:ring-2 focus-within:ring-indigo-500">
                <Lock className="w-5 h-5 text-gray-500 mr-2" />
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="••••••••"
                  className="w-full bg-transparent outline-none focus:ring-0 focus:outline-none text-gray-800"
                />
              </div>
              {errors.password && (
                <p className="text-red-500 text-sm mt-1">{errors.password}</p>
              )}
            </div>

            {/* Login Button */}
            <button
              type="submit"
              className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-indigo-600 to-blue-500 text-white font-semibold py-2.5 rounded-lg shadow-md hover:opacity-90 transition-all disabled:opacity-50"
            >
              <LogIn className="w-5 h-5" />
              Log In
            </button>
          </form>

          {/* Footer */}
          <p className="text-sm text-gray-600 mt-5 text-center">
            Don’t have an account?{" "}
            <Link
              to="/signup"
              className="text-indigo-600 font-semibold hover:underline"
            >
              Sign up
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
