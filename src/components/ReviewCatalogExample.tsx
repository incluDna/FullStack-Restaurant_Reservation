'use client'
// import { Pattaya } from "next/font/google";
import { Rating } from "@mui/material";
import { ChevronRight, Star } from "lucide-react";
import { motion } from "framer-motion";
import { Review } from "../../interfaces";
import ClientRating from "./ClientRating";
import Link from "next/link";
import { useRouter, usePathname  } from "next/navigation";

// const pattaya = Pattaya({ weight: "400", subsets: ["thai", "latin"] });
export default function ReviewCatalogExample({ reviews, meanReviews }:
  { reviews: Review[], meanReviews: number }) {

  const reviewsready = reviews;
  const meanReviewsready = meanReviews;
  const router = useRouter();
  const pathName = usePathname();
  const handleClick = () => {
    router.push(`${pathName}/reviews`);
  };


  return (
    <div className="">
      {/* <h1 className={pattaya.className} style={{ fontSize: "48px" }}>{restaurantready.name} Restaurant Reviews</h1> */}

      <div className=" text-left font-bold text-3xl lg:text-4xl lg:text-center ">Reviews Ratings</div>

      <div className="flex flex-row items-center justify-between border p-4 w-full bg-[#FFECAD] my-5 ">
        <div className=" flex flex-row text-left font-bold text-lg items-center">
          <div className="flex flex-row mr-5 text-3xl">
            {meanReviewsready}
            <div className="text-orange-500 ">/5.00</div>
          </div>
          <ClientRating rating={Number(meanReviewsready)} />
        </div>
        <div className='text-right text-lg'>from {reviewsready.length} reviews</div>
      </div>

      <div className="font-inter font-semibold grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {
          reviewsready.slice(0, 5).map((review: Review) => (
            <div className="bg-[#FFECAD] p-4"
              key={review._id}>
              <div className='text-left'>User : {review.user.name}</div>
              <div className='text-left font-extrabold'>Star : {review.reviewStar}</div>
              <div className='text-left'>
                <ClientRating rating={Number(review.reviewStar)} />
              </div>
              <div className='text-left'>Description : {review.reviewText}</div>

            </div>
          ))
        }
      </div>

      {reviewsready.length > 5 && (
        <div className="col-span-full flex flex-row-reverse justify-start p-10 m-5">
          <motion.button
            onClick={handleClick}
            whileHover={{ backgroundColor: "#f79540", scale: 1.02 }}
            transition={{ duration: 0.3 }}
            className="flex items-center gap-2.5 px-6 py-2 bg-[#ffebac] hover:bg-[#ffebac]/90 text-black rounded-full"
          >
            <span className="font-medium text-xl sm:text-2xl">see more ..</span>
            <ChevronRight className="w-6 h-6 sm:w-[50px] sm:h-[50px]" />
          </motion.button>
        </div>
      )}


    </div>
  );
}
