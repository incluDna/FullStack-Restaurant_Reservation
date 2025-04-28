export default async function updateUserProfile(token:string | null,
    updatedData: {
      name?:string,
      email?:string,
      tel?:string
    }
){
    const response =await fetch(`${process.env.BACKEND_URL}/api/auth/me`,{
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body:JSON.stringify(updatedData)
      })

    const res= await response.json();
    if(!response.ok){
      throw new Error(res.message);
    }
    return res;
}