"use client";
import React, { useState } from 'react';
import Link from 'next/link';
import { FaGoogle, FaFacebook, FaTwitter, FaEye, FaEyeSlash } from 'react-icons/fa';

const Signup = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [role, setRole] = useState('user');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    try {
      const res = await fetch("http://localhost:5000/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ name, email, password, role })
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.message || "Registration failed.");
      } else {
        setSuccess(data.message || "Registered successfully!");
        setName('');
        setEmail('');
        setPassword('');
      }
    } catch (err) {
      setError("Something went wrong. Please try again.");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <div className="flex-1 flex items-center justify-center">
        <div className="bg-white rounded-2xl shadow-lg p-8 w-full max-w-md mx-4">
          <h1 className="text-2xl font-semibold text-gray-800 mb-2">Sign Up</h1>
          <p className="text-gray-600 mb-6">
            Already have an account?
            <Link href="/login" className="text-blue-600 ml-1 hover:underline">
              Log In Now!
            </Link>
          </p>

          {/* Social Buttons */}
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

          {/* Divider */}
          <div className="flex items-center justify-center mb-6">
            <div className="flex-1 h-px bg-gray-200"></div>
            <span className="px-4 text-gray-500 text-sm">OR</span>
            <div className="flex-1 h-px bg-gray-200"></div>
          </div>

          {error && <p className="text-red-500 text-sm mb-4">{error}</p>}
          {success && <p className="text-green-500 text-sm mb-4">{success}</p>}

          <form onSubmit={handleSubmit}>
            {/* Name */}
            <div className="mb-4">
              <label htmlFor="name" className="block text-gray-600 mb-2">Full Name</label>
              <input
                type="text"
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full border border-gray-300 rounded-md p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter your name"
                required
              />
            </div>

            {/* Email */}
            <div className="mb-4">
              <label htmlFor="email" className="block text-gray-600 mb-2">Email address</label>
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

            {/* Role */}
            <div className="mb-4">
              <label htmlFor="role" className="block text-gray-600 mb-2">Role</label>
              <select
                id="role"
                value={role}
                onChange={(e) => setRole(e.target.value)}
                className="w-full border border-gray-300 rounded-md p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="user">User</option>
                <option value="admin">Admin</option>
              </select>
            </div>

            {/* Password */}
            <div className="mb-6">
              <label htmlFor="password" className="block text-gray-600 mb-2">Password</label>
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
              Sign Up
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Signup;
