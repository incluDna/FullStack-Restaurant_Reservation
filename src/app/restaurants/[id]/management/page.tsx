import QueueCard from "@/components/card/managementComp/QueueManageCard";
import ReserveManageSection from "@/components/ReserveManageSection";
import { cookies } from "next/headers";
import { Queue } from "../../../../../interfaces";
import QueueManageSection from "@/components/QueueManageSection";

export default async function restaurant({ params }: { params: Promise<{ id: string }> }) {
  const pr = await params; // params should be awaited
  try {
    const cookieStore = await cookies(); // This only works on the server
    const token = cookieStore.get("token")?.value;
    return (
      <div className="w-full min-h-full h-fit flex flex-row font-sans">
        <QueueManageSection token={token} restaurantID={pr.id}/>
        <ReserveManageSection token={token}
          restaurantID={pr.id} />
      </div>
    );
  }
  catch (err) {
    console.log(err);
  }
}
