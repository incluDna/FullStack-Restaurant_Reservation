import { useState } from "react";

type Props = {
    defaultValues?: {
      name: string;
      price: number;
      description: string;
      image: string;
    };
    onSubmit: (data: any) => void;
  };
  
  export default function MenuForm({ defaultValues, onSubmit }: Props) {
    const [form, setForm] = useState(defaultValues || { name: '', price: 0, description: '', image: '' });
  
    return (
      <form onSubmit={(e) => { e.preventDefault(); onSubmit(form); }} className="space-y-4">
        <input placeholder="Name" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} className="input" />
        <input type="number" placeholder="Price" value={form.price} onChange={e => setForm({ ...form, price: +e.target.value })} className="input" />
        <textarea placeholder="Description" value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} className="input" />
        <input placeholder="Image URL" value={form.image} onChange={e => setForm({ ...form, image: e.target.value })} className="input" />
        <button type="submit" className="bg-orange-500 text-white px-4 py-2 rounded">Save</button>
      </form>
    );
  }
  