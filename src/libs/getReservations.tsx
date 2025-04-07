import { resolve } from "path";

export default async function getReservations(token:string) {

    const response=await fetch("https://restaurant-reservation-backend-blush.vercel.app/api/v1/reservations", {
        method:"GET",
        headers:{
            authorization:`Bearer ${token}`,
        }
    })

    if(!response.ok){
        throw new Error("failed to loaded the reservations")
    }
    return await response.json();
}