
// import { Pattaya } from "next/font/google";
import getRestaurant from '@/libs/getRestaurant';
import { getServerSession } from "next-auth";
import getReviewsforRestaurant from "@/libs/getReviewforRestaurant";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import getMeanReviews from "@/libs/getMeanReview";
import getUserProfile from "@/libs/getUserProfile";
import { LinearProgress, Link } from "@mui/material";
import { Suspense } from "react";
import ReviewCatalogue from "@/components/ReviewCatalog";
import ReviewCatalogExample from '@/components/ReviewCatalogExample';
// const pattaya = Pattaya({ weight: "400", subsets: ["thai", "latin"] });

export default async function Review({ params }: { params: { rid: string } }) {


  const session =await getServerSession(authOptions);
  if(!session)return null

  const reviews= getReviewsforRestaurant(session.user.token,params.rid)

  const restaurant= getRestaurant(params.rid,session.user.token);

  const meanReviews= getMeanReviews(session.user.token,params.rid)

  const profile= getUserProfile(session.user.token);
       

 return( 
  <main className="text-center p-5 ">
      <Suspense fallback={<p>Loading ...<LinearProgress/></p>}>
      <ReviewCatalogue reviews={reviews} restaurant={restaurant} meanReviews={meanReviews} profile={profile}/>
      Delete later:
      <ReviewCatalogExample reviews={reviews} restaurant={restaurant} meanReviews={meanReviews} profile={profile}/>
      </Suspense>
      


  </main>
)
}
