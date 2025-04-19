'use client';

import { useParams, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import MenuForm from '@/components/MenuForm';

export default function EditMenuPage() {
  const { restaurantId, menuId } = useParams();
  const router = useRouter();
  const [menu, setMenu] = useState<any>(null);

  useEffect(() => {
    fetch(`/api/menus/${menuId}`)
      .then((res) => res.json())
      .then((data) => setMenu(data));
  }, [menuId]);

  const handleUpdate = async (data: any) => {
    const res = await fetch(`/api/menus/${menuId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Bearer your_token_here',
      },
      body: JSON.stringify(data),
    });

    if (res.ok) {
      router.push(`/myRestaurant/${restaurantId}/menu`);
    } else {
      const err = await res.json();
      alert('Error: ' + err.message);
    }
  };

  if (!menu) return <p className="p-4">Loading...</p>;

  return (
    <div className="p-8 max-w-xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Edit Menu</h1>
      <MenuForm defaultValues={menu} onSubmit={handleUpdate} />
    </div>
  );
}
