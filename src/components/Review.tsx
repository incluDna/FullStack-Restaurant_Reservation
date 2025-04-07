"use client";

import LocationDateReserve from "@/components/LocationDateReserveServer";
import { useSearchParams } from "next/navigation";
import { useState } from "react";
import { useDispatch } from "react-redux";
import { ReviewItem, RestaurantItem, RestaurantJson } from "../../interfaces"; 
import { Pattaya } from "next/font/google";

const pattaya = Pattaya({ weight: "400", subsets: ["thai", "latin"] });

export default function ReviewsClient({ userid, userName, restaurants }: 
  { userid: string, userName: string, restaurants: RestaurantJson }) {
  
  const urlParams = useSearchParams();
  const rid = urlParams.get("id");

  const [reviewStar, setReviewStar] = useState<number>(0);
  const [restaurant, setRestaurant] = useState<string>(urlParams.get("name") || "");
  const [description, setDescription] = useState<string>(""); // ✅ แก้ไขค่าตั้งต้น


  const makeReview = () => {
    if (!rid || !restaurant || reviewStar <= 0 || description.trim() === "") {
      alert("Please fill in all fields before submitting.");
      return;
    }

    const restaurantItem = restaurants.data.find((r: RestaurantItem) => r.name === restaurant);
    if (!restaurantItem) {
      alert("Restaurant not found.");
      return;
    }

    const item: ReviewItem = {
      user: userid, // ✅ แก้ให้ใช้ string แทน ObjectId
      restaurant: restaurantItem._id, // ✅ ใช้ค่าจากฐานข้อมูลโดยตรง
      reviewStar: reviewStar.toString(),
      Description: description,
    };


    setReviewStar(0);
    setDescription("");
    alert("Review added successfully!");
  };

  return (
    <main className="w-[100%] flex flex-col items-center space-y-4">
      <div className={pattaya.className} style={{ fontSize: "96px" }}>New Review</div>
      <div className="text-xl font-serif">{userName}</div>
      <div className="text-xl font-serif">{rid}</div>

      <div className="w-fit space-y-2">
        <div className="font-serif text-lg text-md text-left text-gray-600">
          Review Information
        </div>
        {/* <LocationDateReserve
          onLocationChange={(value: string) => setRestaurant(value)}
          onQuantityChange={(value: string) => setReviewStar(Number(value))}
          restaurants={restaurants}
        /> */}
      </div>

      <textarea
        className="border rounded-md p-2 w-[300px] text-gray-700"
        placeholder="Write your review..."
        value={description}
        onChange={(e) => setDescription(e.target.value)}
      />

      <button
        className="font-serif block rounded-md bg-sky-600 hover:bg-indigo-600 px-3 py-2 text-white shadow-sm"
        onClick={makeReview}
      >
        Add review for this Restaurant
      </button>
    </main>
  );
}

