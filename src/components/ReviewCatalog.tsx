
// import { Pattaya } from "next/font/google";
import { Link, Rating } from "@mui/material";
import { ReviewItem,MeanReviewItem, ProfileJson, RestaurantJson, ReviewJson,RestaurantItem,ProfileItem } from "../../interfaces";

// const pattaya = Pattaya({ weight: "400", subsets: ["thai", "latin"] });
export default async function ReviewCatalog({reviews,restaurant,meanReviews,profile}:
    {reviews:Promise<ReviewJson>,restaurant:Promise<RestaurantJson>,
        meanReviews:Promise<MeanReviewItem>,profile:Promise<ProfileJson>}) {

    const reviewsready=await reviews
    const restaurantready=await restaurant
    const meanReviewsready=await meanReviews
    const profileready=await profile



  return (
    <div className="">
      
      
      {/* <h1 className={pattaya.className} style={{ fontSize: "48px" }}>{restaurantready.data.name} Restaurant Reviews</h1> */}

            
      <div className=" text-left font-bold text-xl">Reviews Ratings</div>
            <div className="flex flex-row justify-between border p-4 w-full bg-[#FFECAD]">
              <div className=" text-left font-bold text-lg">{meanReviewsready.totalRating }<span className="text-orange-500">/5.00</span> <Rating readOnly defaultValue={meanReviewsready.totalRating} /></div>
              <div className=' text-right font-bold text-lg'>from {meanReviewsready.count} reviews</div>
            </div>
            
            <div style={{ display:"flex",flexDirection:"row",
            flexWrap:"wrap",justifyContent:"space-around",
            alignContent:"space-around"}}>{
                reviewsready.data.map((review:ReviewItem)=>(
                <div className="bg-[#FFECAD] rounded-xl shadow-md p-4">
                  <div className='text-left'>User:{review.user}</div>
                  <div className='text-left'>Star:{review.reviewStar}</div>
                  <div className='text-left'>
                        <Rating readOnly defaultValue={parseInt(review.reviewStar)}   />
                  </div>
                  <div className='text-left'>Comment: {review.reviewText}</div>
                  <a href="#" className="fixed bottom-4 right-4 inline-flex items-center gap-2 px-5 py-2 bg-yellow-100 text-black font-medium rounded-full shadow hover:shadow-lg transition">
                see more ..
                <span className="text-xl">➤</span></a>
                </div>
               
              
                ))
            }
            </div>
    </div>
  );
}
