export default async function addRestaurants(token:string,
    {name,address,district,province,postalCode,shortLocation,tel,region,openTime,closeTime,picture}:
    {name:string,address:string,district:string,province:string,postalCode:string,shortLocation:string,
        tel:string,region:string,openTime:string,closeTime:string,picture:string}
) {

    const response=await fetch(`${process.env.BACKEND_URL}/api/restaurants`, {
        method:"POST",
        headers:{
            "Content-Type": "application/json", 
            authorization:`Bearer ${token}`,
        },
        body:JSON.stringify({
            name: name,
            address: address,
            district: district,
            province: province,
            postalCode: postalCode,
            shortLocation: shortLocation,
            tel: tel,    
            region: region,
            openTime: openTime,    
            closeTime: closeTime,    
            picture: picture
        })
    });

    if(!response.ok){
        throw new Error("failed to add the restaurant")
    }
    return await response.json();
}