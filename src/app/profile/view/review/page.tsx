import ReviewCart from "@/components/ReviewCart"
import getReviews from "@/libs/getReviews";
import { getServerSession } from "next-auth";
import { Pattaya } from "next/font/google";
import getUserProfile from "@/libs/getUserProfile";
import { LinearProgress } from "@mui/material";
import { Suspense } from "react";

const pattaya = Pattaya({ weight: "400", subsets: ["thai", "latin"] });

export default async function ManageReview() {
    // const session = await getServerSession(authOptions);
    // if (!session) return null
    const token =
        // session.user.token;
        // uncomment all above and delete line below when login/register is implemented  
        'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY3ZmQyMjNkMzA1YjkzN2IxNWY5ODI3ZiIsImlhdCI6MTc0NDY0NTIxOCwiZXhwIjoxNzQ3MjM3MjE4fQ.w2QnoRKC8WnqQIVZAVRi5-gG5wijwCNpvLvdTa09mQ4';
    // ** ^ edit and use test token here, this token was for John admin

    const review = getReviews(token);
    const profile = getUserProfile(token);

    return (
        <main className="">
            <Suspense fallback={<p>Loading ...<LinearProgress /></p>}>
                {/*<h1 className={`${pattaya.className} w-1/4 text-3xl font-bold font-serif`} style={{ fontSize: "40px" }}>Reviews</h1>*/}
                <ReviewCart reviews={review} profile={profile} session={undefined} />
            </Suspense>

        </main>
    )
}