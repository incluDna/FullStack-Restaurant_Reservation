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
        <>
            {(profileready.data.role=='admin')?
                <div className="">
                    <div className="">All {reviewsready.count} Reviews in catalog</div>
                </div>
            :
                <div className="">
                    <div className="">{reviewsready.count} Reviews in your catalog</div>
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
