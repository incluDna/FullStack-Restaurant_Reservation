
export default async function getReviewsforRestaurant(token:string,id:string) {
    
    const response=await fetch(`${process.env.BACKEND_URL}/api/restaurants/${id}/reviews`, {
        method:"GET",
        headers:{
            authorization:`Bearer ${token}`,
        }
    })
    console.log(id)
    console.log(token)
    if(!response.ok){
        throw new Error("failed to loaded the reviews")
    }
    return await response.json();
}