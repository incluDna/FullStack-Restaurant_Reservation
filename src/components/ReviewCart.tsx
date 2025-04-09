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
        
        <div className="flex px-6 gap-6">
  {/* ซีกซ้าย */}
  <div className="w-1/4">
    <h1 className="text-3xl font-bold font-serif">Reviews</h1>
  </div>

  {/* ซีกขวา */}
  <div className="w-3/4">
    {(profileready.data.role === 'admin') ? (
      <div className="text-xl font-bold mb-4">All {reviewsready.count} Reviews in catalog</div>
    ) : (
      <div className="text-xl font-bold mb-4">{reviewsready.count} Reviews in your catalog</div>
    )}

    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
      {reviewsready.data.map((review: ReviewItem) => (
        <div key={review._id} className="bg-[#FFECAD] rounded-xl shadow-md p-4">
          <ReviewCard 
            time="no time in database(be)" 
            rating={parseInt(review.reviewStar)} 
            description={review.reviewText} 
            restaurant="no restaurant name send(be)"
            restaurantid={review.restaurant} 
            profile={profileready}
          />
          <div className="flex gap-2 mt-2">
            <a href={`manage/add?id=${review.restaurant}`} className="bg-orange-400 text-white px-4 py-1 rounded">edit</a>
            <button className="bg-orange-400 text-white px-4 py-1 rounded">remove</button>
          </div>
        </div>
      ))}
    </div>
  </div>
</div>

        
        {/* เพิ่มกล่องอื่น ๆ ได้เลยตาม map */}
    

           
        </>
    );
}
