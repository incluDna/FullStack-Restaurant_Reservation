export default async function updateUserProfile(token:string | null,
    {name, email,tel}:
    {name:string,email:string,tel:string}
){
    const response =await fetch(`${process.env.BACKEND_URL}/api/auth/me`,{
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body:JSON.stringify({name, email, tel})
      })

    if(!response.ok){
        throw new Error("cannot update user profile")
    }
    return await response.json();
}