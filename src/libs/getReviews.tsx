import { resolve } from "path";

export default async function getReviews(token:string) {

    const response=await fetch("http://localhost:5000/api/reviews", {
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