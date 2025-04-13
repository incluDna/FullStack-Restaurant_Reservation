'use client';

import { useState, useEffect } from "react";
import RestaurantCard from "@/components/restaurantCard";
import { Restaurant, RestaurantJSON } from "../../../interfaces";
import getRestaurants from "@/libs/getRestaurants";
import { useRouter } from "next/navigation";
import { ArrowLeft, ArrowRight } from "lucide-react";

export default function RestaurantCatalog() {
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);  
  const [totalPages, setTotalPages] = useState(1);  
  const router = useRouter(); 

  useEffect(() => {
    const fetchRestaurants = async () => {
      try {
        const response: RestaurantJSON = await getRestaurants(page); 
        setRestaurants(response.data);  
        setTotalPages(response.totalPages);  
        setLoading(false);
      } catch (error) {
        console.error("Error fetching restaurants:", error);
        setError("Error fetching restaurants.");
        setLoading(false);
      }
    };

    fetchRestaurants();
  }, [page]); 

  const handleGoBack = () => {
    if (page > 1) {
      const prevPage = page - 1;
      setPage(prevPage);

      router.push(`/restaurants?page=${prevPage}`);
    }
  };

  const handleSeeMore = () => {
    if (page <= totalPages) {
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
    <main className="flex flex-col w-full max-w-[var(--collection-1-content-width)] min-h-[var(--collection-1-content-height)] items-start gap-2.5 p-5">
      <section className="flex flex-wrap justify-center gap-[var(--size-space-600)] p-[var(--size-space-1600)] w-full bg-white">
        {restaurants.map((restaurant) => (
          <RestaurantCard
            key={restaurant.id}
            restaurantName={restaurant.name}
            imgSrc={restaurant.picture}
            location={`${restaurant.address}, ${restaurant.district}, ${restaurant.province}`}
            openCloseTime={`${restaurant.openTime} - ${restaurant.closeTime}`}
            rating={restaurant.rating || 0}
            currentQueue={restaurant.queue || "0"}
          />
        ))}
      </section>

      <div className="fixed bottom-0 left-0 right-0 z-50 flex items-center justify-between gap-4 pt-[var(--size-space-1600)] pb-2.5 px-2.5 w-full">
        <button
          className="flex items-center justify-center gap-4 pr-[var(--size-space-1000)] pl-[var(--size-space-1000)] py-2 bg-[#C2C2C2] rounded-[75px] border-none text-[24px] font-semibold w-full max-w-[200px] ml-20 mt-16"
          onClick={handleGoBack}
        >
          <ArrowLeft className="h-6 w-6" />
          <span className="font-semibold text-black text-[24px] leading-[56px]">
            .. go back
          </span>
        </button>

        <button
          className="flex items-center justify-center gap-4 pr-[var(--size-space-1000)] pl-[var(--size-space-1000)] py-2 bg-[#C2C2C2] rounded-[75px] border-none text-[24px] font-semibold w-full max-w-[200px] mr-8 mt-16"
          onClick={handleSeeMore}
          disabled={page >= totalPages || loading}
        >
          <span className="font-semibold text-black text-[24px] leading-[56px]">
            See More ..
          </span>
          <ArrowRight className="h-6 w-6" />
        </button>
      </div>
    </main>
  );
}
