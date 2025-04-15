'use client'

import React, { useState } from 'react'
import userRegister from "@/libs/userRegister";

export default function Register() {
  const [name, setName] = useState('')
  const [telephone, setTelephone] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)

  const handleRegister = async () => {
    if (!name || !telephone || !email || !password) {
      setError('Please fill in all fields.')
      return
    }

    setLoading(true)
    setError(null)
    setSuccess(null)

    try {
      const res = await userRegister(name, email, telephone, password);
      if (!res.success) throw new Error('Invalid Credential.');
      if ("token" in res) {
        // set cookie
        await fetch("/api/auth", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ token: res.token, role: 'user' }),
        });
      }
      setSuccess('Registration successful!')
      setName('')
      setTelephone('')
      setEmail('')
      setPassword('')
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-white px-4">
      <div className="w-full max-w-md bg-white shadow-xl rounded-xl p-8 space-y-6">
        {/* Avatar */}
        <div className="text-center">
          <img
            src="/images/SCAM_Group_logo.jpg" // <-- Replace this if your image path is different
            alt="Avatar"
            className="mx-auto w-20 h-20 rounded-full object-cover"
          />
        </div>

        {/* Heading */}
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900">Create your account</h2>
          <p className="mt-2 text-sm text-gray-600">
            Already have an account?{' '}
            <a href="/auth/login" className="text-[#63B6BB] font-medium hover:underline">
              Sign in
            </a>
          </p>
        </div>

        {/* Feedback */}
        {error && <div className="mt-4 px-4 py-2 text-center bg-red-100 text-red-700 border border-red-400 rounded-md text-sm font-medium">{error}</div>}
        {success && <div className="mt-4 px-4 py-2 text-center bg-green-100 text-green-700 border border-green-400 rounded-md text-sm font-medium">{success}</div>}

        {/* Form */}
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="mt-1 w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-orange-400 focus:outline-none"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Telephone</label>
            <input
              type="tel"
              value={telephone}
              onChange={(e) => setTelephone(e.target.value)}
              className="mt-1 w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-orange-400 focus:outline-none"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-1 w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-orange-400 focus:outline-none"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mt-1 w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-orange-400 focus:outline-none"
              required
            />
          </div>

          <button
            onClick={handleRegister}
            disabled={loading}
            className="w-full bg-[#F28C28] text-white font-semibold py-2 rounded-md hover:opacity-90 transition"
          >
            {loading ? 'Registering...' : 'Register'}
          </button>
        </div>
      </div>
    </div>
  )
}
