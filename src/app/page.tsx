"use client";

import getBestReviewedRestaurant from "@/libs/getBestReviewedRestaurant";
import { motion, useInView } from "framer-motion";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Restaurant } from "../../interfaces";
import { Star } from "lucide-react";
import Skeleton from '@mui/material/Skeleton';
import getMeanReviews from "@/libs/getMeanReview";

export default function Home() {
  const router = useRouter();
  const [bestRestaurant, setBestRestaurant] = useState<Restaurant | null>(null);
  const [bestReview, setBestReview] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null); // state for handling errors
  const restaurantId = bestRestaurant?._id?.toString() || "";

  const renderStars = () => {
    return Array(5)
      .fill(0)
      .map((_, i) => (
        <Star
          key={i}
          className={`w-6 h-6 ${i < Math.round(bestReview!)
            ? "fill-[#f79540] text-[#f79540]"
            : "text-gray-300"
            }`}
        />
      ));
  };

  const seeInfo = () => {
    router.push(`/restaurants/${bestRestaurant?._id}`);
  };

  useEffect(() => {
    const fetchBestRestaurant = async () => {
      try {
        const response: Restaurant | null = await getBestReviewedRestaurant();
        if (response) {
          setBestRestaurant(response);
        } else {
          setError(
            "Sorry, we couldn't find the best restaurant at this moment."
          );
        }
      } catch (error) {
        console.error("Failed to fetch best restaurant:", error);
        setError(
          "There was an error fetching the best restaurant. Please try again later."
        );
      }
    };

    fetchBestRestaurant();
  }, []);

  useEffect(() => {
    const fetchBestReview = async () => {
      if (bestRestaurant) {
        try {
          const reviewResponse = await getMeanReviews(bestRestaurant._id);
          const review = reviewResponse.count == 0 ? null : reviewResponse.totalRating;
          console.log(`Fetched review for restaurant ${bestRestaurant._id}:`, review);
          setBestReview(review);
        } catch (err) {
          // If getMeanReviews fails, default to review = null
          setBestReview(null);
        }
      } else {
        setBestReview(null);
      }

      console.log("Best restaurant:", bestRestaurant);
    };
    fetchBestReview();

  }, [bestRestaurant]);

  return (
    <main className="flex flex-col items-center w-full relative bg-[#FAF9F6]">
      {/* Welcome */}
      <div className="flex flex-col w-full h-screen items-center justify-center">
        <h2 className="text-[50px]">Welcome to</h2>
        <h1 className="text-[150px] mb-10">
          <span className="text-[#F59C04]">S</span>
          <span className="text-[#1FA49F]">C</span>
          <span className="text-[#F59C04]">A</span>
          <span className="text-[#1FA49F]">M</span>
          <span className="text-[#F59C04]"> !</span>
        </h1>
        {/* #FF7B00 Old Button Hover Color */}
        <motion.button
          className="bg-[#F89640] text-white text-2xl px-[60px] py-5"
          whileHover={{ backgroundColor: "#5A2934", scale: 1.02 }}
          transition={{ duration: 0.3 }}
          onClick={() => router.push("/restaurants")}
        >
          Browse Restaurants
        </motion.button>
      </div>

      {/* Best Reviewed Restaurant */}
      <div className="flex flex-col w-full h-[80vh] bg-[#F89640] px-20 justify-center space-y-6 pb-3">

        <h1 className="text-white text-[60px] font-medium">
          Best Reviewed Restaurant
        </h1>

        <div className="flex flex-row w-full h-[55vh]">
          {bestRestaurant !== null ? (
            <div className="flex w-full h-full">
              {/* Image */}
              <div className="bg-[#3D3C3B] w-1/2 items-center justify-center flex">
                <img
                  src={bestRestaurant.picture}
                  className="h-full w-full object-cover"
                />
              </div>

              {/* Info */}
              <div className="bg-[#F9F9F9] w-1/2 px-8 py-8 space-y-3">
                <h2 className="font-medium text-[40px] leading-[47px] w-full text-[#333]">
                  {bestRestaurant.name}
                </h2>

                <div className="font-medium text-[24px] w-full text-[#555] space-y-1">
                  <div>
                    {bestRestaurant.address}, {bestRestaurant.district},{" "}
                    {bestRestaurant.province}
                  </div>
                  <div>
                    {bestRestaurant.openTime} - {bestRestaurant.closeTime}
                  </div>
                </div>

                {/* Rating */}
                <div className="flex items-center gap-2.5 px-4 py-3 bg-[#FFECAD] text-[#F89640] w-1/2">
                  <span className="font-medium text-[20px] leading-[35px]">
                    {bestReview === null
                      ? "No Reviews"
                      : bestReview}
                  </span>
                  {bestRestaurant.rating !== null && (
                    <span className="flex items-center">
                      {renderStars()}
                    </span>
                  )}
                </div>

                {/* Queue */}
                <div className="px-4 py-3 bg-[#FFECAD] text-[#F89640] w-1/2">
                  <span className="font-medium text-[20px] leading-[35px]">
                    Current queue: {bestRestaurant.queue || "0"}
                  </span>
                </div>

                {/* Button */}
                <div className="flex p-0 w-1/2">
                  <motion.button
                    className="w-full bg-[#F89640] text-white text-2xl px-8 py-3"
                    whileHover={{ backgroundColor: "#5A2934", scale: 1.02 }}
                    transition={{ duration: 0.3 }}
                    onClick={seeInfo}
                  >
                    <span className="font-medium text-[25px] leading-[35px]">
                      See information
                    </span>
                  </motion.button>
                </div>
              </div>
            </div>
          ) : (
            <div className="flex w-full h-full">
              {/* Skeleton Image */}
              <div className="w-1/2 bg-[#3D3C3B] flex items-center justify-center">
                <Skeleton variant="rectangular" width="100%" height="100%" />
              </div>

              {/* Skeleton Info */}
              <div className="w-1/2 bg-[#F9F9F9] px-8 py-8 space-y-4">
                {/* Restaurant Name */}
                <Skeleton variant="text" width="80%" height={50} />

                {/* Address */}
                <Skeleton variant="text" width="100%" height={30} />
                <Skeleton variant="text" width="70%" height={30} />

                {/* Rating */}
                <Skeleton variant="rectangular" width="50%" height={40} />

                {/* Queue */}
                <Skeleton variant="rectangular" width="50%" height={40} />

                {/* Button */}
                <Skeleton variant="rectangular" width="50%" height={50} />
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Who are we */}
      <div className="flex flex-row w-full h-[80vh]">
        <div className="h-full w-1/2 bg-[#75C4CD] flex flex-col px-20 py-2 flex items-center justify-center">
          <h1 className="text-white text-[80px] mb-2">Who are we ?</h1>
          <p className="text-white text-xl text-center">
            We are a website created to help you easily view and reserve
            restaurants. Allow you to use your time in something more useful
            than waiting.
          </p>
        </div>

        <div className="bg-[#3D3C3B] w-1/2 items-center justify-center flex overflow-hidden">
          <motion.img
            className="h-full object-cover"
            alt="Restaurant"
            src="/images/HomePage1.jpg"
            whileInView={{ opacity: 1 }}
            initial={{ opacity: 0.2 }}
            transition={{ duration: 0.7 }}
            viewport={{ amount: 0.6 }}
            whileHover={{ scale: 1.02, opacity: 1 }}
          />
        </div>
      </div>

      {/* What you can do */}
      <div className="flex flex-row w-full h-[80vh]">
        <div className="bg-[#3D3C3B] w-1/2 items-center justify-center flex overflow-hidden">
          <motion.img
            className="w-full h-full object-cover"
            alt="Restaurant"
            src="/images/HomePage2.jpg"
            whileInView={{ opacity: 1 }}
            initial={{ opacity: 0.2 }}
            transition={{ duration: 0.7 }}
            viewport={{ amount: 0.6 }}
            whileHover={{ scale: 1.02, opacity: 1 }}
          />
        </div>

        <div className="h-full w-1/2 bg-[#75C4CD] flex flex-col px-10 py-2 space-y-4 flex items-center justify-center">
          <h1 className="text-white text-[80px]">What you can do ?</h1>

          {/* Browse Restaurants (Add Link) */}
          <p className="text-white text-2xl">
            You can browse all reservations by clicking at
          </p>
          <motion.button
            className="bg-[#F89640] text-white text-2xl px-[60px] py-5 w-2/3"
            whileHover={{ backgroundColor: "#5A2934", scale: 1.02 }}
            onClick={() => router.push("/restaurants")}
            transition={{ duration: 0.3 }}
          >
            Browse Restaurants
          </motion.button>

          {/* Reserve / Queue (Add Link) */}
          <p className="text-white text-2xl">
            Then, select one and reserve or create queue
          </p>
          <div className="flex flex-row w-full h-fit space-x-4 items-center justify-center">
            <motion.button
              className="bg-[#F89640] text-white text-2xl px-[60px] py-5 w-fit"
              whileHover={{ backgroundColor: "#5A2934", scale: 1.02 }}
              transition={{ duration: 0.3 }}
            >
              Get In Line
            </motion.button>
            <p className="text-white text-2xl">or</p>
            <motion.button
              className="bg-[#F89640] text-white text-2xl px-[60px] py-5 w-fit"
              whileHover={{ backgroundColor: "#5A2934", scale: 1.02 }}
              transition={{ duration: 0.3 }}
            >
              Reserve
            </motion.button>
          </div>
        </div>
      </div>

      {/* Register */}
      <div className="flex flex-row w-full h-[80vh]">
        <div className="h-full w-1/2 bg-[#75C4CD] flex flex-col px-10 py-2 flex items-center justify-center space-y-4">
          <h1 className="text-white text-[70px]">Let's Get Started !</h1>
          <p className="text-white text-3xl mb-5">
            Click here to create your account !
          </p>
          <motion.button
            className="bg-[#F89640] text-white text-2xl px-[60px] py-5 w-fit"
            whileHover={{ backgroundColor: "#5A2934", scale: 1.02 }}
            transition={{ duration: 0.5 }}
          >
            Register
          </motion.button>
        </div>

        <div className="bg-[#3D3C3B] w-1/2 items-center justify-center flex overflow-hidden">
          <motion.img
            className="h-full w-full object-cover"
            alt="Restaurant"
            src="/images/HomePage3.jpg"
            whileInView={{ opacity: 1 }}
            initial={{ opacity: 0.2 }}
            transition={{ duration: 0.7 }}
            viewport={{ amount: 0.6 }}
            whileHover={{ scale: 1.02, opacity: 1 }}
          />
        </div>
      </div>

      {/* Bottom Image */}
      <div className="bg-[#3D3C3B] w-full h-[80vh] items-center justify-center flex">
        <motion.img
          className="w-[90vw] h-4/5 object-cover rounded-[90px] shadow-xl"
          alt="Restaurant"
          src="/images/HomePage4.jpg"
          whileInView={{ opacity: 1 }}
          initial={{ opacity: 0.2 }}
          transition={{ duration: 0.7 }}
          viewport={{ amount: 0.6 }}
          whileHover={{ scale: 1.02, opacity: 1 }}
        />
      </div>
    </main>
  );
}
