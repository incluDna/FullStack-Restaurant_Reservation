export default async function getReservations(token:string, restaurantId?:string) {

    const response=await fetch(`${process.env.BACKEND_URL}/api/restaurants/${restaurantId}/reservations`, {
        method:"GET",
        headers:{
            authorization:`Bearer ${token}`,
        },
        // body: JSON.stringify(restaurantId)
    })

    if(!response.ok){
        throw new Error("failed to loaded the reservations")
    }
    return await response.json();
}