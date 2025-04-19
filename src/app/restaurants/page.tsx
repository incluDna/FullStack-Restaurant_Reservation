'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';

type Restaurant = {
  _id: string;
  name: string;
  address: string;
  district: string;
  province: string;
  picture: string;
};

export default function RestaurantsPage() {
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);

  useEffect(() => {
    fetch('/api/restaurants')
      .then(res => res.json())
      .then(setRestaurants);
  }, []);

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6">All Restaurants</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {restaurants.map((res) => (
          <Link
            key={res._id}
            href={`/restaurants/${res._id}/menu`}
            className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition"
          >
            <img
              src={res.picture}
              alt={res.name}
              className="w-full h-48 object-cover"
            />
            <div className="p-4">
              <h2 className="text-xl font-semibold">{res.name}</h2>
              <p className="text-sm text-gray-600">
                {res.address}, {res.district}, {res.province}
              </p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
