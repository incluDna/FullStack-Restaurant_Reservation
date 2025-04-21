export default async function getReviewsForRestaurant(id:string,page:number) {

    const response = await fetch(`${process.env.BACKEND_URL}/api/restaurants/${id}/reviews?page=${page}&limit=9`, {
        
            method:"GET"
        })
        console.log(id)
        if(!response.ok){
            throw new Error("failed to loaded the reviews")
        }
        return await response.json();
    }