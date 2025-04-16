'use client'

import { useState } from 'react'
import userLogin from '@/libs/userLogin'
import getUserProfile from '@/libs/getUserProfile'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setSuccess(null)


    try {
      const res = await userLogin(email, password);

      if (!res.success || !('token' in res)) {
        throw new Error('Invalid email or password')
      }
      const token = res.token;
      const profile = await getUserProfile(token);
      if (profile.success && "data" in profile && "role" in profile.data) {
        // set cookie
        await fetch("/api/auth", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ token, role: profile.data.role }),
        });
      }
      else throw new Error('Something\'s gone wrong.');
      setSuccess('Login successful!')
      // Optional: Redirect after login
      // window.location.href = '/dashboard'
    } catch (err: any) {
      setError(err.message || 'Login failed')
      setTimeout(() => setError(null), 3000)
    }
  }

  return (
    <div className="flex items-center justify-center min-h-full bg-white px-4 font-sans">
      <div className="w-full max-w-md bg-white shadow-xl rounded-xl p-8 space-y-6">
        <div className="mb-6 text-center">
          <img
            src="/images/logo.jpg"
            alt="Your Logo"
            className="mx-auto h-20 w-20 rounded-full object-cover"
          />
        </div>

        <h2 className="text-2xl font-bold text-gray-900 text-center">
          Sign in to your account
        </h2>
        <p className="mt-2 text-sm text-center text-gray-600">
          Not a member?{' '}
          <a href="/register" className="font-medium text-[#63B6BB] hover:underline">
            Register
          </a>
        </p>

        {/* Feedback */}
        {error && <div className="mt-4 px-4 py-2 text-center bg-red-100 text-red-700 border border-red-400 rounded-md text-sm font-medium">{error}</div>}
        {success && <div className="mt-4 px-4 py-2 text-center bg-green-100 text-green-700 border border-green-400 rounded-md text-sm font-medium">{success}</div>}


        <form className="mt-8 space-y-5" onSubmit={handleSubmit}>
          <div>
            <label className="block text-sm font-medium text-gray-700">Email address</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-1 w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mt-1 w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
              required
            />
          </div>

          <button
            type="submit"
            className="w-full bg-[#F28C28] text-white font-semibold py-2 rounded-md hover:opacity-90 transition"
          >
            Sign in
          </button>
        </form>
      </div>
    </div>
  )
}
