import ReserveManageCard from "@/components/card/managementComp/ReserveManageCard"
import { cookies } from "next/headers";

export default async function restaurant({ params }: { params: { id: string } }) {
  const cookie = await cookies();
  const role = await cookie.get('role')?.value; // check if they are not customer
  const pr = await params; // params should be awaited
  console.log(pr.id); // id for get reservation of a restaurant
  const date = new Date().toString();
  return (
    <div className="w-full h-full flex flex-row font-sans">
      <div className="w-1/2 h-full bg-blue-100" />
      <div className="w-1/2 h-full bg-white p-5 flex flex-col gap-y-5">
        <div className="w-full h-3/2 text-left break-words text-xl">
          Date: {date}
        </div>
        <ReserveManageCard />
        <ReserveManageCard />
        <ReserveManageCard />
      </div>
    </div>
  );
}
