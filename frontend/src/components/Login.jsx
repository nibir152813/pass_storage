import React, { useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { authAPI, setAuth } from "../utils/api";

const Login = ({ onLogin }) => {
  const [isSignup, setIsSignup] = useState(false);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e?.preventDefault();
    
    if (!form.email || !form.password) {
      toast.error("Email and password required!");
      return;
    }

    if (form.password.length < 6) {
      toast.error("Password must be at least 6 characters long!");
      return;
    }

    setLoading(true);

    try {
      let response;
      if (isSignup) {
        response = await authAPI.register(form.email, form.password);
        toast.success("Account created successfully!");
      } else {
        response = await authAPI.login(form.email, form.password);
        toast.success("Login successful!");
      }

      // Store token and user info
      setAuth(response.token, response.user);
      onLogin(true);
    } catch (error) {
      toast.error(error.message || "Something went wrong!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-green-50">
      <ToastContainer theme="dark" />

      <div className="bg-white p-10 rounded-xl shadow-xl w-[90%] max-w-md">
        <h1 className="text-3xl font-bold text-center mb-6">
          <span className="text-green-500">&lt;</span>Pass
          <span className="text-green-500">ST/&gt;</span>
        </h1>

        <h2 className="text-xl font-semibold text-center text-green-700 mb-6">
          {isSignup ? "Create Account" : "Login to Continue"}
        </h2>

        <form onSubmit={handleSubmit}>
          <input
            name="email"
            type="email"
            placeholder="Enter your Email"
            value={form.email}
            onChange={handleChange}
            required
            className="w-full p-3 mb-4 border border-green-500 rounded-full focus:outline-none focus:ring-2 focus:ring-green-500"
          />

          <input
            name="password"
            type="password"
            placeholder="Enter Password"
            value={form.password}
            onChange={handleChange}
            required
            minLength={6}
            className="w-full p-3 mb-6 border border-green-500 rounded-full focus:outline-none focus:ring-2 focus:ring-green-500"
          />

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-green-600 hover:bg-green-500 disabled:bg-green-400 disabled:cursor-not-allowed text-white py-3 rounded-full font-bold transition-colors"
          >
            {loading ? "Please wait..." : isSignup ? "Sign Up" : "Login"}
          </button>
        </form>

        <div className="mt-4 text-center">
          <button
            onClick={() => {
              setIsSignup(!isSignup);
              setForm({ email: "", password: "" });
            }}
            className="text-green-600 hover:text-green-700 text-sm font-medium"
          >
            {isSignup
              ? "Already have an account? Login"
              : "Don't have an account? Sign Up"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Login;
