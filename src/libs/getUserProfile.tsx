
export default async function getUserProfile(token:string){
    const response =await fetch("https://restaurant-reservation-backend-blush.vercel.app/api/v1/auth/me",{
        method:"GET",
        headers:{
            authorization:`Bearer ${token}`,
        }
    })

    if(!response.ok){
        throw new Error("cannot get user profile")
    }
    return await response.json();
}