
export default async function getUserProfile(token:string){
    const response =await fetch("http://localhost:5000/api/auth/me",{
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