export default async function tickQueue(token:string | null, QueueId:string,){
    const response =await fetch(`${process.env.BACKEND_URL}/api/queues/${QueueId}`,{
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body:JSON.stringify({queueStatus:"completed"})
      })

    if(!response.ok){
        throw new Error("cannot update queue status")
    }
    return await response.json();
}