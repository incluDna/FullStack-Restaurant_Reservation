// lib/queue.ts
export async function createQueue({
    restaurantId,
    seatCount,
    token,
  }: {
    restaurantId: string;
    seatCount: number;
    token: string; // JWT access token
  }) {
    const res = await fetch(`/api/restaurants/${restaurantId}/queues`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ seatCount }),
    });
  
    const data = await res.json();
  
    if (!res.ok) {
      throw new Error(data.message || "ไม่สามารถเข้าคิวได้");
    }
  
    return data;
  }
  