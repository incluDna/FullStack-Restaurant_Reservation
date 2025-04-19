'use client';

import React, { useEffect, useState } from 'react';
import Cookies from 'js-cookie';

interface User {
  name: string;
  email: string;
  telephone: string;
}

interface Reservation {
  id: number;
  date: string;
  time: string;
  service: string;
  status: 'Confirmed' | 'Pending' | 'Cancelled';
}

export default function ProfilePage() {
  const [user, setUser] = useState<User>({
    name: '',
    email: '',
    telephone: '',
  });

  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [editing, setEditing] = useState(false);
  const [loading, setLoading] = useState(true);

  const token = Cookies.get('token');

  useEffect(() => {
    if (!token) {
      alert('Please log in first.');
      return;
    }

    const fetchProfile = async () => {
      try {
        const res = await fetch('/api/users/me', {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (res.status === 401) throw new Error('Unauthorized');
        const data = await res.json();
        setUser(data);
      } catch (err) {
        alert('Failed to load profile.');
      }
    };

    const fetchReservations = async () => {
      try {
        const res = await fetch('/api/reservations', {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        setReservations(data);
      } catch {
        alert('Failed to load reservations');
      }
    };

    Promise.all([fetchProfile(), fetchReservations()]).finally(() => setLoading(false));
  }, [token]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUser({ ...user, [e.target.name]: e.target.value });
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/users/me', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(user),
      });
      if (!res.ok) throw new Error('Update failed');
      alert('Profile updated successfully!');
      setEditing(false);
    } catch {
      alert('Failed to update profile');
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Profile Section */}
        <div className="bg-white p-6 rounded-xl shadow-md">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold text-gray-800">Profile Information</h2>
            {!editing && (
              <button
                className="text-sm text-blue-600 hover:underline"
                onClick={() => setEditing(true)}
              >
                Edit
              </button>
            )}
          </div>

          {editing ? (
            <form onSubmit={handleUpdate} className="space-y-4">
              {['name', 'email', 'telephone'].map((field) => (
                <div key={field}>
                  <label className="block text-sm font-medium text-gray-700 capitalize">{field}</label>
                  <input
                    type="text"
                    name={field}
                    value={(user as any)[field]}
                    onChange={handleChange}
                    className="mt-1 w-full border px-4 py-2 rounded-lg"
                    required
                  />
                </div>
              ))}
              <div className="flex gap-2">
                <button
                  type="submit"
                  className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                >
                  Save
                </button>
                <button
                  type="button"
                  className="bg-gray-300 text-gray-800 px-4 py-2 rounded"
                  onClick={() => setEditing(false)}
                >
                  Cancel
                </button>
              </div>
            </form>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div><label className="text-gray-500 text-sm">Name</label><p>{user.name}</p></div>
              <div><label className="text-gray-500 text-sm">Email</label><p>{user.email}</p></div>
              <div><label className="text-gray-500 text-sm">Phone</label><p>{user.telephone}</p></div>
            </div>
          )}
        </div>

        {/* Reservations Section */}
        <div className="bg-white p-6 rounded-xl shadow-md">
          <h2 className="text-xl font-bold mb-4 text-gray-800">Your Reservations</h2>
          {reservations.length === 0 ? (
            <p className="text-gray-500">No reservations found.</p>
          ) : (
            <ul className="divide-y divide-gray-200">
              {reservations.map((res) => (
                <li key={res.id} className="py-4 flex justify-between items-center">
                  <div>
                    <p className="text-gray-800 font-semibold">{res.service}</p>
                    <p className="text-sm text-gray-500">{res.date} at {res.time}</p>
                  </div>
                  <span
                    className={`text-sm font-medium px-3 py-1 rounded-full ${
                      res.status === 'Confirmed'
                        ? 'bg-green-100 text-green-700'
                        : res.status === 'Pending'
                        ? 'bg-yellow-100 text-yellow-700'
                        : 'bg-red-100 text-red-700'
                    }`}
                  >
                    {res.status}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}
