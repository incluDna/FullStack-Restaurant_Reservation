'use client'
import Link from "next/link";
import { Rating } from "@mui/material";
import { ProfileJSON } from "../../interfaces";
import deleteReview from "@/libs/deleteReview";
import { Session } from "next-auth";
import ReviewInteractiveCard from "./ReviewInteractiveCard";
import { useNotice } from "./NoticeContext";
export default function ReviewCard({ time, rating,description ,restaurant,profile,reviewId}: 
    { time: string, rating: number ,description:string,restaurant:string,
        profile:ProfileJSON,reviewId:string}) {
    const { showNotice } = useNotice();
    const onDelete = (rid: string) => {
        showNotice('delete review')
        // deleteReview(rid, session.user.token) , TEST LATER
    };
    return (
        <div className="rounded-lg p-4 shadow-md w-[17vw] max-w-sm h-full bg-[#FFECAD] flex flex-col space-y-4">
            <div>
                <h1 className='text-xl font-bold text-black'>{restaurant}</h1>
                <div className='w-1/2 py-2 rounded'>Time: {time}</div>
                <div className='w-1/2 py-2 rounded'>
                    star: {rating}
                    
                </div>
                <div className='w-1/2 py-2 rounded'>Description: {description}</div>
            </div>
            

             {/* {(profile.data.role=='admin')?null:  */}
                <div className="flex flex-row mt-auto">
                    <Link href={`/reviews/new?id=${reviewId}`} className="w-full" >
                        <button className="px-4 py-1 bg-[#F89640] text-white shadow-md ">edit</button>
                    </Link>
                    <button className="px-4 py-1 bg-[#F89640] text-white shadow-md  "
                    onClick={(e) => {
                        e.stopPropagation(); e.preventDefault();
                        onDelete(reviewId)
                    }}
                    >remove
                    </button>
                </div>
             {/* }  */}
        </div>
    );
    
}

   
