export default async function getQueueByRestaurant (restaurantId: string,token: string)
{
    //for admin and employee
    const response = await fetch(`${process.env.BACKEND_URL}/api/restaurants/${restaurantId}/queues`, {
        method:"GET",
        headers:{
            authorization:`Bearer ${token}`,
        },
    })
    if(!response.ok)
    {
        throw new Error("Fail to fetch queues")
    }
    return await response.json()
}