export default async function getMeanReviews(id: string) {
    try {
        const response = await fetch(`${process.env.BACKEND_URL}/api/reviews/means/${id}`, {
            method: "GET",
        });

        if (!response.ok) {
            return null;
        }

        const data = await response.json();
        return data?.totalRating ?? null; 
    } catch (error) {
        console.error("Error fetching reviews:", error);
        return null; 
    }
}
