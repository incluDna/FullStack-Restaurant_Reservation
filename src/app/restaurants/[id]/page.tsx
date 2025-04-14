import { ChevronRight } from "lucide-react";
import React from "react";
import getRestaurant from "@/libs/getRestaurant";
export default async function RestaurantInfo({ params }: { params: { cid: string } }) {

  const getRestaurantJSON = await getRestaurant(params.cid, )

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

        {/* Rating summary */}
        <div className="flex justify-between items-start py-6 px-8 bg-[#ffebac] w-full">
          <div className="flex items-center gap-10">
            <div className="font-medium text-[55px] leading-[77px]">
              <span className="text-black">{reviewsData.rating}</span>
              <span className="text-[#f79540] text-[40px] leading-[56px]">
                /5.0
              </span>
            </div>
            <div className="font-medium text-black text-[55px] leading-[77px]">
              {/* {renderStars(5)} */}
            </div>
          </div>
          <div className="font-medium text-black text-[55px] leading-[77px]">
            from {reviewsData.totalReviews} reviews
          </div>
        </div>

        {/* Review cards */}
        <div className="flex flex-wrap gap-6 w-full">
          {reviewsData.reviews.map((review, index) => (
            <div
              key={index}
              className="w-[592px] bg-[#ffebac] rounded-none border-none"
            >
              <div className="flex flex-col gap-2.5 p-6">
                <h3 className="font-medium text-black text-[40px] leading-[56px]">
                  {review.username}
                </h3>
                <div className="font-medium text-black text-[40px] leading-[56px]">
                  {/* {renderStars(review.rating)} */}
                </div>
                <p className="font-medium text-black text-[25px] leading-[35px] whitespace-pre-line">
                  {review.comment}
                </p>
              </div>
            </div>
          ))}

          {/* See more button */}
          <div className="flex-1 flex items-end justify-end h-[390px] pr-8 pb-8">
            <button className="flex items-center gap-2.5 px-12 py-1 bg-[#ffebac] hover:bg-[#ffebac]/90 text-black rounded-[75px]">
              <span className="font-medium text-[40px] leading-[56px]">
                see more ..
              </span>
              <ChevronRight className="w-[91px] h-[91px]" />
            </button>
          </div>
        </div>
      </section>
    </main>
  );
}