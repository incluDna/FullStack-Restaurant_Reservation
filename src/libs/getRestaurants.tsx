export default async function getRestaurants(page: number = 1, limit: number = 10) {
  try {
    const url = `${process.env.BACKEND_URL}/api/restaurants/?page=${page}&limit=${limit}&timestamp=${new Date().getTime()}`;
    
    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(`Failed to fetch restaurants: ${response.statusText}`);
    }
    return await response.json();
  } catch (error) {
    console.error("Error fetching restaurants:", error);
    throw error;
  }
}
