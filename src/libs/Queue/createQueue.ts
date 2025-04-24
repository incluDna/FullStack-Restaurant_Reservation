export async function createQueue({
    restaurantId,
    seatCount,
    token,
    queueStatus
  }: {
    restaurantId: string;
    seatCount: number;
    token: string;
    queueStatus: string;
  }) {
    const res = await fetch(`${process.env.BACKEND_URL}/api/restaurants/${restaurantId}/queues`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ 
        seatCount: seatCount,
        queueStatus: queueStatus
      }),
    });
  
    const data = await res.json();
  
    if (!res.ok) {
      throw new Error(data.message || "Cannot enter the queue, please try again later");
    }
  
    return data;
  }
  