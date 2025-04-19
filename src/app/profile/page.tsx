'use client';

import React, { useEffect, useState } from 'react';
import { getAuthCookie } from '@/libs/getAuthCookie';
import getUserProfile from '@/libs/getUserProfile';
import getReservations from '@/libs/getReservations';
import { Reservation } from '../../../interfaces';
import updateUserProfile from '@/libs/updateUserProfile';

interface User {
  name: string;
  email: string;
  tel: string;
}


export default function ProfilePage() {
  const [user, setUser] = useState<User>({
    name: '',
    email: '',
    tel: '',
  });

  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [editing, setEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [token, setToken] = useState<string | null>(null);
  const [role, setRole] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const { success, token: newToken, role, error } = await getAuthCookie();
        if (!success) throw new Error(error || "Auth failed");
  
        setToken(newToken);
        setRole(role || null);
  
        const [userProfile, reservationJSON] = await Promise.all([
          getUserProfile(newToken),
          getReservations(newToken),
        ]);
        console.log(user.name);
        setUser(userProfile.data);
        setReservations(reservationJSON.data);
      } catch (err) {
        console.error(err);
      }
    };
  
    fetchData();
    return () => {
      setLoading(false);
    };
  }, []);
  

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUser({ ...user, [e.target.name]: e.target.value });
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await updateUserProfile(token, user);
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
              {['name', 'email', 'tel'].map((field) => (
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
              <div><label className="text-gray-500 text-sm">Phone</label><p>{user.tel}</p></div>
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
                <li key={res._id} className="py-4 flex justify-between items-center">
                  <div>
                    <p className="text-gray-800 font-semibold">{res.restaurant.name}</p>
                    <p className="text-sm text-gray-500">{new Date(res.resDate).toLocaleDateString('en-US', { timeZone: 'UTC' })} at {new Date(res.resDate).toLocaleTimeString('no-nb', { timeZone: 'UTC' , hour:'2-digit', minute:'2-digit'})}</p>
                    <p className="text-sm text-gray-500">number of seats : {res.seatCount}</p>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}
