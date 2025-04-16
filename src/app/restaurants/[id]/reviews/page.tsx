// import { Pattaya } from "next/font/google";
import getRestaurant from '@/libs/getRestaurant';
import getReviewsForRestaurant from "@/libs/getReviewForRestaurant";
import getMeanReviews from "@/libs/getMeanReview";
import { LinearProgress, Link } from "@mui/material";
import { Suspense } from "react";
import ReviewCatalogue from "@/components/ReviewCatalog";
import { MeanReview, RestaurantJSON, ReviewJSON } from '../../../../../interfaces';
// const pattaya = Pattaya({ weight: "400", subsets: ["thai", "latin"] });

export default async function Review({ params }: { params: { id: string } }) {
  const param = await params; //params should be awaited
  const reviews:ReviewJSON= await getReviewsForRestaurant(param.id);
  const meanReviews:MeanReview= await getMeanReviews(param.id)

 return( 
  <main className="text-center p-5 ">
    <Suspense fallback={<p>Loading ...<LinearProgress/></p>}>
      <ReviewCatalogue reviews={reviews.data} meanReviews={meanReviews.totalRating}/>
    </Suspense>
  </main>
)
}
