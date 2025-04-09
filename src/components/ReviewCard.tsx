'use client'

import { Link, Rating } from "@mui/material";
import { ProfileJson } from "../../interfaces";

export default function ReviewCard({ time, rating,description ,restaurant,restaurantid,profile}: 
    { time: string, rating: number ,description:string,restaurant:string,restaurantid:string
        ,profile:ProfileJson    }) {


    return (
        <div>
            <h1>Restaurant: {restaurant}</h1>
            <div>Time: {time}</div>
            <div >
                star: {rating}
                <div><Rating readOnly defaultValue={rating}/></div>
                
            </div>
            <div>Description: {description}</div>

            {/* {(profile.data.role=='admin')?null: */}
                {/*<div>
                    <Link href={`manage/add?id=${restaurantid}`} className="w-full" key={restaurantid}>
                        <button>edit</button>
                    </Link>
                    <button>remove</button>
                </div>*/}
            {/* } */}

        </div>
    );
}
