'use client'
import Link from "next/link";
import { ProfileJSON } from "../../interfaces";
import deleteReview from "@/libs/Review/deleteReview";
import ClientRating from "./ClientRating";
import { useNotice } from "./NoticeContext";
export default function ReviewCard({ time, rating,description ,restaurant,token,reviewId}: 
    { time: string, rating: number ,description:string,restaurant:string,
      reviewId:string,token:string}) {
        const { showNotice } = useNotice();
      
    const onDelete = (rid: string) => {
        showNotice('delete review', true)
        deleteReview(rid, token) 
        window.location.reload();
    };
    return (
        <div className="rounded-lg p-4 shadow-md w-[17vw] max-w-sm h-full bg-[#FFECAD] flex flex-col space-y-4">
            <div>
                <h1 className='text-xl font-bold text-black'>{restaurant}</h1>
                <div className='w-1/2 py-2 rounded'>Time: {time}</div>
                <div className='w-1/2 py-2 rounded flex flex-row items-center'>
                    star:
                    <ClientRating rating={rating}/>
                </div>
                <div className='w-1/2 py-2 rounded'>Description: {description}</div>
            </div>
            

             {/* {(profile.data.role=='admin')?null:  */}
                <div className="flex flex-row mt-auto">
                    <Link href={`/reviews/?id=${reviewId}`} className="w-full" >
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

   