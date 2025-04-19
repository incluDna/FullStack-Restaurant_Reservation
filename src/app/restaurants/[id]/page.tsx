
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import ReviewCatalogExample from "@/components/ReviewCatalogExample";
import getMeanReviews from "@/libs/getMeanReview";
import getRestaurant from "@/libs/getRestaurant";
import getReviewsforRestaurant from "@/libs/getReviewforRestaurant";
import getUserProfile from "@/libs/getUserProfile";
import { LinearProgress } from "@mui/material";
import { getServerSession } from "next-auth";
import { Suspense } from "react";

export default async function restaurant({ params }: { params: { id: string } }) {
  const session =await getServerSession(authOptions);
  if(!session)return null

  const reviews= getReviewsforRestaurant(session.user.token,params.id,1)
  const restaurant= getRestaurant(params.id,session.user.token);
  const meanReviews= getMeanReviews(session.user.token,params.id)
  const profile= getUserProfile(session.user.token);

  return (
    <main>
      <h1>make reservation / get virtual queue</h1>
      <Suspense fallback={<p>Loading ...<LinearProgress/></p>}>      
        <ReviewCatalogExample reviews={reviews} restaurant={restaurant} meanReviews={meanReviews} profile={profile}/>
      </Suspense>
    </main>
  );
}

