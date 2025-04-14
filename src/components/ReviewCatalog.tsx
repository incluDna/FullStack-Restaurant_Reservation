
// import { Pattaya } from "next/font/google";
import {  Rating } from "@mui/material";
import { Review,MeanReview, ProfileJSON, RestaurantJSON, ReviewJSON } from "../../interfaces";
import ClientRating from "./ClientRating";
import Link from "next/link";

// const pattaya = Pattaya({ weight: "400", subsets: ["thai", "latin"] });
export default async function ReviewCatalog({reviews,restaurant,meanReviews,profile}:
    {reviews:Promise<ReviewJSON>,restaurant:Promise<RestaurantJSON>,
        meanReviews:Promise<MeanReview>,profile:Promise<ProfileJSON>}) {

    const reviewsready=await reviews
    const restaurantready=await restaurant
    const meanReviewsready=await meanReviews
    const profileready=await profile



  return (
    <div className="">
      {/* <h1 className={pattaya.className} style={{ fontSize: "48px" }}>{restaurantready.data.name} Restaurant Reviews</h1> */}

      <div className=" text-left font-bold text-xl ">Reviews Ratings</div>

      <div className="flex flex-row items-center justify-between border p-4 w-full bg-[#FFECAD] my-5 ">
        <div className=" flex flex-row text-left font-bold text-lg items-center">
          <div className="flex flex-row mr-5 text-3xl">
            {meanReviewsready.totalRating }
            <div className="text-orange-500 ">/5.00</div>
          </div> 
                <ClientRating rating={Number(meanReviewsready.totalRating)}/>
        </div>
        <div className=' text-right font-bold text-lg'>from {meanReviewsready.count} reviews</div>
      </div>
            
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {
          reviewsready.data.map((review:Review)=>(
          <div className="bg-[#FFECAD] p-4"
          key={review._id}>
            <div className='text-left'>User : {review.user}</div>
            <div className='text-left font-bold'>Star : {review.reviewStar}</div>
            <div className='text-left'>
              <ClientRating rating={Number(review.reviewStar)}/>
            </div>
            <div className='text-left'>Description : {review.reviewText}</div>
                  
          </div>
          ))
        }    
      </div>

      

            
    </div>
  );
}
