'use client'
import Link from "next/link";
import { ReviewItem, ReviewJson } from "../../interfaces";
import { RestaurantItem, RestaurantJson } from "../../interfaces";
import deleteReview from "@/libs/DeleteReview";
import { Session } from "next-auth";
import { useState, useEffect } from "react";
import { Rating } from '@mui/material';

export default function ReviewCart({ venuesJson, session }: { venuesJson: ReviewJson, session: Session }) {
    const venuesJsonready = venuesJson;
    const [restaurantNames, setRestaurantNames] = useState<{ [key: string]: string }>({}); // เก็บชื่อร้าน
    const [loading, setLoading] = useState<boolean>(true); // ใช้ในการเช็คสถานะการโหลด

    // ฟังก์ชันดึงชื่อร้านจาก API
    // const fetchRestaurantName = async (restaurantId: string) => {
    //     try {
    //         console.log(restaurantId)
    //         const response = await fetch(`https://restaurant-reservation-backend-blush.vercel.app/api/restaurant/${restaurantId}`); // ดึงชื่อร้านจาก API
    //         const data = await response.json();
    //         if (response.ok && data.name) {
    //             return data.name; // สมมติว่า API ส่งชื่อร้านมาใน field 'name'
    //         } else {
    //             return "Unknown Restaurant"; // หากไม่ได้รับข้อมูลที่ถูกต้องจาก API
    //         }
    //     } catch (error) {
    //         console.error("Error fetching restaurant name:", error);
    //         return "Unknown Restaurant"; // หากเกิดข้อผิดพลาด
    //     }
    // };

    // // ดึงชื่อร้านทั้งหมดในครั้งเดียว
    // useEffect(() => {
    //     const loadRestaurantNames = async () => {
    //         setLoading(true); // เริ่มการโหลด
    //         const names: { [key: string]: string } = {};
    //         const promises = venuesJsonready.data.map(async (review: ReviewItem) => {
    //             if (review.restaurant && !names[review.restaurant]) {
    //                 const name = await fetchRestaurantName(review.restaurant); // ใช้ restaurantId จาก review
    //                 names[review.restaurant] = name;
    //             }
    //         });

    //         // รอให้โหลดข้อมูลทั้งหมดเสร็จ
    //         await Promise.all(promises);
    //         setRestaurantNames(names); // อัพเดต state เมื่อชื่อร้านทั้งหมดถูกโหลด
    //         setLoading(false); // หมดการโหลดแล้ว
    //     };

    //     loadRestaurantNames();
    // }, [venuesJsonready.data]); // ดึงข้อมูลร้านทุกครั้งที่ข้อมูลรีวิวเปลี่ยน

    const onDelete = (rid: string) => {
        alert('delete review')
        deleteReview(session.user.token, rid).then(() => {
            window.location.reload();
        })
    };

    return (
        <>
            <div className="flex flex-row items-end mb-6">
                <div className="font-serif text-xl">{venuesJsonready.count} Review in your catalog</div>
                    
            </div>
            <div className="w-full p-10 space-y-6">
                {venuesJsonready.data.map((carditem: ReviewItem) => (
                    <Link href={`manage/add?id=${carditem._id}`} className="w-full" key={carditem._id}>
                        <div className="bg-green-100 rounded-lg px-5 py-4 my-4 hover:bg-green-200 transition-all duration-300">
                            <div className="text-sm text-gray-800">review_id: {carditem._id}</div>
                        <div className="text-xl">Restaurant: {carditem.restaurant.name} <span className="text-sm text-gray-800">(id: {carditem.restaurant.id})</span></div>
    
                            {/* <div className="text-sm">
                                {loading ? "Loading..." : (restaurantNames[carditem.restaurant] || "Unknown Restaurant")}
                            </div> */}
                            <div className="text-sm font-medium">Reviewer_id: {carditem.user}</div>
                            <div className="text-sm font-medium">Review Star: <Rating value={parseInt(carditem.reviewStar)} readOnly /></div>
                            <div className="text-sm font-medium">Description: {carditem.Description}</div>
                            <button
                                className='bg-amber-800 text-white rounded border border-white
                                font-serif text-xl py-2 px-2 m-2 z-50 
                                hover:bg-white hover:text-amber-800 hover:border-transparent'
                                onClick={(e) => {
                                    e.stopPropagation(); e.preventDefault();
                                    onDelete(carditem._id??'')
                                }}
                            >
                                Remove Review
                            </button>
                        </div>
                    </Link>
                ))}
            </div>
        </>
    );
}
