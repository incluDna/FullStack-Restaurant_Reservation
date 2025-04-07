export default async function editReview(
    token: string,
    id: string,
    updatedFields: {
        reviewStar?: number;
        Description?: string;
    }
) {
    try {
        const response = await fetch(`https://restaurant-reservation-backend-blush.vercel.app/api/v1/reviews/${id}`, {
            method: "PUT",  
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`,
            },
            body: JSON.stringify(updatedFields),
        });

        if (!response.ok) {
            const errorMessage = await response.text();
            throw new Error(`Failed to update review: ${errorMessage}`);
        }

        return await response.json();  
    } catch (error) {
        console.error("Update review error:", error);
        throw error;
    }
}