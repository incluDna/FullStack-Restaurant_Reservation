"use client";

import React, { useEffect, useState } from "react";
import { getAuthCookie } from "@/libs/getAuthCookie";
import getUserProfile from "@/libs/getUserProfile";
import getReservations from "@/libs/getReservations";
import { Reservation, Review, User } from "../../../interfaces";
import updateUserProfile from "@/libs/updateUserProfile";
import ReservationCard from "@/components/ReservationCard";
import getReviews from "@/libs/getReviews";
import ReviewCard from "@/components/ReviewCard";
export default function ProfilePage() {
  const [user, setUser] = useState<User>({
    name: "",
    email: "",
    tel: "",
    password: "",
  });

  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [editing, setEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [token, setToken] = useState<string | null>(null);
  const [role, setRole] = useState<string | null>(null);
  const [formData, setFormData] = useState<User>(user);
  const [showReviews, setShowReviews] = useState(false);
  const [profile, setProfile] = useState<any>(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const { success, token: newToken, role, error, profile } = await getAuthCookie();
        if (!success) throw new Error(error || "Auth failed");

        setToken(newToken);
        setRole(role || null);
        setProfile(profile)

        const [userProfile, reservationJSON] = await Promise.all([getUserProfile(newToken), getReservations(newToken)]);
        setUser(userProfile.data);
        setReservations(reservationJSON.data);
        const userReview = await getReviews(newToken);
        setReview(userReview);
        const userProfile1 = await getUserProfile(newToken);
        setProfile(userProfile1);

      } catch (err) {
        console.error(err);
      }
    };


    fetchData();
    return () => {
      setLoading(false);
    };
  }, []);
  const [reviews, setReviews] = useState<Review[]>([]);
  useEffect(() => {
    const fetchData = async () => {
      try {
        const reviewsJSON = await getReviews(token!);
        setReviews(reviewsJSON.data);
        console.log(reviewsJSON)
      } catch (err) {
        console.error(err);
      }
    };

    fetchData();
  }, [token]);
  // console.log(reviews)

  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await updateUserProfile(token, formData);
      setUser(formData);
      alert("Profile updated successfully!");
      setEditing(false);
    } catch (err) {
      console.log(err);
      alert("Failed to update profile");
    }
  };


  return (
    <div className="h-[calc(100vh-65px)] overflow-hidden bg-gray-100 p-6 flex justify-center items-start">
      <div className="flex flex-row max-w-7xl w-full h-full gap-5 items-start">
        {/* Left Panel - Profile section */}
        <div className="flex flex-col justify-between bg-[#75c3cc] text-white p-6 rounded-xl w-[350px] h-full">
          {editing ? (
            <form onSubmit={handleUpdate} className="space-y-4">
              {["name", "email", "tel"].map((field) => (
                <div key={field}>
                  <label className="block text-sm font-medium text-gray-700 capitalize">
                    {field}
                  </label>
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
          ) : (
            <div className="flex flex-col items-center gap-6">
              <div className="text-[40px] font-semibold mb-4">
                - Your profile -
              </div>
              <div className="text-[33px]">Name: {user.name}</div>
              <div className="text-[23px]">Email: {user.email}</div>
              <div className="text-[24px]">Tel: {user.tel}</div>
              <button
                className="bg-[#f79540] text-white py-2 px-9 rounded-md hover:bg-[#6b1313]"
                onClick={() => {
                  setFormData(user);
                  setEditing(true);
                }}
              >
                Edit
              </button>
            </div>
          )}

          <div className="flex flex-col gap-4 mt-8 w-full">
            <button
              className="bg-white text-[#75c3cc] py-2 px-4 rounded-md hover:bg-[#41858d] hover:text-white"
              onClick={() => setShowReviews(false)}
            >
              Reservation
            </button>
            <button
              className="bg-white text-[#75c3cc] py-2 px-4 rounded-md hover:bg-[#41858d] hover:text-white"
              onClick={() => setShowReviews(true)}
            >
              Review
            </button>
          </div>
        </div>

        {/* Right Panel - Reservations or Reviews */}
        <div className="flex-1 bg-[#fff4ce] p-6 rounded-xl shadow-md w-full self-end py-8">
          <h2 className="text-3xl font-bold mb-4 text-gray-800">
            {role == "admin"
              ? showReviews
                ? "All user's Reviews"
                : "All user's Reservations"
              : showReviews
                ? "Your Reviews"
                : "Your Reservations"}
          </h2>

          {/* Conditional Rendering for Reservations or Reviews */}
          {showReviews ? (
            <div className="max-h-[30vh] overflow-y-auto p-4 space-y-4">
              {reviews.length !== 0 ? (
                <ul className="flex flex-wrap gap-5">
                  {reviews.map((rev, index) => (
                    <ReviewCard
                      key={rev._id || index}
                      time={rev.createdAt}
                      rating={rev.reviewStar}
                      description={rev.reviewText}
                      restaurant={rev.restaurant.name!}
                      profile={profile}
                      reviewId={rev._id!}
                    />
                  ))}
                </ul>
              ) : (
                <p className="text-gray-500">No reviews yet.</p>
              )}
            </div>

          ) : (
            <div className="max-h-[30vh] overflow-y-auto p-4">
              {reservations.length === 0 ? (
                <p className="text-gray-500">No reservations found.</p>
              ) : (
                <ul className="flex flex-wrap gap-5">
                  {reservations.map((res, index) => {
                    return (
                      <ReservationCard
                        key={res._id || index}
                        res={res}
                        index={index}
                        token={token ?? ""}
                        onUpdate={(idx, updated) => {
                          const updatedList = [...reservations];
                          updatedList[idx] = updated;
                          setReservations(updatedList);
                        }}
                        onDelete={(id) => {
                          setReservations((prev) =>
                            prev.filter((r) => r._id !== id)
                          );
                        }}
                      />
                    );
                  })}
                </ul>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
