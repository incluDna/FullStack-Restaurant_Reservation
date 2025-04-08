import ReviewForm from "@/components/ReviewForm";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import getUserProfile from "@/libs/getUserProfile";

export default async function addReviews() {
    const session =await getServerSession(authOptions);
    if (!session || !session.user?.token) {
        throw new Error("No session or token found.");
    }
    const profile=await getUserProfile(session.user.token);
    
    
    return (
        <main className="p-10">
            {
            session?
            <ReviewForm session={session} profile={profile}/>
            :null
            }
            
        </main>
    )
}