
export default async function deleteQueue(token: string, id: string) {
    const res = await fetch(`${process.env.BACKEND_URL}/api/queues/${id}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  
    if (!res.ok) {
      throw new Error("Failed to delete queue");
    }
  
    return await res.json();
  }
  