export default async function deleteReview(
    token: string,
    id: string,

) {
    try {
        const response = await fetch(`https://restaurant-reservation-backend-blush.vercel.app/api/v1/reviews/${id}`, {
            method: "Delete",  
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`,
            },
        });

        if (!response.ok) {
            const errorMessage = await response.text();
            throw new Error(`Failed to delete review: ${errorMessage}`);
        }

        return await response.json();  
    } catch (error) {
        console.error("Delete review error:", error);
        throw error;
    }
}