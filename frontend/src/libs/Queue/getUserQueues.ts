import { resolve } from "path";

export default async function getUserQueues(token:string) {

    const response=await fetch(`${process.env.BACKEND_URL}/api/queues`, {
        method:"GET",
        headers:{
            authorization:`Bearer ${token}`,
        }
    })

    if(!response.ok){
        throw new Error("failed to loaded the queues")
    }
    return await response.json();
}