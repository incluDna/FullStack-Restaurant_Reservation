export default async function deleteReview(
    token: string,
    id: string,

) {
    try {
        const response = await fetch(`http://localhost:5000/api/reviews/${id}`, {
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