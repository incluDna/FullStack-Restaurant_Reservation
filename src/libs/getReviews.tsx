import { resolve } from "path";

export default async function getReviews(token:string) {

    const response=await fetch("https://restaurant-reservation-backend-blush.vercel.app/api/v1/reviews", {
        method:"GET",
        headers:{
            authorization:`Bearer ${token}`,
        }
    })

    if(!response.ok){
        throw new Error("failed to loaded the reviews")
    }
    return await response.json();
}