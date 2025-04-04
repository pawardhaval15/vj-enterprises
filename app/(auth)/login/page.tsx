"use client";
import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  FaGoogle,
  FaFacebook,
  FaTwitter,
  FaEye,
  FaEyeSlash,
} from "react-icons/fa";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    try {
      const res = await fetch("http://localhost:5000/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.message || "Login failed");
        return;
      }

      // Store the token (you can also use cookies or sessionStorage)
      localStorage.setItem("token", data.token);

      // Redirect to dashboard
      router.push("/dashboard");
    } catch (err: any) {
      setError("Something went wrong. Please try again.");
      console.error("Login error:", err);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <div className="flex-1 flex items-center justify-center">
        <div className="bg-white rounded-2xl shadow-lg p-8 w-full max-w-md mx-4">
          <h1 className="text-2xl font-semibold text-gray-800 mb-2">Sign In</h1>
          <p className="text-gray-600 mb-6">
            Don't have an account?
            <Link
              href="/register"
              className="text-blue-600 ml-1 hover:underline"
            >
              Create One Now!
            </Link>
          </p>

          <div className="flex justify-between gap-4 mb-6">
            <button className="flex-1 border border-gray-300 rounded-full py-2 flex items-center justify-center hover:bg-gray-50 transition">
              <FaGoogle className="text-red-500" />
            </button>
            <button className="flex-1 border border-gray-300 rounded-full py-2 flex items-center justify-center hover:bg-gray-50 transition">
              <FaFacebook className="text-blue-600" />
            </button>
            <button className="flex-1 border border-gray-300 rounded-full py-2 flex items-center justify-center hover:bg-gray-50 transition">
              <FaTwitter className="text-blue-400" />
            </button>
          </div>

          <div className="flex items-center justify-center mb-6">
            <div className="flex-1 h-px bg-gray-200"></div>
            <span className="px-4 text-gray-500 text-sm">OR</span>
            <div className="flex-1 h-px bg-gray-200"></div>
          </div>

          {error && (
            <p className="text-red-600 text-sm mb-4 text-center">{error}</p>
          )}

          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label htmlFor="email" className="block text-gray-600 mb-2">
                Email address
              </label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full border border-gray-300 rounded-md p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter your email"
                required
              />
            </div>

            <div className="mb-6">
              <label htmlFor="password" className="block text-gray-600 mb-2">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full border border-gray-300 rounded-md p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter your password"
                  required
                />
                <button
                  type="button"
                  className="absolute right-3 top-3 text-gray-400"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <FaEyeSlash /> : <FaEye />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              className="w-full bg-blue-600 text-white py-3 rounded-md hover:bg-blue-700 transition font-medium"
            >
              Login
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
