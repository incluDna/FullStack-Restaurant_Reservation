export default async function getRestaurants(page = 1, limit = 10) {
  try {
    const allRestaurants: any[] = [];
    let currentPage = 1;
    let hasMore = true;

    // Loop through pages until no more data
    while (hasMore) {
      const res = await fetch(`${process.env.BACKEND_URL}/api/restaurants?page=${currentPage}&limit=${limit}&sort=name`);
      if (!res.ok) throw new Error(`Failed at page ${currentPage}`);

      const data = await res.json();
      allRestaurants.push(...data.data);

      hasMore = data.data.length > 0 && currentPage < data.totalPages;
      currentPage++;
    }

    // Deduplicate by name + address (adjust as needed)
    const unique = Array.from(new Map(allRestaurants.map(item => [item.name + item.address, item])).values());

    // Sort alphabetically
    const sorted = unique.sort((a, b) => a.name.localeCompare(b.name));

    // Paginate locally
    const start = (page - 1) * limit;
    const paginated = sorted.slice(start, start + limit);

    return {
      success: true,
      count: sorted.length,
      totalPages: Math.ceil(sorted.length / limit),
      data: paginated
    };
  } catch (error) {
    console.error("Error fetching full restaurant list:", error);
    throw error;
  }
}
