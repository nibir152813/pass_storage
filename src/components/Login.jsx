import React, { useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Login = ({ onLogin }) => {
  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  
  const USER_EMAIL = "nibir@gmail.com";
  const USER_PASSWORD = "123456";

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleLogin = () => {
    if (!form.email || !form.password) {
      toast.error("Email and password required!");
      return;
    }

    const emailMatch =
      form.email.trim().toLowerCase() === USER_EMAIL.toLowerCase();

    const passwordMatch = form.password.trim() === USER_PASSWORD;

    if (emailMatch && passwordMatch) {
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
          name="email"
          type="email"
          placeholder="Enter your Email"
          onChange={handleChange}
          className="w-full p-3 mb-4 border border-green-500 rounded-full"
        />

        <input
          name="password"
          type="password"
          placeholder="Enter Password"
          onChange={handleChange}
          className="w-full p-3 mb-6 border border-green-500 rounded-full"
        />

        <button
          onClick={handleLogin}
          className="w-full bg-green-600 hover:bg-green-500 text-white py-3 rounded-full font-bold"
        >
          Login
        </button>
      </div>
    </div>
  );
};

export default Login;
