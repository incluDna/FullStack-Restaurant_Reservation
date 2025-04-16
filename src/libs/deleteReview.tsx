export default async function deleteReview(
    id: string,
    token?: string,
) {
    try {
        const response = await fetch(`${process.env.BACKEND_URL}/api/reviews/${id}`, {
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