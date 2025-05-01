export async function createQueue({
  restaurantId,
  seatCount,
  token,
  queueStatus,
}: {
  restaurantId: string;
  seatCount: number;
  token: string;
  queueStatus: string;
}) {
  try {
    const res = await fetch(`${process.env.BACKEND_URL}/api/restaurants/${restaurantId}/queues`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        seatCount,
        queueStatus,
      }),
    });

    if (!res.ok) {
      const errorDetails = await res.json();
      return {
        success: false,
        message: errorDetails.message || "Failed to enter the queue",
      };
    }

    const data = await res.json();
    return { success: true, data };
  } catch (error) {
    console.error("Error to get in line:", error);
    return {
      success: false,
      message: "An error occurred while enter the queue",
    };
  }
}
