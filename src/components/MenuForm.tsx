"use client";

import addMenu from "@/libs/Menu/addMenu";
import { useParams, useRouter } from "next/navigation";
import { useState } from "react";
import { useNotice } from "./NoticeContext";
export default function MenuForm({
  token,
  profile,
}: {
  token: any;
  profile: any;
}) {
  const { id } = useParams() as { id: string };
  const router = useRouter();
  const { showNotice } = useNotice();

  if (!id) return <div>Loading...</div>; // Or handle error

  const [form, setForm] = useState({
    name: "",
    restaurant: "",
    picture: "",
    price: 0,
    type: "",
    description: "",
    tag: [""],
  });

  const onSubmit = () => {
    if (form) {
      addMenu(token, id, form);
      showNotice("Add Menu Successfully!");
      router.push(`/restaurants/${id}`);
    }
  };

  return (
    <div>
      <div className="text-black"> HELLOO </div>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          onSubmit();
        }}
        className="space-y-4"
      >
        <input
          placeholder="Name"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
          className="input"
        />
        <input
          type="number"
          placeholder="Price"
          value={form.price}
          onChange={(e) =>
            setForm({ ...form, price: parseInt(e.target.value) || 0 })
          }
          className="input"
        />
        <textarea
          placeholder="Description"
          value={form.description}
          onChange={(e) => setForm({ ...form, description: e.target.value })}
          className="input"
        />
        <input
          placeholder="Image URL"
          value={form.picture}
          onChange={(e) => setForm({ ...form, picture: e.target.value })}
          className="input"
        />
        <button
          type="submit"
          className="bg-orange-500 text-white px-4 py-2 rounded"
        >
          Save
        </button>
      </form>
    </div>
  );
}
