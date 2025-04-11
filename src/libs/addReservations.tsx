import { Dayjs } from "dayjs";

export default async function addReservation(token:string,
    resDate:Dayjs,userId:string,restaurantId:string,quantity:string) {

    const response=await fetch(`${process.env.BACKEND_URL}/api/reservations/${restaurantId}`, {
        method:"POST",
        headers:{
            authorization:`Bearer ${token}`,
            "Content-Type": "application/json",

        },
        body:JSON.stringify({
            resDate: resDate,
            user: userId,
            quantity: quantity,
        })
    });
    if(!response.ok){
        throw new Error("failed to add the reservation")
    }
    return await response.json();
}