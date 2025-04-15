import { Dayjs } from "dayjs";

export default async function addReservation(
  token: string,
  resDate: Date,
  userId: string,
  restaurantId: string,
  seatCount: number
) {
  // Log the input to verify


  // Convert resDate to ISO string if it's a Date object (it should already be a valid Date string when serialized in JSON)
  const formattedDate = new Date("2023-04-04T13:00:00.000Z");  // .toISOString() ensures the Date is in a proper ISO format
  console.log(userId, formattedDate, seatCount);

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
