'use client';

import MenuCard from '@/components/MenuCard';
import { motion } from "framer-motion";
import React, { useState, useEffect, Suspense } from "react";
import { useParams } from "next/navigation";
import getRestaurant from "@/libs/getRestaurant";
import getReviewForRestaurant from "@/libs/getReviewForRestaurant";
import getMeanReviews from "@/libs/getMeanReview";
import addReservation from "@/libs/addReservations";
import { MeanReview, Menu, MenuJSON, RestaurantJSON, Review, ReviewJSON } from "../../../../interfaces";
import { LinearProgress } from "@mui/material";
import ReviewCatalogExample from "@/components/ReviewCatalogExample";
import { getAuthCookie } from "@/libs/getAuthCookie";
import { useRouter } from "next/navigation";
import getUserProfile from "@/libs/getUserProfile";
import editRestaurants from "@/libs/editRestaurant";
import deleteRestaurant from "@/libs/deleteRestaurant";
import getMenus from '@/libs/getMenus';


const tabOptions = ['dish', 'drink', 'set'];

export default function RestaurantInfo() {
  const router = useRouter();
  const params = useParams();
  const rawId = params?.id;
  const id = Array.isArray(rawId) ? rawId[0] : rawId;

  const [restaurantData, setRestaurantData] = useState<any>(null);
  const [reviewData, setReviewData] = useState<Review[] | null>(null);
  const [meanReview, setMeanReview] = useState<number>(0);
  const [menuData, setMenuData] = useState<Menu[] | null>(null);
  const [filteredMenu, setFilteredMenu] = useState<Menu[] | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [role, setRole] = useState<string | null>(null);
  const [profile, setProfile] = useState<any>(null);
  const [isEditable, setIsEditable] = useState<boolean>(false);
  const [deletionSuccess, setDeletionSuccess] = useState<boolean>(false);
  const [reservationError, setReservationError] = useState<string | null>(null);
  const [reservationSuccess, setReservationSuccess] = useState<boolean>(false);

  const [activeTab, setActiveTab] = useState('dish');
  const isEmployee = role === 'admin' || role === 'employee';

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
  }, [id]);

  useEffect(() => {
    setFilteredMenu(menuData?.filter(item => item.type === activeTab) || null);
  }, [menuData, activeTab]);

  const [timeOptions, setTimeOptions] = useState<string[]>([]);
  useEffect(() => {
    if (!restaurantData?.openTime || !restaurantData?.closeTime) return;

    const times: string[] = [];
    const [openHour, openMinute] = restaurantData.openTime.split(":").map(Number);
    const [closeHour, closeMinute] = restaurantData.closeTime.split(":").map(Number);

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

  return (
    <main className="max-w-6xl mx-auto px-4 pt-20">
      <h1 className="text-3xl font-bold mb-8 text-center">Menu</h1>
      <section className="flex flex-col gap-6 px-4 lg:px-20 pb-12">
        {/* Tabs */}
        <div className="flex justify-center mb-8 gap-4">
          {tabOptions.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-6 py-2 border-b-4 text-lg ${activeTab === tab
                ? 'border-[#F89640] text-[#F89640]'
                : 'border-transparent text-gray-500'
                }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {filteredMenu?.map((item, i) => (
            <MenuCard
              key={i}
              id={i.toString()}
              name={item.name}
              price={item.price}
              description={item.description}
              image={item.picture}
              isEmployee={isEmployee}
              onEdit={() => console.log('Edit:', item.name)}
              onDelete={() => console.log('Delete:', item.name)}
            />
          ))}
        </div>
      </section>
    </main>
  );
}
