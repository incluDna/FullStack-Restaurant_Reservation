import MenuForm from "@/components/MenuForm";
import getUserProfile from "@/libs/getUserProfile";

export default async function CreateMenuPage() {

  const token = localStorage.getItem('token');

  if(!token)return
  const profile=await getUserProfile(token);
    
    
  return (
    <div className="p-8 max-w-xl mx-auto">
      hello
      <h1 className="text-2xl font-bold mb-4">Create New Menu</h1>
      <MenuForm token={token} profile={profile}/>
    </div>
  );
}