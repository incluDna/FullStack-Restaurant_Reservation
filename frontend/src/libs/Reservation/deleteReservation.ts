
export default async function deleteReservation(
    token: string,
    id: string,

) {
    try {
        const response = await fetch(`${process.env.BACKEND_URL}/api/reservations/${id}`, {
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

        return await response;  
    } catch (error) {
        console.error("Delete reservation error:", error);
        throw error;
    }
}