export default async function getQueuePosition(
    token: string,
    restaurantId?: string,
    queueID?: string
  ): Promise<number> {
    if (!restaurantId || !queueID) {
      throw new Error("Missing restaurantId or queueID");
    }
  
    const response = await fetch(
      `${process.env.BACKEND_URL}/api/restaurants/${restaurantId}/queues/${queueID}/position`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
  
    if (!response.ok) {
      throw new Error("Failed to load queue position");
    }
  
    const data = await response.json();
  
    if (typeof data.position !== "number") {
      throw new Error("Position not found in response");
    }
  
    return data.position;
  }
  