import ReserveManageSection from "@/components/ReserveManageSection";
import { cookies } from "next/headers";

export default async function restaurant({ params }: { params: { id: string } }) {
  const pr = await params; // params should be awaited
  try {
    const cookieStore = await cookies(); // This only works on the server
    const token = cookieStore.get("token")?.value;
    return (
      <div className="w-full min-h-full h-fit flex flex-row font-sans">
        <div className="w-1/2 min-h-full bg-blue-100" />
        <ReserveManageSection token={token}
          restaurantID={pr.id} />
      </div>
    );
  }
  catch (err) {
    console.log(err);
  }
}
