export default async function getRestaurant(id: string) {

    const response = await fetch(`${process.env.BACKEND_URL}/api/restaurants/${id}`)
        // headers: {
        //     "Content-Type": "application/json",
        //     "Authorization": `Bearer ${token}`,
        // },
        // cache: "no-store" });

    if (!response.ok) {
        throw new Error("failed to loaded the restaurant")

    }
    return await response.json();
}