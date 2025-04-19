'use client';

import { useParams, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import MenuCard from '@/components/MenuCard';
import Link from 'next/link';

type MenuType = {
  _id: string;
  name: string;
  price: number;
  description: string;
  image: string;
};

export default function RestaurantMenuPage() {
  const { id: restaurantId } = useParams();
  const router = useRouter();
  const [menus, setMenus] = useState<MenuType[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMenus = async () => {
      try {
        const res = await fetch(`/api/restaurants/${restaurantId}/menus`);
        const data = await res.json();
        setMenus(data);
      } catch (err) {
        console.error('Failed to fetch menus:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchMenus();
  }, [restaurantId]);

  const handleDelete = async (menuId: string) => {
    const confirmDel = confirm('Are you sure you want to delete this menu?');
    if (!confirmDel) return;

    try {
      await fetch(`/api/menus/${menuId}`, {
        method: 'DELETE',
        headers: {
          Authorization: 'Bearer your_token_here',
        },
      });
      setMenus(menus.filter(menu => menu._id !== menuId));
    } catch (err) {
      alert('Failed to delete menu');
    }
  };

  if (loading) return <p className="p-6">Loading menus...</p>;

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Menu</h1>
      </div>

      <div className="flex flex-wrap gap-6">
        {menus.map((menu) => (
          <MenuCard
            key={menu._id}
            id={menu._id}
            name={menu.name}
            price={menu.price}
            description={menu.description}
            image={menu.image}
            onDelete={() => handleDelete(menu._id)}
            onEdit={() => router.push(`/restaurants/${restaurantId}/menu/${menu._id}/edit`)}
            isEmployee={true}
          />
        ))}
      </div>
    </div>
  );
}
