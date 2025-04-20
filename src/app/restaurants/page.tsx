'use client';

import { useState, useEffect } from "react";
import RestaurantCard from "@/components/restaurantCard";
import { MeanReview, Restaurant, RestaurantJSON } from "../../../interfaces";
import getRestaurants from "@/libs/getRestaurants";
import getMeanReviews from "@/libs/getMeanReview";
import { useRouter , useSearchParams } from "next/navigation";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { motion } from "framer-motion";
import { getAuthCookie } from "@/libs/getAuthCookie";
import getUserProfile from "@/libs/getUserProfile";
export default function RestaurantCatalog() {
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [token, setToken] = useState<string | null>(null);
  const [role, setRole] = useState<string | null>(null);
  const [profile, setProfile] = useState<any>(null);
  const [totalPages, setTotalPages] = useState(1);
  const [reviewsMap, setReviewsMap] = useState<{ [key: string]: number | null }>({}); // Store reviews for each restaurant

  const router = useRouter();
  const searchParams = useSearchParams();
  const pageParam = searchParams.get('page'); // string | null
  useEffect(() => {
    setLoading(false);
    const parsedPage = parseInt(pageParam || '');
    if (!isNaN(parsedPage)) {
      setPage(parsedPage);
    }
  }, [pageParam]);
  useEffect(() => {
    const fetchRestaurants = async () => {
      try {
        const response: RestaurantJSON = await getRestaurants(page);
        setRestaurants(response.data);
        setTotalPages(response.totalPages);
        setLoading(false);

        // Fetch reviews for each restaurant
        const fetchReviews = async () => {
          const reviewsPromises = response.data.map(async (restaurant) => {
            try {
              const reviewResponse = await getMeanReviews(restaurant._id || "");
              const review = reviewResponse.count == 0 ? null : reviewResponse.totalRating;
              console.log(`Fetched review for restaurant ${restaurant._id}:`, review);
              return { id: restaurant._id, review };
            } catch (err) {
              // If getMeanReviews fails, default to review = null
              return { id: restaurant._id, review: null };
            }
          });

          const reviews = await Promise.all(reviewsPromises);
          // console.log("Reviews fetched:", reviews); 

          const reviewsMap = reviews.reduce<{ [key: string]: number | null }>((acc, { id, review }) => {
            if (id !== undefined) {
              acc[id.toString()] = review;
            }
            return acc;
          }, {});

          // console.log("Reviews Map:", reviewsMap); 
          setReviewsMap(reviewsMap);
        };

        fetchReviews();
      } catch (error) {
        console.error("Error fetching restaurants:", error);
        setError("Error fetching restaurants.");
        setLoading(false);
      }
    };

    fetchRestaurants();
  }, [page]);
  
  useEffect(() => {
    async function fetchToken() {
      try {
        const data = await getAuthCookie();
        if (data.success) {
          setToken(data.token);
          setRole(data.role || null);
          const userProfile = await getUserProfile(data.token);
          setProfile(userProfile);
        } else {
          console.error("Auth error:", data.error);
        }
      } catch (err) {
        console.error("Failed to fetch auth cookie", err);
      }
    }

    fetchToken();
  }, []);

  const handleGoBack = () => {
    if (page > 1) {
      const prevPage = page - 1;
      setPage(prevPage);
      router.push(`/restaurants?page=${prevPage}`);
    }
  };

  const handleSeeMore = () => {
    if (page < totalPages) {
      const nextPage = page + 1;
      setPage(nextPage);
      router.push(`/restaurants?page=${nextPage}`);
    }
  };

  if (loading) {
    return <p>Loading restaurants...</p>;
  }

  if (error) {
    return <p>{error}</p>;
  }

  return (
    <main className="flex flex-col w-full items-start pt-20">
      {profile?.data?.role === 'admin' && (
        <div className="flex justify-end w-full pr-16 mb-8">
          <motion.button
            whileHover={{ backgroundColor: "black", scale: 1.02 }}
            transition={{ duration: 0.3 }}
            onClick={() => router.push(`/restaurants/create`)}
            className="w-[65px] h-[65px] bg-[#3d3c3a] text-white text-xl border-0 rounded-none"
          >
          </motion.button>
        </div>
      )}
      <section className="flex flex-wrap justify-center w-full bg-white">
        {restaurants.map((restaurant) => {
          const restaurantId = restaurant._id?.toString() || '';
          const reviewRating = reviewsMap[restaurantId] ?? null;

          return (
            <RestaurantCard
              key={restaurantId}
              restaurantsID={restaurantId}
              restaurantName={restaurant.name}
              imgSrc={restaurant.picture}
              location={`${restaurant.address}, ${restaurant.district}, ${restaurant.province}`}
              openCloseTime={`${restaurant.openTime} - ${restaurant.closeTime}`}
              rating={reviewRating}
              currentQueue={restaurant.queue || "0"}
            />
          );
        })}
      </section>

      <div className="flex items-center justify-between gap-4 pt-[var(--size-space-1600)] pb-2.5 px-2.5 w-full mb-12">
        {
          page != 1 ?
            <motion.button className="flex items-center justify-center gap-4 pr-[var(--size-space-1000)] pl-[var(--size-space-1000)] py-2 bg-[#C2C2C2] rounded-[75px] border-none text-[24px] font-semibold w-full max-w-[200px] ml-20 mt-12"
              initial={{ backgroundColor: "#C2C2C2" }}
              whileHover={{ backgroundColor: "#999", scale: 1.02 }}
              transition={{ duration: 0.3 }}
              onClick={handleGoBack}
            >
              <ArrowLeft className="h-6 w-6" />
              <span className="font-semibold text-black text-[24px] leading-[56px]">
                .. go back
              </span>
            </motion.button>
            : <div className="flex items-center justify-center gap-4 pr-[var(--size-space-1000)] pl-[var(--size-space-1000)] py-2 w-full max-w-[200px] ml-20 mt-12"/>
        }
        {

          (page < totalPages - 1) ?
            <motion.button className="flex items-center justify-center gap-4 pr-[var(--size-space-1000)] pl-[var(--size-space-1000)] py-2 bg-[#C2C2C2] rounded-[75px] border-none text-[24px] font-semibold w-full max-w-[200px] mr-8 mt-12 hover:bg-[#999]"
              initial={{ backgroundColor: "#C2C2C2" }}
              whileHover={{ backgroundColor: "#999", scale: 1.02 }}
              transition={{ duration: 0.3 }}
              onClick={handleSeeMore}>
              <span className="font-semibold text-black text-[24px] leading-[56px]">
                See More ..
              </span>
              <ArrowRight className="h-6 w-6" />
            </motion.button>
            : null
        }
      </div>
    </main>
  );
}
