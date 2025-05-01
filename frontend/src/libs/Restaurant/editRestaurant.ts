export default async function editRestaurants(
    token: string,
    id: string,
    updatedFields: {
        name?: string;
        address?: string;
        district?: string;
        province?: string;
        postalcode?: string;
        tel?: string;
        region?: string;
        opentime?: string;
        closetime?: string;
        picture?: string;
    }
) {
    try {
        const response = await fetch(`${process.env.BACKEND_URL}/api/restaurants/${id}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`,
            },
            body: JSON.stringify(updatedFields),
        });

        if (!response.ok) {
            const errorMessage = await response.text();
            throw new Error(`Failed to update restaurant: ${errorMessage}`);
        }

        return await response.json(); 
    } catch (error) {
        console.error("Update restaurant error:", error);
        throw error;
    }
}