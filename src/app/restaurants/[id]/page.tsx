import { ChevronRight } from "lucide-react";
import React, { Suspense } from "react";
import getRestaurant from "@/libs/getRestaurant";
import ReviewCatalogExample from "@/components/ReviewCatalogExample";
import { LinearProgress } from "@mui/material";
import getMeanReviews from "@/libs/getMeanReview";
import getUserProfile from "@/libs/getUserProfile";
import getReviewsforRestaurant from "@/libs/getReviewforRestaurant";
import { getServerSession } from "next-auth";
export default async function RestaurantInfo({ params }: { params: { id: string } }) {
  // const session = await getServerSession(authOptions);
  // if (!session) return null
  const token = 
    // session.user.token;
    // uncomment all above and delete line below when login/register is implemented  
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY3ZmQyMjNkMzA1YjkzN2IxNWY5ODI3ZiIsImlhdCI6MTc0NDY0NTIxOCwiZXhwIjoxNzQ3MjM3MjE4fQ.w2QnoRKC8WnqQIVZAVRi5-gG5wijwCNpvLvdTa09mQ4';
    // ** ^ edit and use test token here, this token was for John admin
  const param = await params; //params should be awaited
  const reviews = getReviewsforRestaurant(token, param.id)
  const restaurant = getRestaurant(param.id, token);
  const meanReviews = getMeanReviews(param.id);
  const profile = getUserProfile(token);

  const getRestaurantJSON = await getRestaurant(param.id, token);

  return (
    <main className="w-full bg-white">
      <section className="flex h-[450px] gap-16 w-full">
        {/* Restaurant image */}
        <div className="flex w-[450px] h-[450px] items-center justify-center bg-[#3d3c3a]">
          <p className="font-medium text-white text-5xl text-center leading-[67.2px]">
            image
          </p>
        </div>

        {/* Restaurant information */}
        <div className="flex flex-col gap-2.5 flex-1 pr-12">
          <h1 className="font-medium text-black text-[110px] leading-[154px]">
            {getRestaurantJSON.data.name}
          </h1>

          <div className="flex w-full">
            <div className="flex-1 font-medium text-black text-[40px] leading-[56px]">
              {getRestaurantJSON.data.address} <br />
              {getRestaurantJSON.data.province} <br />
              {getRestaurantJSON.data.tel} <br />
              {getRestaurantJSON.data.openTime}
            </div>

            <div className="flex-1 font-medium text-black text-[40px] leading-[56px]">
              {getRestaurantJSON.data.district} <br />
              {getRestaurantJSON.data.postalCode} <br />
              {getRestaurantJSON.data.region} <br />
              {getRestaurantJSON.data.closeTime}
            </div>
          </div>
        </div>
      </section>

      {/* Queue and Reservation section */}
      <section className="flex w-full justify-center gap-8 py-12 px-12">
        {/* Get Queue Card */}
        <div className="flex-1 bg-[#ffebac] border-none rounded-none">
          <div className="flex flex-col gap-2.5 p-12">
            <h2 className="font-medium text-black text-9xl leading-[179.2px]">
              Get queue
            </h2>

            <div className="flex flex-col gap-2.5 p-2.5">
              <label className="font-medium text-black text-[40px] leading-[56px]">
                How many people?
              </label>
              <div className="w-[142px] h-[147px] bg-white border-none" />
            </div>

            <div className="flex flex-col h-[331px] items-center justify-end">
              <button className="w-[620px] h-[145px] bg-[#f79540] hover:bg-[#f79540]/90 rounded-none">
                <span className="font-medium text-white text-[55px] leading-[77px]">
                  get in line
                </span>
              </button>
            </div>
          </div>
        </div>

        {/* Reserve Table Card */}
        <div className="flex-1 bg-[#ffebac] border-none rounded-none">
          <div className="flex flex-col gap-2.5 p-12">
            <h2 className="font-medium text-black text-9xl leading-[130px]">
              Reserve table
            </h2>

            <div className="flex flex-col gap-2.5 p-2.5">
              <label className="font-medium text-black text-[40px] leading-[56px]">
                How many people?
              </label>
              <div className="w-[142px] h-[147px] bg-white border-none" />
            </div>

            <div className="flex flex-col gap-2.5 p-2.5">
              <label className="font-medium text-black text-[40px] leading-[56px]">
                Select Date and Time
              </label>
              <div className="w-[227px] h-[147px] bg-white border-none" />
              <div className="w-[316px] h-[147px] bg-white border-none" />
            </div>

            <div className="flex flex-col items-center justify-end pt-16">
              <button className="w-[620px] h-[145px] bg-[#f79540] hover:bg-[#f79540]/90 rounded-none">
                <span className="font-medium text-white text-[55px] leading-[77px]">
                  reserve
                </span>
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Reviews section */}
      <section className="flex flex-col gap-4 px-12 pb-12">
        <h2 className="font-medium text-black text-[110px] leading-[154px]">
          Reviews Ratings
        </h2>
        <Suspense fallback={<p>Loading ...<LinearProgress /></p>}>
          <ReviewCatalogExample reviews={reviews} restaurant={restaurant} meanReviews={meanReviews} profile={profile} />
        </Suspense>
      </section>
    </main>
  );
}