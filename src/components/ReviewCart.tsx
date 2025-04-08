import Link from "next/link";
import { ProfileJson, ReviewItem, ReviewJson } from "../../interfaces";
import { Session } from "next-auth";
import { Rating } from '@mui/material';
import ReviewCard from "./ReviewCard";


export default async function ReviewCart({ reviews, session,profile, restaurantid }: 
    { reviews:Promise<ReviewJson> , session:Session  ,profile:Promise<ProfileJson>, restaurantid:string}) {

    
    const reviewsready=await reviews
    const profileready=await profile
    const onDelete = (rid: string) => {
        alert('delete review')
    };

    return (
        <>
        <div className="flex flex-col min-h-screen">
  {/* Top Menu */}
  <div className="bg-yellow-100 flex justify-between items-center px-4 py-2">
    <div className="bg-orange-400 text-white px-4 py-2 rounded">logo</div>
    <div className="text-orange-400 font-semibold text-lg">waiting queue: x</div>
    <div className="bg-orange-400 text-white px-4 py-2 rounded">profile</div>
  </div>

  {/* Main Content (Sidebar + Main Area) */}
  <div className="flex flex-1">
    {/* Sidebar */}
    <div className="w-[250px] bg-[#75C4CD] text-white p-6 flex flex-col justify-between">
      <div>
        <h2 className="text-xl font-bold mb-4">your profile</h2>
        <p>username</p>
        <p>password</p>
        <p>phone-number</p>
        <button className="mt-4 bg-orange-400 text-white px-4 py-1 rounded">edit</button>
      </div>

      <div className="space-y-2 mt-10">
        <button className="w-full text-left bg-slate-400 text-white px-4 py-2 rounded">Reservation</button>
        <button className="w-full text-left bg-slate-500 text-white px-4 py-2 rounded">Review</button>
      </div>
    </div>

    {/* Main Area */}
    <div className="flex-1 bg-white p-6">
      <h1 className="text-2xl font-bold mb-4">Review <span className="text-left font-bold text-lg">All {reviewsready.count} Reviews in catalog</span></h1>
      <div className="grid grid-cols-3 gap-4">
        {/* กล่องรีวิว */}
        <div className="bg-yellow-100 rounded-xl shadow-md p-4">
          <div className="font-semibold text-lg">Restaurant name</div>
          <div className="text-sm mt-1">time</div>
          <div className="text-sm">star</div>
          <div className="text-sm mb-4">comment</div>
          <div className="">
                {reviewsready.data.map((review: ReviewItem) => (
                    <ReviewCard time="no time in database(be)" rating={parseInt(review.reviewStar)} 
                    description={review.reviewText} restaurunt="no restaurant name send(be)"
                    restaurantid={review.restaurant} profile={profileready}/>
                ))}
            </div>
          <div className="flex gap-2">
            <button href={`manage/add?id=${restaurantid}`} className="bg-orange-400 text-white px-4 py-1 rounded" key={restaurantid}>edit</button>
            <button className="bg-orange-400 text-white px-4 py-1 rounded">remove</button>
          </div>
        </div>
        {/* เพิ่มกล่องอื่น ๆ ได้เลยตาม map */}
      </div>
    </div>
  </div>
</div>

            {(profileready.data.role=='admin')?
                <div className="">
                    <div className="text-left font-bold text-xl">All {reviewsready.count} Reviews in catalog</div>
                </div>
            :
                <div className="">
                    <div className="text-left font-bold text-xl">{reviewsready.count} Reviews in your catalog</div>
                </div>
            }

            <div className="">
                {reviewsready.data.map((review: ReviewItem) => (
                    <ReviewCard time="no time in database(be)" rating={parseInt(review.reviewStar)} 
                    description={review.reviewText} restaurunt="no restaurant name send(be)"
                    restaurantid={review.restaurant} profile={profileready}/>
                ))}
            </div>
        </>
    );
}
