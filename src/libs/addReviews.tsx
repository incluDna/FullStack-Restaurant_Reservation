
export default async function addReviews(token:string,
    {user,restaurant,reviewStar,Description}:
    {user:string,restaurant:string,reviewStar:number,Description:string}
) {
    console.log(token)
    console.log(user)
    console.log(restaurant)
    console.log(reviewStar)
    console.log(Description)
    


    const response=await fetch(`http://localhost:5000/api/restaurants/${restaurant}/reviews`, {
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
        throw new Error("failed to add the review")
    }
    return await response.json();
}