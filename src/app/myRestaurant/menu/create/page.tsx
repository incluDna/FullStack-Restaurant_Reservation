'use client';

import MenuForm from '@/components/MenuForm';
import { useRouter } from 'next/navigation';

export default function CreateMenuPage() {
  const router = useRouter();

  const handleCreate = async (data: any) => {
    const res = await fetch('http://localhost:3000/api/menus', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer your_token_here' // เปลี่ยนเป็น token จริง
      },
      body: JSON.stringify(data)
    });

    if (res.ok) {
      router.push('/myRestaurant/menu');
    } else {
      const err = await res.json();
      alert('Error: ' + err.message);
    }
  };

  return (
    <div className="p-8 max-w-xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Create New Menu</h1>
      <MenuForm onSubmit={handleCreate} />
    </div>
  );
}
