import { resolve } from "path";

export default async function getRestaurants() {
    
    const response = await fetch(`${process.env.BACKEND_URL}/api/restaurants`, { 
        cache: "no-store",
        next: { tags: ["restaurant"] } 
    });
    
    if(!response.ok){
        throw new Error("failed to loaded the restaurants")
    }
    return await response.json();
}