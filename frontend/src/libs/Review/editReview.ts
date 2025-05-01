export default async function editReview(
    token: string,
    id: string,
    reviewStar?: number,
    reviewText?: string
    
) {
    const updatedFields: any = {
    };
    if (reviewStar) updatedFields.reviewStar = String(reviewStar);
    if (reviewText) updatedFields.reviewText = reviewText;

    console.log(updatedFields)
    try {
        const response = await fetch(`${process.env.BACKEND_URL}/api/reviews/${id}`, {
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