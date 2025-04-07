
export default async function getReviewsforRestaurant(token:string,id:string) {
    
    const response=await fetch(`http://localhost:5000/api/restaurants/${id}/reviews`, {
        method:"GET",
        headers:{
            authorization:`Bearer ${'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY3ZjJhZmNhNjY3MzYyMGQxNGI5NmUyOSIsImlhdCI6MTc0NDAyNDk2OSwiZXhwIjoxNzQ2NjE2OTY5fQ.wn__6CeJd4fTH5u5Yd5oHDgsPO-cUmcRiYoTHzEiUqs'}`,
        }
    })
    console.log(id)
    console.log(token)
    if(!response.ok){
        throw new Error("failed to loaded the reviews")
    }
    return await response.json();
}