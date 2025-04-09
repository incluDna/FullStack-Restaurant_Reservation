'use client'
import Link from "next/link";
import { Rating } from "@mui/material";
import { ProfileJson } from "../../interfaces";
import deleteReview from "@/libs/deleteReview";
import { Session } from "next-auth";
import ReviewInteractiveCard from "./ReviewInteractiveCard";

export default function ReviewCard({ time, rating,description ,restaurant,restaurantid,profile,reviewId,session}: 
    { time: string, rating: number ,description:string,restaurant:string,restaurantid:string
        ,profile:ProfileJson,reviewId:string,session:Session    }) {

    const onDelete = (rid: string) => {
        alert('delete review')
        deleteReview(session.user.token,rid)
    };
    return (
        <div className="w-[400px] h-full bg-[#FFECAD] p-5 flex flex-col">
            <div>
                <h1 className='text-xl font-bold text-blue-700'>Restaurant: {restaurant}</h1>
                <div className='font-semibold'>Time: {time}</div>
                <div className='font-semibold'>
                    star: {rating}
                    
                </div>
                <div className='font-semibold'>Description: {description}</div>
            </div>
            

            {/* {(profile.data.role=='admin')?null: */}
                <div className="flex flex-row mt-auto">
                    <Link href={`manage/add?id=${reviewId}`} className="w-full" >
                        <button className="px-4 py-1 bg-[#F89640] text-white shadow-md ">edit</button>
                    </Link>
                    <button className="px-4 py-1 bg-[#F89640] text-white shadow-md  "
                    onClick={(e) => {
                        e.stopPropagation(); e.preventDefault();
                        onDelete(reviewId)
                    }}
                    >remove</button>
                </div>
            {/* } */}
        </div>
    );
    
}

   
