"use client";

import { useState } from "react";
import Cookies from "js-cookie";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [showError, setShowError] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setShowError(false);

    try {
      const response = await fetch("http://localhost:3000/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message || "Invalid credentials");
      }

      const data = await response.json();

      Cookies.set("token", data.token, {
        expires: 7,
        secure: process.env.NODE_ENV === "production",
        sameSite: "Lax",
      });

      console.log("Login success:", data);
    } catch (err: any) {
      setError(err.message);
      setShowError(true);
      setTimeout(() => setShowError(false), 3000);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-white px-4">
      <div className="w-full max-w-md bg-white shadow-xl rounded-xl p-8 space-y-6">
        <div className="mb-6 text-center">
          <img
            src="/images/SCAM_Group_logo.jpg"
            alt="Your Logo"
            className="mx-auto h-20 w-20 rounded-full object-cover"
          />
        </div>

        <h2 className="text-2xl font-bold text-gray-900 text-center">Sign in to your account</h2>
        <p className="mt-2 text-sm text-center text-gray-600">
          Not a member?{" "}
          <a href="#" className="font-medium text-[#63B6BB] hover:underline">
            Register
          </a>
        </p>

        {showError && (
          <div className="mt-4 text-center text-sm text-red-600">
            {error}
          </div>
        )}

        <form className="mt-8 space-y-5" onSubmit={handleSubmit}>
          <div>
            <label className="block text-sm font-medium text-gray-700">Email address</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-1 w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mt-1 w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>
          {/* <div className="flex items-center justify-between text-sm">
            <label className="flex items-center">
              <input type="checkbox" className="mr-2" />
              Remember me
            </label>
          </div> */}
          <button
            type="submit"
            className="w-full bg-[#F28C28] text-white font-semibold py-2 rounded-md hover:opacity-90 transition"
          >
            Sign in
          </button>
        </form>
      </div>
    </div>
  );
}
