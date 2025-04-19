export default async function addMenu (token:string, restaurantId:string,
    {name,restaurant,picture,price,type,description,tag}:
    {name:string, restaurant:string, picture:string, price:number, type:string, description:string, tag:string[]}
) {

    const response=await fetch(`${process.env.BACKEND_URL}/api/restaurants/${restaurantId}/menus`, {
        method:"POST",
        headers:{
            "Content-Type": "application/json", 
            authorization:`Bearer ${token}`,
        },
        body:JSON.stringify({
            name: name,
            restaurant: restaurant,
            picture: picture,
            price: price,
            type: type,
            description: description,
            tag: tag
        })
    });

    if(!response.ok){
        throw new Error("failed to add the menu")
    }
    return await response.json();
}