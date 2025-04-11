import { Dayjs } from "dayjs";

export default async function editReservation(
  token: string,
  id: string,

  resDate?: Dayjs,
  quantity?: string
) {
  const body: any = {
  };

  if (resDate) body.resDate = resDate;
  if (quantity) body.quantity = quantity;

  console.log('token:',token)
  console.log('id:',id)
  console.log('resDate:',resDate??'')
  console.log('quantity:',quantity??'')

  const response = await fetch(
    `${process.env.BACKEND_URL}/api/reservations/${id}`,
    {
      method: "PUT",
      headers: {
        authorization: `Bearer ${token}`,
        "Content-Type": "application/json", 
      },
      body: JSON.stringify(body),
    }
  );

  if (!response.ok) {
    throw new Error("failed to add the reservation");
  }
  return await response.json();
}