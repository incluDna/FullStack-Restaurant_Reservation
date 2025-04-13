import ReserveManageSection from "@/components/ReserveManageSection";
import { cookies } from "next/headers";

export default async function restaurant({ params }: { params: { id: string } }) {
  const cookie = await cookies();
  const role = await cookie.get('role')?.value; // check if they are not customer
  const pr = await params; // params should be awaited
  console.log(pr.id); // id for get reservation of a restaurant
  // const date = new Date().toString();


  return (
    <div className="w-full h-full flex flex-row font-sans">
      <div className="w-1/2 h-full bg-blue-100" />
      <ReserveManageSection token="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY3ZmExZjBhNGYyMWQyZGZkZGMxZjdiMiIsImlhdCI6MTc0NDU1NTIwNCwiZXhwIjoxNzQ3MTQ3MjA0fQ.TEBX0NyXPP4sSoNfselUcaonxpDUMibQNVfKRTxhL_4" 
      restaurantID={pr.id}/>
    </div>
  );
}
