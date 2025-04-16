'use client';
import { motion } from "framer-motion";
import { ChevronRight, Star } from "lucide-react";
import React, { useState, useEffect, Suspense } from "react";
import { useParams } from "next/navigation";
import getRestaurant from "@/libs/getRestaurant";
import getReviewForRestaurant from "@/libs/getReviewforRestaurant";
import getMeanReviews from "@/libs/getMeanReview";
import addReservation from "@/libs/addReservations";
import { MeanReview, RestaurantJSON, Review, ReviewJSON } from "../../../../interfaces";
import { LinearProgress } from "@mui/material";
import ReviewCatalogExample from "@/components/ReviewCatalogExample";
export default function RestaurantInfo() {
  const token = 'your-temporary-token-here';
  const params = useParams();
  const rawId = params?.id;
  const id = Array.isArray(rawId) ? rawId[0] : rawId;

  const [restaurantData, setRestaurantData] = useState<any>(null);
  const [reviewData, setReviewData] = useState<Review[] | null>(null);
  const [meanReview, setMeanReview] = useState<number>(0);

  useEffect(() => {
    if (!id) return;
    const fetchData = async () => {
      try {
        const restaurantResponse: RestaurantJSON = await getRestaurant(id);
        const reviewResponse: ReviewJSON = await getReviewForRestaurant(id);
        const meanReviewResponse: MeanReview = await getMeanReviews(id);

        setRestaurantData(restaurantResponse.data);
        setReviewData(reviewResponse.data);
        console.log(reviewResponse.count);
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
    const times = [];
    for (let hour = 0; hour < 24; hour++) {
      for (let minute of [0, 15, 30, 45]) {
        const time = new Date();
        time.setHours(hour);
        time.setMinutes(minute);
        const timeString = time.toTimeString().slice(0, 5);
        times.push(timeString);
      }
    }
    setTimeOptions(times);
  }, []);

  const handleReservation = () => {
    if (!numberOfPeople || !selectedDate || !selectedTime) {
      alert("Please fill out all fields.");
      return;
    }
    const reservationDateString = `${selectedDate}T${selectedTime}:00.000Z`;
    const reservationDate = new Date(reservationDateString);
    addReservation(token, reservationDate, "67f68d4467b964edd5467128", id!, numberOfPeople);
  };


  if (!restaurantData || !reviewData) {
    return <div>Loading...</div>;
  }


  const totalReviews = reviewData.length;

  return (
    <main className="w-full bg-white">
      {/* Top Info */}
      <section className="flex flex-col lg:flex-row gap-4 p-4">
        <div className="flex w-full lg:w-[300px] h-[200px] items-center justify-center bg-[#3d3c3a]">
          <img className="w-full h-full object-cover" alt="restaurant" src={restaurantData.picture} />
        </div>

        <div className="flex flex-col gap-2 flex-1">
          <h1 className="font-semibold text-2xl lg:text-4xl text-black">{restaurantData.name}</h1>
          <div className="text-sm lg:text-base space-y-1 text-black">
            <div>{restaurantData.address}, {restaurantData.district}</div>
            <div>{restaurantData.province} {restaurantData.postalCode} {restaurantData.region}</div>
            <div>{restaurantData.tel}</div>
            <div>{restaurantData.openTime} - {restaurantData.closeTime}</div>
          </div>
        </div>
      </section>

      <section className="flex flex-col lg:flex-row gap-4 p-4">
        {/* Queue */}
        <div className="flex-1 bg-[#ffebac] p-6 flex flex-col justify-center">
          <h2 className="text-2xl font-bold text-center text-black mb-6">Get Queue</h2>
          <div className="flex flex-col items-center justify-center flex-grow gap-4">
            <label className="text-lg text-black">How many people?</label>
            <input type="number" className="w-24 h-10 text-base p-2 bg-white border" />
          </div>
          <motion.button
            whileHover={{ backgroundColor: "#5A2934", scale: 1.02 }}
            transition={{ duration: 0.3 }}
            className="w-full h-10 bg-[#f79540] text-white text-lg mt-6"
          >
            Get in Line
          </motion.button>
        </div>

        {/* Reservation */}
        <div className="flex-1 bg-[#ffebac] p-6 flex flex-col justify-between">
          <div className="flex flex-col flex-1 justify-center">
            <div className="grid grid-cols-1 place-items-center gap-4">
              <h2 className="text-2xl font-bold text-black">Reserve Table</h2>
              <div className="flex flex-col items-center gap-2">
                <label className="text-lg text-black">How many people?</label>
                <input
                  type="number"
                  value={numberOfPeople}
                  onChange={(e) => setNumberOfPeople(Number(e.target.value))}
                  className="w-24 h-10 p-2 bg-white border"
                />
              </div>
              <div className="flex flex-col items-center gap-2">
                <label className="text-lg text-black">Select Date & Time</label>
                <input
                  type="date"
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                  className="w-40 h-10 p-2 bg-white border"
                />
                <select
                  value={selectedTime}
                  onChange={(e) => setSelectedTime(e.target.value)}
                  className="w-40 h-10 p-2 bg-white border"
                >
                  {timeOptions.map((time) => (
                    <option key={time} value={time}>
                      {time}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>
          <motion.button
            whileHover={{ backgroundColor: "#5A2934", scale: 1.02 }}
            transition={{ duration: 0.3 }}
            onClick={handleReservation}
            className="w-full h-10 mt-8 bg-[#f79540] text-white text-lg"
          >
            Reserve
          </motion.button>
        </div>
      </section>


      {/* Reviews section */}
      <section className="flex flex-col gap-6 px-4 lg:px-12 pb-12">
        <h2 className="font-medium text-black text-[40px] sm:text-[70px] lg:text-[110px] mb-10">
          Reviews Ratings
        </h2>
        <Suspense fallback={<p>Loading ...<LinearProgress /></p>}>
          <ReviewCatalogExample reviews={reviewData} meanReviews={meanReview} />
        </Suspense>

      </section>
    </main>
  );
}
