export default async function userRegister(userName:string, userEmail: string, userTel: string, userPassword: string){
    
    const response = await fetch(`${process.env.BACKEND_URL}/api/auth/register`,{
        method: "POST",
        headers: {
            "Content-Type" : "application/json"
        },
        body: JSON.stringify({
            name: userName,
            email : userEmail,
            tel: userTel,
            password: userPassword,
            role: "user"
        }),
    })

    if(!response.ok)
    {
        throw new Error("Failed to register user")
    }
    return await response.json()
}