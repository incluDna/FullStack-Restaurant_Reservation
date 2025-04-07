import { resolve } from "path";

export default async function getMeanReviews(token:string,id:string) {
    await new Promise((resolve)=>setTimeout(resolve,5000) )
    const response=await fetch(`http://localhost:5000/api/reviews/means/${id}`, {
        method:"GET",
        headers:{
            authorization:`Bearer ${token}`,
        }
    })

    // if(!response.ok){
    //     throw new Error("failed to loaded the mean reviews")
    // }
    return await response.json();
}