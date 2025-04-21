export default async function editMenu (token:string, restaurantId:string,
    updatedData:{
        name?:string, 
        restaurant?:string, 
        picture?:string, 
        price?:number, 
        type?:string, 
        description?:string, 
        tag?:string[]
    }, id?:string
) {

    const response=await fetch(`${process.env.BACKEND_URL}/api/restaurants/${restaurantId}/menus/${id}`, {
        method:"PUT",
        headers:{
            "Content-Type": "application/json", 
            authorization:`Bearer ${token}`,
        },
        body:JSON.stringify(updatedData)
    });
    

    if(!response.ok){
        throw new Error("failed to update the menu")
    }
    return await response.json();
}