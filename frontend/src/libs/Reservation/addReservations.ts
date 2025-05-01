import { Dayjs } from "dayjs";

export default async function addReservation(
  token: string,
  resDate: Date,
  userId: string,
  restaurantId: string,
  seatCount: number
) {
  const formattedDate = resDate.toISOString(); 
  console.log("Formatted Reservation Date (ISO 8601):", formattedDate);

  try {
    const response = await fetch(`${process.env.BACKEND_URL}/api/restaurants/${restaurantId}/reservations`, {
      method: "POST",
      headers: {
        authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        resDate: formattedDate,  
        restaurantId: restaurantId,
        user: userId,
        seatCount: seatCount,
      }),
    });

    if (!response.ok) {
      const errorDetails = await response.json();
      return { success: false, message: errorDetails.message || "Failed to add the reservation" };
    }

    const data = await response.json();
    return { success: true, data };
  } catch (error) {
    console.error("Error while adding reservation:", error);
    return { success: false, message: "An error occurred while adding the reservation" };
  }
}
