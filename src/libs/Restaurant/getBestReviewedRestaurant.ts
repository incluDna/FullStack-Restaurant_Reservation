import getRestaurants from "./getRestaurants";
import getMeanReviews from "../Review/getMeanReview";
import { Restaurant, RestaurantJSON } from "../../../interfaces";

export default async function getBestReviewedRestaurant(): Promise<Restaurant | null> {
  let page = 1;
  const limit = 10;
  let allRestaurants: Restaurant[] = [];

  try {
    // 1. Fetch all restaurants across pages
    while (true) {
      const restaurantResponse: RestaurantJSON = await getRestaurants(page);
      const restaurants = restaurantResponse.data;

      console.log(`Page ${page} - received ${restaurants.length} restaurants`);

      if (!restaurants || restaurants.length === 0) break;

      allRestaurants.push(...restaurants);

      if (page >= restaurantResponse.totalPages) break;

      page++;
    }
    // console.log(allRestaurants.length)
    // allRestaurants.forEach((r) => {
    //   console.log(
    //     JSON.stringify({ name: r.name })
    //   );
    // });

    if (allRestaurants.length === 0) return null;

    // 2. Fetch mean reviews for all restaurants
    const ratedRestaurants = await Promise.all(
      allRestaurants.map(async (restaurant) => {
        const ratingData = await getMeanReviews(restaurant._id || "");
        const rating = parseFloat(ratingData?.totalRating) || 0;
        return {
          ...restaurant,
          rating,
        };
      })
    );

    // 3. Sort by rating and return the best one
    ratedRestaurants.sort((a, b) => (b.rating ?? 0) - (a.rating ?? 0));

    // Debug
    console.log("=== SORTED RESTAURANTS ===");
    ratedRestaurants.forEach((r, i) => {
      console.log(`${i + 1}. ${r.name} → rating:`, r.rating, typeof r.rating);
    });

    return ratedRestaurants[0];
  } catch (error) {
    console.error("Error getting best-rated restaurant:", error);
    return null;
  }
}
