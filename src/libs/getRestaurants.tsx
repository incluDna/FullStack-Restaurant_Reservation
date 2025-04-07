import { resolve } from "path";

export default async function getRestaurants() {
    //await new Promise((resolve)=>setTimeout(resolve,5000) )
    // process.env.Vercel_URL
    
    const response = await fetch(`https://restaurant-reservation-backend-blush.vercel.app/api/v1/restaurants`, { 
        cache: "no-store",
        next: { tags: ["restaurant"] } 
    });
    
    if(!response.ok){
        throw new Error("failed to loaded the restaurants")
    }
    return await response.json();
}