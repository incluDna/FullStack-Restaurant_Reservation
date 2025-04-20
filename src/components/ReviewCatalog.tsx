'use client'
import Link from "next/link";
import { Restaurant, Review } from "../../interfaces";
import ClientRating from "./ClientRating";

export default function ReviewCatalog({ reviews, meanReviews, page, restaurant, totalPages}:
  { reviews: Review[], meanReviews: number, restaurant:Restaurant, page?:number, totalPages:number}) {

  const review = reviews;
  const meanReviewsready = meanReviews;
  if(!page) page = 1;


  return (
    <div className="">
      <div className=" text-left font-bold text-xl ">Reviews Ratings {restaurant?.name || ''}</div>

      <div className="flex flex-row items-center justify-between border p-4 w-full bg-[#FFECAD] my-5 ">
        <div className=" flex flex-row text-left font-bold text-lg items-center">
          <div className="flex flex-row mr-5 text-3xl">
            {meanReviewsready}
            <div className="text-orange-500 ">/5.00</div>
          </div> 
                <ClientRating rating={Number(meanReviewsready)}/>
        </div>
        <div className=' text-right font-bold text-lg'>from {reviews.length} reviews</div>
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {
          review.map((review:Review)=>(
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

      {page>1?
        <div className="absolute left-5 bottom-5">
          <Link href={`/restaurants/${restaurant._id}/reviews?page=${page-1}`}>
            <button className="font-serif  bg-[#F89640] 
              hover:bg-green-600 px-4 py-2 text-white shadow-sm">
              « Previous
            </button>
          </Link>
        </div>
      :null}
      
      {page<totalPages?
        <div className="absolute right-5 bottom-5">
          <Link href={`/restaurants/${restaurant._id}/reviews?page=${page+1}`}>
            <button className="font-serif  bg-[#F89640] 
              hover:bg-green-600 px-4 py-2 text-white shadow-sm">
              Next »
            </button>
          </Link>
        </div>
      :null}
      
            
    </div>
  );
}
