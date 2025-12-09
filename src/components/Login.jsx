import React, { useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Login = ({ onLogin }) => {
  const [form, setForm] = useState({ email: "", password: "" });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleLogin = () => {
    if (form.email.length < 3 || form.password.length < 3) {
      toast.error("Invalid email or password!");
      return;
    }

    // Simple demo login (no backend yet)
    const savedUser = JSON.parse(localStorage.getItem("user"));

    if (
      savedUser &&
      savedUser.email === form.email &&
      savedUser.password === form.password
    ) {
      toast.success("Login successful!");
      onLogin(true);
    } else {
      toast.error("Wrong email or password!");
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
          Login to Continue
        </h2>

        <input
          onChange={handleChange}
          name="email"
          type="email"
          placeholder="Enter your Email"
          className="w-full p-3 mb-4 border border-green-500 rounded-full"
        />

        <input
          onChange={handleChange}
          name="password"
          type="password"
          placeholder="Enter Password"
          className="w-full p-3 mb-6 border border-green-500 rounded-full"
        />

        <button
          onClick={handleLogin}
          className="w-full bg-green-600 hover:bg-green-500 text-white py-3 rounded-full font-bold"
        >
          Login
        </button>

        <p className="mt-4 text-center text-sm">
          Don't have an account?{" "}
          <a href="#" className="text-green-600 font-semibold">
            Register
          </a>
        </p>
      </div>
    </div>
  );
};

export default Login;
