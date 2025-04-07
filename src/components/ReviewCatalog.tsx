
import { Pattaya } from "next/font/google";
import Image from "next/image";
import { Link, Rating } from "@mui/material";
import { ReviewItem,MeanReviewItem, ProfileJson, RestaurantJson, ReviewJson,RestaurantItem,ProfileItem } from "../../interfaces";

const pattaya = Pattaya({ weight: "400", subsets: ["thai", "latin"] });
export default async function ReviewCatalog({reviews,restaurant,meanReviews,profile}:
    {reviews:Promise<ReviewJson>,restaurant:Promise<RestaurantJson>,
        meanReviews:Promise<MeanReviewItem>,profile:Promise<ProfileJson>}) {

    const reviewsready=await reviews
    const restaurantready=await restaurant
    const meanReviewsready=await meanReviews
    const profileready=await profile



  return (
    <div className="">
      
      
      <h1 className={pattaya.className} style={{ fontSize: "48px" }}>{restaurantready.data.name} Restaurant Reviews</h1>

            
            <div className="">
              Reviews Ratings
              <div>{meanReviewsready.totalRating }/5.00 </div><div>from {meanReviewsready.count} reviews</div>
              
              <div>
                        <Rating readOnly defaultValue={meanReviewsready.totalRating} />
                </div>
                
            </div>
            
            <div style={{ display:"flex",flexDirection:"row",
            flexWrap:"wrap",justifyContent:"space-around",
            alignContent:"space-around"}}>{
                reviewsready.data.map((review:ReviewItem)=>(
                <div className="">
                  <div>User:{review.user}</div>
                  <div>Star:{review.reviewStar}</div>
                  <div>
                        <Rating readOnly defaultValue={parseInt(review.reviewStar)}   />
                  </div>
                  <div >Description:{review.reviewText}</div>
                </div>
                ))
            }
            </div>
    </div>
  );
}
