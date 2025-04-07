
export default async function userLogin(userEmail:string,userPassword:string) {
    const response=await fetch("https://restaurant-reservation-backend-blush.vercel.app/api/v1/auth/login",{
        method:"POST",
        headers:{
            "Content-Type":"application/json",
        },
        body:JSON.stringify({
            email:userEmail,
            password:userPassword
        })
    })
    if(!response.ok){
        throw new Error("fail to login")
    }
    return await response.json();
}