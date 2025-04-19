'use client';
import { motion } from "framer-motion";
import React, { useState, useEffect, Suspense } from "react";
import { useParams } from "next/navigation";
import getRestaurant from "@/libs/getRestaurant";
import getReviewForRestaurant from "@/libs/getReviewforRestaurant";
import getMeanReviews from "@/libs/getMeanReview";
import addReservation from "@/libs/addReservations";
import { MeanReview, RestaurantJSON, Review, ReviewJSON } from "../../../../interfaces";
import { LinearProgress } from "@mui/material";
import ReviewCatalogExample from "@/components/ReviewCatalogExample";
import { getAuthCookie } from "@/libs/getAuthCookie";
import { useRouter } from "next/navigation";
import getUserProfile from "@/libs/getUserProfile";
import editRestaurants from "@/libs/editRestaurant";

export default function RestaurantInfo() {
  const params = useParams();
  const rawId = params?.id;
  const id = Array.isArray(rawId) ? rawId[0] : rawId;

  const [restaurantData, setRestaurantData] = useState<any>(null);
  const [reviewData, setReviewData] = useState<Review[] | null>(null);
  const [meanReview, setMeanReview] = useState<number>(0);
  const [token, setToken] = useState<string | null>(null);
  const [role, setRole] = useState<string | null>(null);
  const [profile, setProfile] = useState<any>(null);
  const [isEditable, setIsEditable] = useState<boolean>(false); // Editable state

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

        setRestaurantData(restaurantResponse.data);
        setReviewData(reviewResponse.data);
        setMeanReview(meanReviewResponse.totalRating || 0);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    fetchData();
  }, [id]);

  const [numberOfPeople, setNumberOfPeople] = useState<number>(1);
  const [selectedDate, setSelectedDate] = useState<string>("");
  const [selectedTime, setSelectedTime] = useState<string>("");

  const [timeOptions, setTimeOptions] = useState<string[]>([]);
  useEffect(() => {
    const times: string[] = [];
    for (let hour = 8; hour <= 20; hour++) {
      const minutes = hour === 20 ? [0] : [0, 15, 30, 45];
      for (let minute of minutes) {
        const time = new Date();
        time.setHours(hour, minute, 0, 0);
        const timeString = time.toTimeString().slice(0, 5);
        times.push(timeString);
      }
    }
    setTimeOptions(times);
  }, []);

  const handleReservation = () => {
    if (!token) {
      alert("User is not authenticated");
      return;
    }

    if (!numberOfPeople || !selectedDate || !selectedTime) {
      alert("Please fill out all fields.");
      return;
    }
    const userId = profile?.data?._id;

    const reservationDateString = `${selectedDate}T${selectedTime}:00.000Z`;
    const reservationDate = new Date(reservationDateString);
    addReservation(token, reservationDate, userId, id!, numberOfPeople); // Use token here
  };

  const handleSave = async () => {
    try {
      // Prepare the updated fields
      const updatedFields = {
        name: restaurantData.name,
        picture: restaurantData.picture,
        address: restaurantData.address,
        district: restaurantData.district,
        province: restaurantData.province,
        postalCode: restaurantData.postalCode,
        tel: restaurantData.tel,
        region: restaurantData.region,
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

  if (!restaurantData || !reviewData) {
    return <div>Loading...</div>;
  }

  const totalReviews = reviewData.length;
  const router = useRouter();

  return (
    <main className="w-full bg-white">
      {/* Top Info */}
      <section className="flex flex-col lg:flex-row gap-4 p-4">
        <div className="flex w-full lg:w-[300px] h-[200px] items-center justify-center bg-[#3d3c3a]">
          {isEditable ? (
            <input
              type="text"
              value={restaurantData.picture}
              onChange={(e) => setRestaurantData({ ...restaurantData, picture: e.target.value })}
              className="w-full text-base text-black border-b-2 border-gray-300 focus:outline-none"
              placeholder="Enter image URL or base64 string"
            />
          ) : (
            <img className="w-full h-full object-cover" alt="restaurant" src={restaurantData.picture} />
          )}
        </div>

        <div className="flex flex-col gap-2 flex-1">
          <h1 className="font-semibold text-2xl lg:text-4xl text-black">
            {isEditable ? (
              <input
                type="text"
                value={restaurantData.name}
                onChange={(e) => setRestaurantData({ ...restaurantData, name: e.target.value })}
                className="w-full text-xl text-black border-b-2 border-gray-300 focus:outline-none"
              />
            ) : (
              restaurantData.name
            )}
          </h1>

          <div className="text-sm lg:text-base space-y-1 text-black">
            <div>
              {isEditable ? (
                <>
                  <input
                    type="text"
                    value={restaurantData.address}
                    onChange={(e) => setRestaurantData({ ...restaurantData, address: e.target.value })}
                    className="w-full text-base text-black border-b-2 border-gray-300 focus:outline-none"
                  />
                  <input
                    type="text"
                    value={restaurantData.district}
                    onChange={(e) => setRestaurantData({ ...restaurantData, district: e.target.value })}
                    className="w-full text-base text-black border-b-2 border-gray-300 focus:outline-none"
                  />
                </>
              ) : (
                `${restaurantData.address}, ${restaurantData.district}`
              )}
            </div>

            <div>
              {isEditable ? (
                <>
                  <input
                    type="text"
                    value={restaurantData.province}
                    onChange={(e) => setRestaurantData({ ...restaurantData, province: e.target.value })}
                    className="w-full text-base text-black border-b-2 border-gray-300 focus:outline-none"
                  />
                  <input
                    type="text"
                    value={restaurantData.postalCode}
                    onChange={(e) => setRestaurantData({ ...restaurantData, postalCode: e.target.value })}
                    className="w-full text-base text-black border-b-2 border-gray-300 focus:outline-none"
                  />
                  <input
                    type="text"
                    value={restaurantData.region}
                    onChange={(e) => setRestaurantData({ ...restaurantData, region: e.target.value })}
                    className="w-full text-base text-black border-b-2 border-gray-300 focus:outline-none"
                  />
                </>
              ) : (
                `${restaurantData.province} ${restaurantData.postalCode} ${restaurantData.region}`
              )}
            </div>

            <div>
              {isEditable ? (
                <input
                  type="text"
                  value={restaurantData.tel}
                  onChange={(e) => setRestaurantData({ ...restaurantData, tel: e.target.value })}
                  className="w-full text-base text-black border-b-2 border-gray-300 focus:outline-none"
                />
              ) : (
                restaurantData.tel
              )}
            </div>
          </div>
        </div>
      </section>



      {/* Edit button for Admin */}
      {
        profile?.data?.role === 'admin' && (
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
            {!isEditable && (
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
        )
      }
      {/* Reviews section */}
      <section className="flex flex-col gap-6 px-4 lg:px-12 pb-12">
        <h2 className="font-medium text-black text-[40px] sm:text-[70px] lg:text-[110px] mb-10">
          Reviews Ratings
        </h2>
        <Suspense fallback={<p>Loading ...<LinearProgress /></p>}>
          <ReviewCatalogExample reviews={reviewData} meanReviews={meanReview} />
        </Suspense>
      </section>
    </main >
  );
}
