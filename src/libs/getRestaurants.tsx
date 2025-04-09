import { resolve } from "path";

export default async function getRestaurants() {
    //await new Promise((resolve)=>setTimeout(resolve,5000) )
    // process.env.Vercel_URL
    
    const response = await fetch(`http://localhost:5000/api/restaurants`, { 
        cache: "no-store",
        next: { tags: ["restaurant"] } 
    });
    
    if(!response.ok){
        throw new Error("failed to loaded the restaurants")
    }
    return await response.json();
}