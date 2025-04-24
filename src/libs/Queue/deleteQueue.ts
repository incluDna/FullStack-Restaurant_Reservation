export default async function deleteQueue(
    token: string,
    id: string
  ) {
    try {
      const response = await fetch(`${process.env.BACKEND_URL}/api/queues/${id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
      });
  
      if (!response.ok) {
        const errorMessage = await response.text();
        throw new Error(`Failed to delete queue: ${errorMessage}`);
      }
  
      // ถ้าเป็น 204 No Content ก็ไม่ต้อง .json()
      if (response.status === 204) return null;
  
      return await response.json();
    } catch (error) {
      console.error("Delete queue error:", error);
      throw error;
    }
  }
  