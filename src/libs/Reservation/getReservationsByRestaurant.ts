export default async function getReservationsByRestaurant(token:string, restaurantId?:string) {

    const response=await fetch(`${process.env.BACKEND_URL}/api/restaurants/${restaurantId}/reservations`, {
        method:"GET",
        headers:{
            authorization:`Bearer ${token}`,
        },
    })

    if(!response.ok){
        throw new Error("failed to loaded the reservations by restaurants")
    }
    return await response.json();
}