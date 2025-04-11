export default async function deleteRestaurant(
    token: string,
    id: string,

) {
    try {
        const response = await fetch(`${process.env.BACKEND_URL}/api/restaurants/${id}`, {
            method: "Delete",  
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`,
            },
        });

        if (!response.ok) {
            const errorMessage = await response.text();
            throw new Error(`Failed to delete restaurant: ${errorMessage}`);
        }

        return await response.json();  
    } catch (error) {
        console.error("Delete restaurant error:", error);
        throw error;
    }
}