'use client';

import React, { useEffect, useState } from 'react';
import { getAuthCookie } from '@/libs/getAuthCookie';
import getUserProfile from '@/libs/getUserProfile';
import getReservations from '@/libs/getReservations';
import { Reservation, User } from '../../../interfaces';
import updateUserProfile from '@/libs/updateUserProfile';



export default function ProfilePage() {
  const [user, setUser] = useState<User>({
    name: '',
    email: '',
    tel: '',
    password: ''
  });

  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [editing, setEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [token, setToken] = useState<string | null>(null);
  const [role, setRole] = useState<string | null>(null);
  const [formData, setFormData] = useState<User>(user);


  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const { success, token: newToken, role, error } = await getAuthCookie();
        if (!success) throw new Error(error || "Auth failed");
  
        setToken(newToken);
        setRole(role || null);
        
        // const [userProfile, reservationJSON] = await Promise.all([   <-- Uncomment when doing reservation 
        //   getUserProfile(newToken),
        //   getReservations(newToken),
        // ]);
        const userProfile = await getUserProfile(newToken);
        console.log(user.name);
        setUser(userProfile.data);
        // setReservations(reservationJSON.data);  <-- Uncomment when doing reservation
      } catch (err) {
        console.error(err);
      }
    };
  
    fetchData();
    return () => {
      setLoading(false);
    };
  }, []);
  

  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await updateUserProfile(token, formData);
      setUser(formData)
      alert('Profile updated successfully!');
      setEditing(false);
    } catch(err) {
      console.log(err);
      alert('Failed to update profile');
    }
  };

  
  return (
    <div className="h-screen overflow-hidden bg-gray-100 p-6 flex justify-center items-start">
      <div className="flex flex-row max-w-7xl w-full h-full gap-5 items-start">
        
        {/* Left Panel - Profile section */}
        <div className="flex flex-col justify-between bg-[#75c3cc] text-white p-6 rounded-xl w-[350px] h-full">
          {
            editing? (
              <form onSubmit={handleUpdate} className="space-y-4">
                {['name', 'email', 'tel'].map((field) => (
                  <div key={field}>
                    <label className="block text-sm font-medium text-gray-700 capitalize">{field}</label>
                    <input
                      type="text"
                      name={field}
                      value={(formData as any)[field]}
                      onChange={handleFormChange}
                      className="mt-1 w-full border px-4 py-2 rounded-lg text-black"
                      required
                    />
                  </div>
                ))}
                <div className="flex gap-2">
                  <button
                    type="submit"
                    className="bg-[#f79540] text-white px-4 py-2 rounded hover:bg-blue-700"
                  >
                    Save
                  </button>
                  <button
                    type="button"
                    className="bg-gray-300 text-gray-800 px-4 py-2 rounded hover:bg-gray-800 hover:text-gray-300"
                    onClick={() => setEditing(false)}
                  >
                    Cancel
                  </button>
                </div>
              </form>
            ) : 
            (
              <div className="flex flex-col items-center gap-6">
                <div className="text-[40px] font-semibold mb-4">- Your profile -</div>
                  <div className="text-[33px]">Name: {user.name}</div>
                  <div className="text-[23px]">Email: {user.email}</div>
                  <div className="text-[24px]">Tel: {user.tel}</div>
                  <button 
                  className="bg-[#f79540] text-white py-2 px-9 rounded-md hover:bg-[#6b1313]"
                  onClick={() => {setFormData(user); setEditing(true);}}>
                    Edit
                  </button>
              </div>    
            )
          }
        
  
          <div className="flex flex-col gap-4 mt-8 w-full">
            <button className="bg-white text-[#75c3cc] py-2 px-4 rounded-md hover:bg-[#41858d] hover:text-white">Reservation</button>
            <button className="bg-white text-[#75c3cc] py-2 px-4 rounded-md hover:bg-[#41858d] hover:text-white">Review</button>
          </div>
        </div>
  
        {/* Right Panel - Reservations */}
        <div className="flex-1 bg-[#fff4ce] p-6 rounded-xl shadow-md w-full self-end h-1/2">
          <h2 className="text-xl font-bold mb-4 text-gray-800"> {role=='admin'?'All user\'s Reservations':'Your Reservations'}</h2>
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
