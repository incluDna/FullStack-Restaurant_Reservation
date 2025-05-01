export default async function getMenu(restaurantId: string, id: string)
{
    const response = await fetch(`${process.env.BACKEND_URL}/api/restaurants/${restaurantId}/menus/${id}`);
    if(!response.ok)
    {
        throw new Error("Fail to fetch menu")
    }
    return await response.json()
}