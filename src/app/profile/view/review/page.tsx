'use client'

import ReviewCart from "@/components/ReviewCart"
import getReviews from "@/libs/getReviews";
import { Pattaya } from "next/font/google";
import getUserProfile from "@/libs/getUserProfile";
import { Suspense, useEffect, useState } from "react";
import { getAuthCookie } from "@/libs/getAuthCookie";
import { ReviewJSON } from "../../../../../interfaces";

const pattaya = Pattaya({ weight: "400", subsets: ["thai", "latin"] });

export default function ManageReview() {
    // const session = await getServerSession(authOptions);
    // if (!session) return null
    // const token =
    //     // session.user.token;
    //     // uncomment all above and delete line below when login/register is implemented  
    //     'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY3ZmQyMjNkMzA1YjkzN2IxNWY5ODI3ZiIsImlhdCI6MTc0NDY0NTIxOCwiZXhwIjoxNzQ3MjM3MjE4fQ.w2QnoRKC8WnqQIVZAVRi5-gG5wijwCNpvLvdTa09mQ4';
    // // ** ^ edit and use test token here, this token was for John admin
    const [token, setToken] = useState<string | null>(null);
    const [profile, setProfile] = useState<any>(null);
    const [review,setReview]=useState<ReviewJSON|null>(null);
    
      useEffect(() => {
        async function fetchToken() {
          try {
            const data = await getAuthCookie();
            if (data.success) {
              setToken(data.token);
              const userProfile = await getUserProfile(data.token);
              setProfile(userProfile);
              const userReview = await getReviews(data.token);
              setReview(userReview);
            } else {
              console.error("Auth error:", data.error);
            }
          } catch (err) {
            console.error("Failed to fetch auth cookie", err);
          }
        }
        fetchToken();
      }, []);
      if (!token || !profile || !review) return <p>Loading...</p>;


    return (
        <main className="">
            {/* <Suspense fallback={<p>Loading ...<LinearProgress /></p>}> */}
                {/*<h1 className={`${pattaya.className} w-1/4 text-3xl font-bold font-serif`} style={{ fontSize: "40px" }}>Reviews</h1>*/}
                <ReviewCart reviews={review} profile={profile} token={token} />
                hello?
            {/* </Suspense> */}

        </main>
    )
}