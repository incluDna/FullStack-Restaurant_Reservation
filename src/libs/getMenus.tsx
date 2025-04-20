export default async function getMenus(restaurantId: string)
{
    const response = await fetch(`${process.env.BACKEND_URL}/api/restaurants/${restaurantId}/menus`);
    if(!response.ok)
    {
        throw new Error("Fail to fetch menus")
    }
    return await response.json()
}