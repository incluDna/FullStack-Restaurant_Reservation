'use client';

import React, { useState, useEffect } from 'react';
import Cookies from 'js-cookie';

export default function ProfilePage() {
  const [formData, setFormData] = useState({
    name: '',
    telephone: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Optional: fetch current user info on page load
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = Cookies.get('token');
        const res = await fetch('/api/users/me', {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });

        if (res.status === 401) {
          alert('Session expired. Please log in again.');
          return;
        }

        const data = await res.json();
        setFormData({
          name: data.name || '',
          telephone: data.telephone || '',
        });
      } catch (err) {
        console.error('Failed to load profile:', err);
      }
    };

    fetchProfile();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const token = Cookies.get('token');
      const response = await fetch('/api/users/me', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          name: formData.name,
          telephone: formData.telephone,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();

        if (response.status === 401) {
          alert('Invalid credentials. Please log in again.');
        } else {
          throw new Error(errorData.message || 'Failed to update profile');
        }

        return;
      }

      const result = await response.json();
      alert('Profile updated successfully!');
      console.log('Updated profile:', result);
    } catch (error: any) {
      console.error('Update error:', error);
      alert(error.message || 'Something went wrong');
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <div className="bg-white p-8 rounded-xl shadow-md w-full max-w-md">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">Edit Profile</h2>
        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Name */}
          <div>
            <label className="block mb-1 text-sm font-medium text-gray-700">Name</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="w-full border px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="John Doe"
              required
            />
          </div>

          {/* Telephone */}
          <div>
            <label className="block mb-1 text-sm font-medium text-gray-700">Telephone</label>
            <input
              type="tel"
              name="telephone"
              value={formData.telephone}
              onChange={handleChange}
              className="w-full border px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="+66 812345678"
              required
            />
          </div>

          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition"
          >
            Save Changes
          </button>
        </form>
      </div>
    </div>
  );
}
