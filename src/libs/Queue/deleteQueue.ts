export default async function deleteQueue (token:string, queueID:string,) {
    //for admin and employee
    const response=await fetch(`${process.env.BACKEND_URL}/api/queues/${queueID}`, {
        method:"DELETE",
        headers:{
            "Content-Type": "application/json", 
            authorization:`Bearer ${token}`,
        },
    });

    if(!response.ok){
        throw new Error("failed to delete the menu")
    }
    return await response.json();
}