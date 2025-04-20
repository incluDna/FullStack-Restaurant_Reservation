'use client';

import { useParams } from 'next/navigation';
import { useState } from 'react';
//ม้อกกุ้กกู้
const mockMenu = [
  {
    name: 'ข้าวไข่เจียว',
    price: 40,
    description: 'ข้าวไข่เจียวกรอบนอกนุ่มใน',
    image: 'https://i1.sndcdn.com/artworks-x3OYFgIzJ5lJUnXX-AWGWyQ-t500x500.png',
    type: 'dish',
    tags: ['popular', 'egg'],
  },
  {
    name: 'ชามะนาว',
    price: 25,
    description: 'ชาเข้มข้นกลิ่นมะนาวสดชื่น',
    image: 'https://i1.sndcdn.com/artworks-x3OYFgIzJ5lJUnXX-AWGWyQ-t500x500.png',
    type: 'drink',
    tags: ['cool', 'refreshing'],
  },
  {
    name: 'ข้าวกะเพรา + น้ำ',
    price: 60,
    description: 'ชุดประหยัดพร้อมเครื่องดื่ม',
    image: 'https://i1.sndcdn.com/artworks-x3OYFgIzJ5lJUnXX-AWGWyQ-t500x500.png',
    type: 'set',
    tags: ['spicy', 'combo'],
  }
];

const tabOptions = ['dish', 'drink', 'set'];

export default function RestaurantMenuPage() {
  const { id } = useParams();
  const [activeTab, setActiveTab] = useState('dish');

  const filteredMenu = mockMenu.filter(item => item.type === activeTab);

  return (
    <main className="max-w-6xl mx-auto px-4 pt-20">
      <h1 className="text-3xl font-bold mb-8 text-center">Menu {id}</h1>

      {/* Tabs */}
      <div className="flex justify-center mb-8 gap-4">
        {tabOptions.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-6 py-2 border-b-4 text-lg ${
              activeTab === tab
                ? 'border-[#F89640] text-[#F89640]'
                : 'border-transparent text-gray-500'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {filteredMenu.map((item, i) => (
          <div key={i} className="bg-white shadow rounded-lg overflow-hidden flex flex-col">
            <img src={item.image} alt={item.name} className="w-full h-48 object-cover" />

            <div className="p-4 flex flex-col justify-between h-full">
              <div>
                <h2 className="text-lg font-semibold">{item.name}</h2>
                <p className="text-sm text-gray-600 mb-1">{item.description}</p>
                <p className="text-green-700 font-bold">{item.price} ฿</p>
              </div>

              {/* Tags */}
              <div className="flex flex-wrap gap-2 mt-3">
                {item.tags.map((tag, t) => (
                  <div key={t} className="w-5 h-5 bg-gray-300 rounded" title={tag}></div>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </main>
  );
}
