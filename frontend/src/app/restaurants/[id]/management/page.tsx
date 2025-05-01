import QueueCard from "@/components/card/managementComp/QueueManageCard";
import ReserveManageSection from "@/components/ReserveManageSection";
import { cookies } from "next/headers";
import { Queue } from "../../../../../interfaces";
import QueueManageSection from "@/components/QueueManageSection";
import getRestaurant from "@/libs/Restaurant/getRestaurant";

export default async function restaurant({ params }: { params: Promise<{ id: string }> }) {
  const pr = await params; // params should be awaited
  const rest= await getRestaurant(pr.id);
  const restaurantName = rest.data.name;
  try {
    const cookieStore = await cookies(); // This only works on the server
    const token = cookieStore.get("token")?.value;
    return (
      <div className="flex flex-col w-full h-full min-h-full">
        <p className="bg-stone-800 p-3 text-white text-center text-3xl">
          {restaurantName}</p>
      <div className="w-full h-full flex flex-row font-sans">
        <QueueManageSection token={token} restaurantID={pr.id}/>
        <ReserveManageSection token={token}
          restaurantID={pr.id} />
      </div>
      </div>

    );
  }
  catch (err) {
    console.log(err);
  }
}
