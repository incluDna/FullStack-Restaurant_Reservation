import ReserveManageSection from "@/components/ReserveManageSection";
import { cookies } from "next/headers";

export default async function restaurant({ params }: { params: { id: string } }) {
  const cookie = await cookies();
  const role = await cookie.get('role')?.value; // check if they are not customer
  const pr = await params; // params should be awaited
  // const date = new Date().toString();

      // const session = await getServerSession(authOptions);
    // if (!session) return null
    const token =
        // session.user.token;
        // uncomment all above and delete line below when login/register is implemented  
        'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY3ZmQyMjNkMzA1YjkzN2IxNWY5ODI3ZiIsImlhdCI6MTc0NDY0NTIxOCwiZXhwIjoxNzQ3MjM3MjE4fQ.w2QnoRKC8WnqQIVZAVRi5-gG5wijwCNpvLvdTa09mQ4';
    // ** ^ edit and use test token here, this token was for John admin

  return (
    <div className="w-full h-full flex flex-row font-sans">
      <div className="w-1/2 h-full bg-blue-100" />
      <ReserveManageSection token={token} 
      restaurantID={pr.id}/>
    </div>
  );
}
