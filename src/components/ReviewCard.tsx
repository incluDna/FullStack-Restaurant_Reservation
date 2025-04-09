'use client'

import Link from "next/link";
import { Rating } from "@mui/material";
import { ProfileJson } from "../../interfaces";

export default function ReviewCard({ time, rating,description ,restaurant,restaurantid,profile}: 
    { time: string, rating: number ,description:string,restaurant:string,restaurantid:string
        ,profile:ProfileJson    }) {


    return (
        <div className="w-[400px] h-full bg-[#FFECAD] p-5 flex flex-col">
            <div>
                <h1 className='text-xl font-bold text-blue-700'>Restaurant: {restaurant}</h1>
                <div className='font-semibold'>Time: {time}</div>
                <div className='font-semibold'>
                    star: {rating}
                    <div><Rating readOnly defaultValue={rating}/></div>
                    
                </div>
                <div className='font-semibold'>Description: {description}</div>
            </div>
            

            {/* {(profile.data.role=='admin')?null: */}
                <div className="flex flex-row mt-auto">
                    <Link href={`manage/add?id=${restaurantid}`} className="w-full" key={restaurantid}>
                        <button className="px-4 py-1 bg-[#F89640] text-white shadow-md hover:bg-green-700 focus:outline-none">edit</button>
                    </Link>
                    <button className="px-4 py-1 bg-[#F89640] text-white shadow-md hover:bg-green-700 focus:outline-none">remove</button>
                </div>
            {/* } */}
        </div>
    );
    
}

   
