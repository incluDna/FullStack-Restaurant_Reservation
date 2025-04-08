'use client'

import { Link, Rating } from "@mui/material";
import { ProfileJson } from "../../interfaces";

export default function ReviewCard({ time, rating,description ,restaurunt,restaurantid,profile}: 
    { time: string, rating: number ,description:string,restaurunt:string,restaurantid:string
        ,profile:ProfileJson    }) {


    return (
        <div>
            <h1>{restaurunt}</h1>
            <div>{time}</div>
            <div>
                star
                <div><Rating readOnly defaultValue={rating}/></div>
                <div>{rating}</div>
            </div>
            <div>{description}</div>

            {/* {(profile.data.role=='admin')?null: */}
                <div>
                    <Link href={`manage/add?id=${restaurantid}`} className="w-full" key={restaurantid}>
                        <button>edit</button>
                    </Link>
                    <button>remove</button>
                </div>
            {/* } */}

        </div>
    );
}
