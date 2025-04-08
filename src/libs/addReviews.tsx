
export default async function addReviews(token:string,
    {user,restaurant,reviewStar,Description}:
    {user:string,restaurant:string,reviewStar:number,Description:string}
) {

    const response=await fetch(`https://restaurant-reservation-backend-blush.vercel.app/api/v1/restaurants/${restaurant}/reviews`, {
        method:"POST",
        headers:{
            "Content-Type": "application/json",  
            authorization:`Bearer ${token}`,
        },
        body:JSON.stringify({
            user: user,
            restaurant: restaurant,
            reviewStar: reviewStar,
            Description: Description
        })
    });

    if(!response.ok){
        const error = await response.json();  // Log server response for more details
        console.error("Error response:", error);
        throw new Error("failed to add the review")
    }
    return await response.json();
}