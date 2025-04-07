import { resolve } from "path";

export default async function getMeanReviews(token:string,id:string) {
    await new Promise((resolve)=>setTimeout(resolve,5000) )
    const response=await fetch(`http://localhost:5000/api/reviews/means/${id}`, {
        method:"GET",
        headers:{
            authorization:`Bearer ${'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY3ZjJhZmNhNjY3MzYyMGQxNGI5NmUyOSIsImlhdCI6MTc0NDAyNDk2OSwiZXhwIjoxNzQ2NjE2OTY5fQ.wn__6CeJd4fTH5u5Yd5oHDgsPO-cUmcRiYoTHzEiUqs'}`,
        }
    })

    // if(!response.ok){
    //     throw new Error("failed to loaded the mean reviews")
    // }
    return await response.json();
}