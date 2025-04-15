import getRestaurants from "./getRestaurants";
import getMeanReviews from "./getMeanReview";
import { Restaurant, RestaurantJSON } from "../../interfaces";

export default async function getBestReviewedRestaurant(): Promise<Restaurant | null> {
  const limit = 10;
  let page = 1;
  let allRestaurants: Restaurant[] = [];
  let hasMore = true;

  try {
    // 1. Fetch all restaurants across pages
    while (hasMore) {
      const restaurantResponse: RestaurantJSON = await getRestaurants(page, limit);
      const restaurants = restaurantResponse.data;

      if (!restaurants || restaurants.length === 0) {
        hasMore = false;
      } else {
        allRestaurants.push(...restaurants);
        page++;
        if (page > restaurantResponse.totalPages) {
          hasMore = false;
        }
      }
    }

    if (allRestaurants.length === 0) return null;

    // 2. Fetch mean reviews for all restaurants
    const ratedRestaurants = await Promise.all(
      allRestaurants.map(async (restaurant) => {
        const rating = await getMeanReviews(restaurant.id);
        return {
          ...restaurant,
          rating: rating ?? 0,
        };
      })
    );

    // 3. Sort by rating and return the best one
    ratedRestaurants.sort((a, b) => (b.rating ?? 0) - (a.rating ?? 0));
    return ratedRestaurants[0];

  } catch (error) {
    console.error("Error getting best-rated restaurant:", error);
    return null;
  }
}
