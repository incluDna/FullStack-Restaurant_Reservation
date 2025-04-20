// import { Pattaya } from "next/font/google";
import getRestaurant from '@/libs/getRestaurant';
import getReviewsForRestaurant from "@/libs/getReviewForRestaurant";
import getMeanReviews from "@/libs/getMeanReview";
import { LinearProgress, Link } from "@mui/material";
import { Suspense } from "react";
import ReviewCatalogue from "@/components/ReviewCatalog";
import { MeanReview, SingleRestaurantJSON, ReviewJSON } from '../../../../../interfaces';
import restaurant from '../management/page';
// const pattaya = Pattaya({ weight: "400", subsets: ["thai", "latin"] });

export default async function Review({ params, searchParams}: {params: { id: string }; searchParams: { page?: string };}) {
  const param = await params; //params should be awaited
  const searchparam = await searchParams; // `searchParams` should be awaited before using its properties
  const page = searchparam.page || '1';
  const reviews:ReviewJSON= await getReviewsForRestaurant(param.id);
  const meanReviews:MeanReview= await getMeanReviews(param.id)
  const restaurantJSON:SingleRestaurantJSON = await getRestaurant(param.id);
  console.log(restaurantJSON);
  const restaurant = restaurantJSON.data;
 return( 
  <main className="text-center p-5 ">
    <Suspense fallback={<p>Loading ...<LinearProgress/></p>}>
      <ReviewCatalogue reviews={reviews.data} meanReviews={meanReviews.totalRating} page={parseInt(page)} totalPages={reviews.totalPages} restaurant={restaurant}/>
    </Suspense>
  </main>
)
}
