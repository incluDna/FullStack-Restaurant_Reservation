"use client";

import { motion } from "framer-motion";
import React, { useState, useEffect, Suspense } from "react";
import { useParams } from "next/navigation";
import getRestaurant from "@/libs/Restaurant/getRestaurant";
import getReviewForRestaurant from "@/libs/Review/getReviewForRestaurant";
import getMeanReviews from "@/libs/Review/getMeanReview";
import addReservation from "@/libs/Reservation/addReservations";
import {
  MeanReview,
  Menu,
  MenuJSON,
  RestaurantJSON,
  Review,
  ReviewJSON,
} from "../../../../interfaces";
import { LinearProgress } from "@mui/material";
import ReviewCatalogExample from "@/components/ReviewCatalogExample";
import { getAuthCookie } from "@/libs/User/getAuthCookie";
import { useRouter } from "next/navigation";
import getUserProfile from "@/libs/User/getUserProfile";
import editRestaurants from "@/libs/Restaurant/editRestaurant";
import deleteRestaurant from "@/libs/Restaurant/deleteRestaurant";
import getMenus from "@/libs/Menu/getMenus";
import TopInfo from "@/components/TopInfo";
import QueueCard from "@/components/QueueCard";
import ReservationCardInPageID from "@/components/ReservationCardInPageID";
import MenuSection from "@/components/MenuSection";
const tabOptions = ["dish", "drink", "set"];
import { useNotice } from "@/components/NoticeContext";

export default function RestaurantInfo() {
  const router = useRouter();
  const params = useParams();
  const rawId = params?.id;
  const id = Array.isArray(rawId) ? rawId[0] : rawId;

  const [restaurantData, setRestaurantData] = useState<any>(null);
  const [reviewData, setReviewData] = useState<Review[] | null>(null);
  const [meanReview, setMeanReview] = useState<number>(0);
  const [menuData, setMenuData] = useState<Menu[] | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [role, setRole] = useState<string | null>(null);
  const [profile, setProfile] = useState<any>(null);
  const [isEditable, setIsEditable] = useState<boolean>(false);
  const [deletionSuccess, setDeletionSuccess] = useState<boolean>(false);
  const [timeOptions, setTimeOptions] = useState<string[]>([]);
  const { showNotice } = useNotice();

  useEffect(() => {
    async function fetchToken() {
      try {
        const data = await getAuthCookie();
        if (data.success) {
          setToken(data.token);
          setRole(data.role || null);
          const userProfile = await getUserProfile(data.token);
          setProfile(userProfile);
        } else {
          console.error("Auth error:", data.error);
        }
      } catch (err) {
        console.error("Failed to fetch auth cookie", err);
      }
    }

    fetchToken();
  }, []);

  useEffect(() => {
    if (!id) return;
    const fetchData = async () => {
      try {
        const restaurantResponse: RestaurantJSON = await getRestaurant(id);
        const reviewResponse: ReviewJSON = await getReviewForRestaurant(id);
        const meanReviewResponse: MeanReview = await getMeanReviews(id);
        const menuResponse: MenuJSON = await getMenus(id);
        setMenuData(menuResponse.data);
        setRestaurantData(restaurantResponse.data);
        setReviewData(reviewResponse.data);
        setMeanReview(meanReviewResponse.totalRating || 0);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    fetchData();
  }, [id, isEditable]);

  useEffect(() => {
    if (!restaurantData?.openTime || !restaurantData?.closeTime) return;

    const times: string[] = [];
    const [openHour, openMinute] = restaurantData.openTime
      .split(":")
      .map(Number);
    const [closeHour, closeMinute] = restaurantData.closeTime
      .split(":")
      .map(Number);

    const openDate = new Date();
    openDate.setHours(openHour, openMinute, 0, 0);

    const closeDate = new Date();
    closeDate.setHours(closeHour, closeMinute, 0, 0);

    const current = new Date(openDate);

    while (current <= closeDate) {
      times.push(current.toTimeString().slice(0, 5));
      current.setMinutes(current.getMinutes() + 15);
    }

    setTimeOptions(times);
  }, [restaurantData]);

  const handleSave = async () => {
    try {
      const updatedFields = {
        name: restaurantData.name,
        picture: restaurantData.picture,
        address: restaurantData.address,
        district: restaurantData.district,
        province: restaurantData.province,
        postalCode: restaurantData.postalCode,
        tel: restaurantData.tel,
        region: restaurantData.region,
        openTime: restaurantData.openTime,
        closeTime: restaurantData.closeTime
      };

      if (!id || !token) {
        console.error("Missing restaurant ID or authentication token");
        return;
      }

      await editRestaurants(token, id, updatedFields);

      const restaurantResponse: RestaurantJSON = await getRestaurant(id);
      setRestaurantData(restaurantResponse.data);
      setIsEditable(false);
    } catch (error) {
      console.error("Error saving restaurant data:", error);
    }
  };

  const handleDelete = async () => {
    if (!id || !token) {
      console.error("Missing restaurant ID or authentication token");
      return;
    }

    try {
      const response = await deleteRestaurant(id, token);

      if (response.status==204) {
        showNotice("Restaurant deleted successfully", true);
        setDeletionSuccess(true);
        router.push("/restaurants");
      }
    } catch (error) {
      console.error("Error deleting restaurant:", error);
    }
  };
  if (!restaurantData || !reviewData) {
    return <div>Loading...</div>;
  }

  const totalReviews = reviewData.length;
  
  return (
    <main className="w-full bg-white">
      {/* Top Info */}
      <TopInfo
        restaurantData={restaurantData}
        isEditable={isEditable}
        setRestaurantData={setRestaurantData}
      ></TopInfo>
      <div className="lg:px-20">
        {/* Success Message for Deletion */}
        {deletionSuccess && (
          <div className="p-4 text-green-500 font-bold text-xl">
            Deletion successful! Redirecting...
          </div>
        )}

        {profile?.data?.role === "user" && (
          <section className="flex flex-col lg:flex-row gap-4 p-10">
            <QueueCard id={id!} currentQueue={restaurantData.queue} thisRestaurant={restaurantData}/>           
            <ReservationCardInPageID
              restaurantData={restaurantData}
              token={token}
              profile={profile}
            />

          </section>
        )}
        {/* Edit button for Admin & Employee */}
        {(profile?.data?.role === "admin" ||
          (profile?.data?.role === "employee" &&
            id === profile?.data?.employedAt)) && (
            <div className="flex justify-end items-center gap-4 p-8 mr-8">
              {/* Larger Manage Reservation Button */}
              <motion.button
                whileHover={{ backgroundColor: "#5A2934", scale: 1.02 }}
                transition={{ duration: 0.3 }}
                className="w-fit px-12 h-16 text-2xl font-bold bg-[#f79540] text-white rounded"
                onClick={() => router.push(`/restaurants/${id}/management`)}
              >
                Manage Reservation
              </motion.button>
              {/* Show Edit and Delete buttons only when not in edit mode */}
              {profile?.data?.role === "admin" && !isEditable &&
                (
                  <>
                    <motion.button
                      whileHover={{ backgroundColor: "black", scale: 1.02 }}
                      transition={{ duration: 0.3 }}
                      onClick={() => setIsEditable(true)}
                      className="w-[65px] h-[65px] bg-[#3d3c3a] text-white text-xl border-0 rounded-none"
                    >
                      Edit
                    </motion.button>
                    <motion.button
                      whileHover={{ backgroundColor: "black", scale: 1.02 }}
                      transition={{ duration: 0.3 }}
                      onClick={handleDelete}
                      className="w-[65px] h-[65px] bg-[#3d3c3a] text-white text-xl border-0 rounded-none"
                    >
                      Delete
                    </motion.button>
                  </>
                )}

              {/* Show Save and Cancel buttons only when in edit mode */}
              {isEditable && (
                <>
                  <motion.button
                    whileHover={{ backgroundColor: "#5A2934", scale: 1.02 }}
                    transition={{ duration: 0.3 }}
                    onClick={handleSave}
                    className="w-fit px-12 h-16 text-2xl font-bold bg-[#f79540] text-white rounded"
                  >
                    Save
                  </motion.button>

                  <motion.button
                    whileHover={{ backgroundColor: "#5A2934", scale: 1.02 }}
                    transition={{ duration: 0.3 }}
                    onClick={() => setIsEditable(false)} // Deactivate edit mode
                    className="w-fit px-12 h-16 text-2xl font-bold bg-[#f79540] text-white rounded"
                  >
                    Cancel
                  </motion.button>
                </>
              )}
            </div>
          )}


        <MenuSection
          id={restaurantData._id}
          token={token}
          profile={profile}
          menuData={menuData}
        />

        {/* Reviews section */}
        <section className="flex flex-col gap-6 px-4 lg:px-20 pb-12">
          <Suspense
            fallback={
              <p>
                Loading ...
                <LinearProgress />
              </p>
            }
          >
            <ReviewCatalogExample
              reviews={reviewData}
              meanReviews={meanReview}
            />
          </Suspense>
        </section>
      </div>
    </main>
  );
}
