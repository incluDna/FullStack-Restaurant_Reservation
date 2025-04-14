// import { Pattaya } from "next/font/google";
import getRestaurant from '@/libs/getRestaurant';
import { getServerSession } from "next-auth";
import getReviewsforRestaurant from "@/libs/getReviewforRestaurant";
import getMeanReviews from "@/libs/getMeanReview";
import getUserProfile from "@/libs/getUserProfile";
import { LinearProgress, Link } from "@mui/material";
import { Suspense } from "react";
import ReviewCatalogue from "@/components/ReviewCatalog";
// const pattaya = Pattaya({ weight: "400", subsets: ["thai", "latin"] });

export default async function Review({ params }: { params: { id: string } }) {


  // const session = await getServerSession(authOptions);
  // if (!session) return null
  const token = 
    // session.user.token;
    // uncomment all above and delete line below when login/register is implemented  
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY3ZmQyMjNkMzA1YjkzN2IxNWY5ODI3ZiIsImlhdCI6MTc0NDY0NTIxOCwiZXhwIjoxNzQ3MjM3MjE4fQ.w2QnoRKC8WnqQIVZAVRi5-gG5wijwCNpvLvdTa09mQ4';
    // ** ^ edit and use test token here, this token was for John admin
  const reviews= getReviewsforRestaurant(token,params.id)
  const restaurant= getRestaurant(params.id,token);
  const meanReviews= getMeanReviews(params.id)
  const profile= getUserProfile(token);
       

 return( 
  <main className="text-center p-5 ">
    <Suspense fallback={<p>Loading ...<LinearProgress/></p>}>
      <ReviewCatalogue reviews={reviews} restaurant={restaurant} meanReviews={meanReviews} profile={profile}/>
    </Suspense>
  </main>
)
}
