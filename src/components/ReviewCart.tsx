'use client'
import { ProfileJSON, Review, ReviewJSON } from "../../interfaces";
import { Session } from "next-auth";
import ReviewCard from "./ReviewCard";


export default function ReviewCart({ reviews, token,profile }: 
    { reviews:ReviewJSON , token:string  ,profile:ProfileJSON}) {
    
    const reviewsready= reviews
    const profileready= profile
    
    // console.log(reviewsready)
    // console.log(profileready)

    return (
        
        // <div className="flex flex-row h-[calc(100vh-75px)] p-2 overflow-y-hidden">
        
        <div className="flex flex-row w-[80vh] h-[calc(70vh-65px)] overflow-y-hidden">

            <div className="text-left">
                {(profileready.data.role === 'admin') ? (
                <div className="text-xl font-bold mb-4">All {reviewsready.count} Reviews in catalog</div>
                ) : (
                <div className="text-xl font-bold mb-4">{reviewsready.count} Reviews in your catalog</div>
                )}
            </div>
            {/* ซีกขวา */}
            <div className="w-full h-full flex flex-row overflow-x-auto " >
                {reviewsready.data.map((review: Review) => (
                    <div className="mx-3" key={review._id}>
                        <ReviewCard 
                            time={review.createdAt}
                            rating={review.reviewStar} 
                            description={review.reviewText} 
                            restaurant={review.restaurant.name}
                            profile={profileready}
                            reviewId={review._id??''}
                            token={token}
                            key={review._id}
                        />
                    </div>
                ))}
            </div>
        </div>

            

    );
}
