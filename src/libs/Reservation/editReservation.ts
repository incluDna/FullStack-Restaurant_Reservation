import { Dayjs } from "dayjs";

export default async function editReservation(
  token: string,
  id: string,
  resDate?: Date,
  quantity?: number
) {
  const body: any = {};

  if (resDate) body.resDate = resDate;
  if (quantity) body.seatCount = Number(quantity);

  console.log("token:", token);
  console.log("id:", id);
  console.log("resDate:", resDate ?? "");
  console.log("quantity:", quantity ?? "");

  const response = await fetch(
    `${process.env.BACKEND_URL}/api/reservations/${id}`,
    {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(body),
    }
  );

  // if (!response.ok) {
  //   throw new Error("failed to add the reservation");
  // }
  if (!response.ok) {
    const errorText = await response.text();
    console.error("Edit reservation failed:", errorText);
    throw new Error(`Failed to edit reservation: ${errorText}`);
  }

  return await response.json();
}
