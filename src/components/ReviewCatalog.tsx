
import { Pattaya } from "next/font/google";
import Image from "next/image";
import { Link, Rating } from "@mui/material";
import { ReviewItem,MeanReviewItem, ProfileJson, RestaurantJson, ReviewJson,RestaurantItem,ProfileItem } from "../../interfaces";

const pattaya = Pattaya({ weight: "400", subsets: ["thai", "latin"] });
export default async function ReviewCatalogue({reviews,restaurant,meanReviews,profile}:
    {reviews:Promise<ReviewJson>,restaurant:Promise<RestaurantJson>,
        meanReviews:Promise<MeanReviewItem>,profile:Promise<ProfileJson>}) {

    const reviewsready=await reviews
    const restaurantready=await restaurant
    const meanReviewsready=await meanReviews
    const profileready=await profile



  return (
    <div className="">
      
      
            
            <div>
                <div style={{ width: '100px', height: '100px' ,position:'relative'}}>
                  <Image src={restaurantready.data.picture} 
                        alt='Product Picture'
                        fill={true}
                        className=""
                        style={{ width: '100%', height: '100%' }}

                    />  
                </div>
              
              {/* ------------------ */}
              <div>
              <h1 className={pattaya.className} style={{ fontSize: "72px" }}>{restaurantready.data.name} Restaurant Reviews</h1>
              <div>
                {restaurantready.data.address}
                {restaurantready.data.province}
                {restaurantready.data.tel}
                {restaurantready.data.openTime}
                {restaurantready.data.shortLocation}
              </div>
                {restaurantready.data.district}
                {restaurantready.data.postalcode}
                {restaurantready.data.region}
                {restaurantready.data.closeTime}
              </div>
                    
            </div>
            {/* ------------------ */}
            {
              (profileready.data.role=='admin')?
                <div>
                  <div>this is admin</div>
                  <Link><button>manage reservations</button></Link>
                  <Link><button>edit</button></Link>
                  <Link><button>delete</button></Link>
                </div>
                :
                <div>
                  <Link><button>edit</button></Link>
                  <Link><button>delete</button></Link>
                </div>
            }   
            {/* ------------------ */}  

            <div className="">
              Reviews Ratings
              {meanReviewsready.totalRating}
              <div>
                        <Rating readOnly defaultValue={meanReviewsready.totalRating}   />
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
