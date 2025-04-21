export default async function deleteMenu (token:string, restaurantId:string, id:string,) {

    const response=await fetch(`${process.env.BACKEND_URL}/api/restaurants/${restaurantId}/menus/${id}`, {
        method:"DELETE",
        headers:{
            "Content-Type": "application/json", 
            authorization:`Bearer ${token}`,
        },
    });
    console.log(id)

    if(!response.ok){
        throw new Error("failed to delete the menu")
    }
    return await response.json();
}