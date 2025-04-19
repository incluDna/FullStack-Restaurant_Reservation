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

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const { success, token: newToken, role, error } = await getAuthCookie();
        if (!success) throw new Error(error || "Auth failed");
  
        setToken(newToken);
        setRole(role || null);
  
        // const [userProfile, reservationJSON] = await Promise.all([
        //   getUserProfile(newToken),
        //   getReservations(newToken),
        // ]);
        const userProfile = await getUserProfile(newToken);
        console.log(user.name);
        setUser(userProfile.data);
        // setReservations(reservationJSON.data);
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
        <div className="flex flex-col w-[1920px] h-[1080px] items-center relative">
          <div className="flex items-center self-stretch w-full relative flex-1 grow gap-[var(--size-space-0)]">
            <div className="inline-flex flex-col items-start justify-between pt-[var(--size-space-1200)] pb-[var(--size-space-1200)] px-0 relative self-stretch flex-[0_0_auto] bg-[#75c3cc]">
              <div className="inline-flex flex-col items-start gap-[var(--size-space-800)] pr-[var(--size-space-1200)] pl-[var(--size-space-1200)] py-0 relative flex-[0_0_auto]">
                <div className="flex flex-col justify-center items-center w-[299px] h-[263px] text-white">
                  <div className="text-[45px] font-medium leading-[77px] mb-2">
                    Your profile
                  </div>
                  <div className="text-[30px] font-medium leading-[56px] mb-1">
                    {user.name}
                  </div>
                  <div className="text-[30px] font-medium leading-[56px] mb-1">
                    {user.email}
                  </div>
                  <div className="text-[30px] font-medium leading-[56px]">
                    {user.tel}
                  </div>
                </div>

                <button className="!flex-[0_0_auto] !bg-[#f79540]">
                  edit
                </button>
              </div>

              <div className="flex flex-col items-start relative self-stretch w-full flex-[0_0_auto] gap-[var(--size-space-0)]">
                <button className="!self-stretch !w-full">Reservation</button>
                <button className="!self-stretch !w-full">Review</button>
              </div>
            </div>

          </div>
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
                    <p className="text-sm text-gray-500">{new Date(res.resDate).toDateString()} at {new Date(res.resDate).toTimeString().slice(0,5)}</p>
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
