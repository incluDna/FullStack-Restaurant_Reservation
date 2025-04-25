import React from "react";
import { Star } from "lucide-react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
export default function RestaurantCard({
  restaurantsID,
  restaurantName,
  imgSrc,
  location,
  openCloseTime,
  rating,
  currentQueue,
}: {
  restaurantsID: string;
  restaurantName: string;
  imgSrc: string;
  location: string;
  openCloseTime: string;
  rating: number | null;
  currentQueue: string;
}) {
  // Generate star rating display dynamically based on the rating
  const renderStars = () => {
    return Array(5)
      .fill(0)
      .map((_, i) => (
        <Star
          key={i}
          className={`w-6 h-6 ${i < Math.round(rating!)
              ? "fill-[#f79540] text-[#f79540]"
              : "text-gray-300"
            }`}
        />
      ));
  };
  const router = useRouter();

  const seeInfo = () => {
    router.push(`/restaurants/${restaurantsID}`);
  };
  return (
    <div className="flex w-[45%] h-[50vh] p-0 drop-shadow-lg overflow-hidden border-0 rounded-[20px] ml-8 mb-8">
      {/* Left side - Image placeholder */}
      <div className="w-1/2 h-full">
          <img
            className=" w-full h-full object-cover"
            alt="restaurants"
            src={imgSrc}
          />
      </div>

      {/* Right side - Restaurant information */}
      <div className="flex flex-col w-1/2 justify-between p-4 flex-1 bg-[#FFECAD]">
        <div className="space-y-2">
          {/* Restaurant name and details */}
          <div>
            <h2 className="font-medium text-[24px] leading-[47px] w-full text-[#333]">
              {restaurantName}
            </h2>
            <p className="font-inter font-semibold text-[18px] w-full text-[#555]">
              {location}
              <br />
              {openCloseTime}
            </p>
          </div>

          {/* Rating */}
          <div className="font-inter flex items-center gap-2.5 px-4 py-2 bg-[#faf9f6] hover:bg-[#faf9f6] text-[#f79540] rounded-none">
            <span className="font-semibold text-[20px] leading-[35px] text-[#F89640]">
              {rating === null ? "No Reviews" : rating}
            </span>
            {rating !== null && <span className="flex items-center">{renderStars()}</span>}
          </div>

          {/* Queue information */}
          <div className="font-inter px-4 py-2 bg-[#faf9f6] hover:bg-[#faf9f6] text-[#s] rounded-none">
            <span className="font-semibold text-[20px] leading-[35px] text-[#F89640]">
              Current queue: {currentQueue}
            </span>
          </div>
        </div>

        {/* Action button */}
        {/* <Link href={`/restaurants?id=${restaurantsID}`} passHref> */}
      <div className="flex p-0 mt-auto">
        <motion.button
          className="w-full bg-[#F89640] text-white text-2xl px-8 py-2"
          whileHover={{ backgroundColor: "#5A2934", scale: 1.02 }}
          transition={{ duration: 0.3 }}
          onClick={seeInfo}
        >
          <span className="font-medium text-[25px] leading-[35px]">
            See information
          </span>
        </motion.button>
      </div>
    {/* </Link> */}
      </div>
    </div>
  );
}
