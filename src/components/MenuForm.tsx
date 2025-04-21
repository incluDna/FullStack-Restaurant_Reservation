'use client'

import addMenu from "@/libs/addMenu";
import { Session } from "next-auth";
import { useSearchParams } from "next/navigation";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

type Props = {
    defaultValues?: {
      name: string;
      restaurant:string;
      picture:string
      price: number;
      type:string;
      description: string;
      tag: [string];
    };
    onSubmit: (data: any) => void;
  };
  
  export default function MenuForm({ token,profile}: { token: any  ,profile:any}) {


    const router = useRouter();
    const { id } = router.query;
    if(!id)return;
    console.log(id)

    

    const [form, setForm] = useState( {name: '',
      restaurant:'',
      picture:'',
      price:0,
      type:'',
      description: '',
      tag: ['']}
    );
    
    const onSubmit= () => {
      // console.log(session.user.token)
      // console.log(user)
      // console.log(rid)
      // console.log(reviewStar)
      // console.log(Description)

      if (form) {
        addMenu(
          //addMenu(token, restaurantId, newMenu)
          token,id,form

        );
        alert("Add Menu Successfully!");
        router.push(`/restaurants/${id}`);
  
        
      }
    };
    return (
      <form onSubmit={(e) => { e.preventDefault(); onSubmit(); }} className="space-y-4">
        <input placeholder="Name" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} className="input" />
        <input type="number" placeholder="Price" value={form.price} onChange={e => setForm({ ...form, price: parseInt( e.target.value)|| 0 })} className="input" />
        <textarea placeholder="Description" value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} className="input" />
        <input placeholder="Image URL" value={form.picture} onChange={e => setForm({ ...form, picture: e.target.value })} className="input" />
        <button type="submit" className="bg-orange-500 text-white px-4 py-2 rounded">Save</button>
      </form>
    );
  }
  