import Link from "next/link";
import { ProfileJson, ReviewItem, ReviewJson } from "../../interfaces";
import { Session } from "next-auth";
import { Rating } from '@mui/material';
import ReviewCard from "./ReviewCard";


export default async function ReviewCart({ reviews, session,profile }: 
    { reviews:Promise<ReviewJson> , session:Session  ,profile:Promise<ProfileJson>}) {

    
    const reviewsready=await reviews
    const profileready=await profile
    const onDelete = (rid: string) => {
        alert('delete review')
    };

    return (
        
        <div className="flex flex-row h-screen p-2 ">
            <div className="w-1/5 text-center h-full">
                <h1 className="text-3xl font-bold font-serif">Reviews</h1>
                {(profileready.data.role === 'admin') ? (
                <div className="text-xl font-bold mb-4">All {reviewsready.count} Reviews in catalog</div>
                ) : (
                <div className="text-xl font-bold mb-4">{reviewsready.count} Reviews in your catalog</div>
                )}
            </div>

            {/* ซีกขวา */}
            <div className="w-4/5 flex flex-row overflow-x-auto h-full">
                
                {reviewsready.data.map((review: ReviewItem) => (
                    <div className="mx-3">
                        <ReviewCard 
                            time="no time in database(be)" 
                            rating={parseInt(review.reviewStar)} 
                            description={review.reviewText} 
                            restaurant="no restaurant name send(be)"
                            restaurantid={review.restaurant} 
                            profile={profileready}
                            key={review.restaurant}
                        />
                    </div>
                ))}
            </div>
        </div>

            

    );
}
