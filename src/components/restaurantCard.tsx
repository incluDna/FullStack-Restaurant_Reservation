import React from "react";
import { Star } from "lucide-react";
import Image from "next/image";

export default function RestaurantCard({
  restaurantName,
  imgSrc,
  location,
  openCloseTime,
  rating,
  currentQueue,
}: {
  restaurantName: string;
  imgSrc: string;
  location: string;
  openCloseTime: string;
  rating: number;
  currentQueue: string;
}) {
  // Generate star rating display dynamically based on the rating
  const renderStars = () => {
    return Array(5)
      .fill(0)
      .map((_, i) => (
        <Star
          key={i}
          className={`w-6 h-6 ${i < Math.round(rating)
            ? "fill-[#f79540] text-[#f79540]"
            : "text-gray-300"
            }`}
        />
      ));
  };

  return (
    <div className="flex h-2/5 w-[700px] p-0 overflow-hidden border-0 rounded-[30px] drop-shadow-lg ml-16 mb-8">
      {/* Left side - Image placeholder */}
      <div className="flex w-[419px] items-center justify-center bg-[#ff7b00] text-[#faf9f6]">
        <div className="min-w-full h-full relative overflow-hidden">
          <Image
            src={imgSrc}
            alt="meeting room"
            quality={100}
            className="bg-black w-full h-full object-cover"
            fill={true}
          ></Image>
        </div>
      </div>

      {/* Right side - Restaurant information */}
      <div className="flex flex-col justify-between p-4 gap-y-3 flex-1 bg-[#C2C2C2]">
        <div className="space-y-4">
          {/* Restaurant name and details */}
          <div>
            <h2 className="font-medium text-[35px] leading-[56px] w-[325px] text-[#333]">
              {restaurantName}
            </h2>
            <p className="font-medium text-[25px] leading-[35px] w-[325px] text-[#555]">
              {location}
              <br />
              {openCloseTime}
            </p>
          </div>
        </div>
        
        {/* Rating */}
        <div className="flex items-center gap-2.5 px-4 py-3 bg-[#faf9f6] hover:bg-[#faf9f6] text-[#f79540] rounded-none">
          <span className="font-medium text-[25px] leading-[35px] text-[#333]">
            {rating}
          </span>
          <span className="flex items-center">{renderStars()}</span>
        </div>

        {/* Queue information */}
        <div className="px-4 py-3 bg-[#faf9f6] hover:bg-[#faf9f6] text-[#f79540] rounded-none">
          <span className="font-medium text-[25px] leading-[35px] text-[#333]">
            Current queue: {currentQueue}
          </span>
        </div>
        {/* Action button */}
        <div className="p-0 mt-auto">
          <button className="bg-[#595959]  text-white  rounded-none py-3 px-8 transition duration-200">
            <span className="font-medium text-[25px] leading-[35px]">
              See information
            </span>
          </button>
        </div>
      </div>
    </div>
  );
}
