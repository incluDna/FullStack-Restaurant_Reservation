export default async function getReviewForRestaurant(id: string) {

    const response = await fetch(`${process.env.BACKEND_URL}/api/restaurants/${id}/reviews`)
        // headers: {
        //     "Content-Type": "application/json",
        //     "Authorization": `Bearer ${token}`,
        // },
        // cache: "no-store" });

    if (!response.ok) {
        throw new Error("failed to loaded the review")

    }
    return await response.json();
}