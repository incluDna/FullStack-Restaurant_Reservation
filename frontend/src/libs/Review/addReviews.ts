
export default async function addReviews(token:string,
    {user,restaurant,reviewStar,Description}:
    {user:string,restaurant:string,reviewStar:number,Description:string}
) {
    console.log(token)
    console.log(user)
    console.log(restaurant)
    console.log(reviewStar)
    console.log(Description)
    


    const response=await fetch(`${process.env.BACKEND_URL}/api/restaurants/${restaurant}/reviews`, {
        method:"POST",
        headers:{
            "Content-Type": "application/json",  
            authorization:`Bearer ${token}`,
        },
        body:JSON.stringify({
            user: user,
            reviewStar: reviewStar,
            reviewText: Description
        })
    });

    if(!response.ok){
        const error = await response.json();  // Log server response for more details
        console.error("Error response:", error);
        throw new Error(error.message);
    }
    return await response.json();
}