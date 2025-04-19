import { Dayjs } from "dayjs";

export default async function addReservation(
  token: string,
  resDate: Date,
  userId: string,
  restaurantId: string,
  seatCount: number
) {
  // Log the input to verify
  console.log("Reservation Date:", resDate);
  
  const formattedDate = resDate.toISOString(); 
  console.log("Formatted Reservation Date (ISO 8601):", formattedDate);
  const response = await fetch(`${process.env.BACKEND_URL}/api/restaurants/${restaurantId}/reservations`, {
    method: "POST",
    headers: {
      authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      resDate: formattedDate,  
      user: userId,
      seatCount: seatCount,
    }),
  });

  
  if (!response.ok) {
    throw new Error("Failed to add the reservation");
  }

  return await response.json();
}
