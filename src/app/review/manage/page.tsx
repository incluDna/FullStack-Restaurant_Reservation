import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import ReviewCart from "@/components/ReviewCart"
import getReviews from "@/libs/getReviews";
import { getServerSession } from "next-auth";
import { Pattaya } from "next/font/google";
import getRestaurants from "@/libs/getRestaurants";
import getUserProfile from "@/libs/getUserProfile";
import { LinearProgress } from "@mui/material";
import { Suspense } from "react";

const pattaya = Pattaya({ weight: "400", subsets: ["thai", "latin"] });

export default async function ManageReview() {
    const session =await getServerSession(authOptions);
    if(!session)return null

    const review= getReviews(session.user.token);
    const profile= getUserProfile(session.user.token);
    return (
        <main className="">
            <Suspense fallback={<p>Loading ...<LinearProgress/></p>}>
            
                <h1 className={`${pattaya.className} text-center text-4xl`} style={{ fontSize: "40px" }}>Reviews</h1>
                <ReviewCart reviews={review} profile={profile} session={session}/>

            </Suspense>
            
        </main>
    )
}