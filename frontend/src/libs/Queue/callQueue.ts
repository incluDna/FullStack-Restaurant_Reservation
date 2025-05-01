export default async function callQueue(token:string | null, QueueId:string,){
    const response =await fetch(`${process.env.BACKEND_URL}/api/queues/${QueueId}`,{
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body:JSON.stringify({queueStatus:"calling"})
      })

    if(!response.ok){
        throw new Error("cannot update queue status")
    }
    return await response.json();
}