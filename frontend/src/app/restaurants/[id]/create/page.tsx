'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { getAuthCookie } from '@/libs/User/getAuthCookie';
import getUserProfile from '@/libs/User/getUserProfile';
import addMenu from '@/libs/Menu/addMenu';
import { useNotice } from "@/components/NoticeContext";

const tagOptions: { label: string; description: string }[] = [
  { label: "Spicy", description: "Dish is hot and flavorful with spices." },
  { label: "Vegan", description: "Contains no animal products." },
  { label: "Gluten-free", description: "Made without gluten-containing ingredients." },
  { label: "Dairy-free", description: "Free from dairy products." },
  { label: "Nut-free", description: "Prepared without nuts; safe for nut allergies." },
  { label: "Halal", description: "Meets Halal dietary requirements." },
  { label: "Locally-sourced", description: "Ingredients sourced from local producers." },
  { label: "Signature-dish", description: "A special dish unique to the restaurant." },
  { label: "Seasonal", description: "Made with seasonal ingredients." },
  { label: "Sustainable", description: "Eco-friendly and sustainably sourced ingredients." },
  { label: "Vegetarian", description: "No meat, may include dairy or eggs." },
];

export default function CreateMenuPage() {
  const { id } = useParams();
  const router = useRouter();

  const [name, setName] = useState('');
  const [image, setImage] = useState('');
  const [price, setPrice] = useState('');
  const [type, setType] = useState('dish');
  const [description, setDescription] = useState('');
  const [tag, setTag] = useState('');
  const [tags, setTags] = useState<string[]>([]);

  const [token, setToken] = useState<string | null>(null);
  const [profile, setProfile] = useState<any>(null);
  const { showNotice } = useNotice();
  useEffect(() => {
    async function fetchToken() {
      try {
        const data = await getAuthCookie();
        if (data.success) {
          setToken(data.token);
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


  const addTag = () => {
    if (tag && !tags.includes(tag) && tags.length < 8) {
      setTags([...tags, tag]);
    }
  };

  const removeTag = (tagToRemove: string) => {
    setTags(tags.filter((t) => t !== tagToRemove));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (name.trim().length < 2 || name.trim().length > 30) {
      showNotice("Menu name must be 2-30 characters long", false);
      return;
    }

    if (description.length > 300) {
      showNotice("Description must not exceed 300 characters", false);
      return;
    }

    const restaurantId = typeof id === 'string' ? id : id?.[0];
    try {
      if (!restaurantId) throw new Error("Missing restaurant ID");
      if (!token) throw new Error("Unauthorized");

      const menuData = {
        name,
        picture: image,
        price: Number(price),
        type,
        description,
        tags,
        restaurant: restaurantId,
        tag: tags
      };


      if (!restaurantId) throw new Error("Missing restaurant ID");
      if (!token) throw new Error("Missing unauthorized");
      await addMenu(token, restaurantId, menuData);
      showNotice("Menu added successfully!", true);
      router.push(`/restaurants/${restaurantId}`);
    } catch (err) {
      console.error("Failed to create menu:", err);
      showNotice("Error occurred while adding the menu", false);
    }
  };

  return (
    <main className="min-h-screen bg-white">
      <div className="max-w-4xl mx-auto px-6 pt-24 pb-12">
        <h1 className="text-3xl font-bold text-center mb-10">Add Menu</h1>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block font-medium">Menu Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              maxLength={30}
              className="w-full border px-3 py-2"
              placeholder="Menu Name"
              required
            />
          </div>

          <div>
            <label className="block font-medium">Image URL</label>
            <input
              type="text"
              value={image}
              onChange={(e) => setImage(e.target.value)}
              className="w-full border px-3 py-2"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-6">
            <div>
              <label className="block font-medium">Price (฿)</label>
              <input
                type="number"
                min={1}
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                className="w-full border px-3 py-2"
                required
              />
            </div>
            <div>
              <label className="block font-medium">Type</label>
              <select
                value={type}
                onChange={(e) => setType(e.target.value)}
                className="w-full border px-3 py-2"
              >
                <option value="dish">Dish</option>
                <option value="drink">Drink</option>
                <option value="set">Set</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block font-medium">Description <span className="text-sm text-gray-500">(≤ 300 characters)</span></label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              maxLength={300}
              className="w-full border px-3 py-2"
              rows={3}
              required
            />
          </div>

          <div>
            <label className="block font-medium">Tag</label>
            <div className="flex gap-2 items-center mt-1">
              <select
                value={tag}
                onChange={(e) => setTag(e.target.value)}
                className="border px-3 py-2"
              >
                <option value="">Select a tag</option>
                {tagOptions.map((t) => (
                  <option key={t.label} value={t.label} title={t.description}>
                    {t.label} - {t.description}
                  </option>
                ))}
              </select>
              <button
                type="button"
                onClick={addTag}
                disabled={tags.length >= 8}
                className="bg-gray-800 text-white px-4 py-2"
              >
                Add
              </button>
            </div>

            <div className="mt-4 flex gap-2 flex-wrap">
              {tags.map((t, i) => (
                <button
                  key={i}
                  onClick={() => removeTag(t)}
                  type="button"
                  className="w-fit h-8 bg-gray-300 rounded hover:bg-red-400"
                  title={`Remove ${t}`}
                >
                  {t}
                </button>
              ))}
            </div>

            {tags.length >= 8 && (
              <p className="text-sm text-red-500 mt-1">You can add up to 8 tags only.</p>
            )}
          </div>

          <button
            type="submit"
            className="block mx-auto mt-6 bg-[#F89640] text-white px-8 py-2 text-lg"
          >
            Submit
          </button>
        </form>
      </div>
    </main>
  );
}
