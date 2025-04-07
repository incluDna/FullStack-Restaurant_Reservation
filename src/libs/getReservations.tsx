import { resolve } from "path";

export default async function getReservations(token:string) {

    const response=await fetch("https://restaurant-reservation-backend-blush.vercel.app/api/v1/reservations", {
        method:"GET",
        headers:{
            authorization:`Bearer ${'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY3ZjJhZmNhNjY3MzYyMGQxNGI5NmUyOSIsImlhdCI6MTc0NDAyNDk2OSwiZXhwIjoxNzQ2NjE2OTY5fQ.wn__6CeJd4fTH5u5Yd5oHDgsPO-cUmcRiYoTHzEiUqs'}`,
        }
    })

    if(!response.ok){
        throw new Error("failed to loaded the reservations")
    }
    return await response.json();
}