export default async function addRestaurants(token:string,
    {name,address,district,province,postalcode,shortLocation,tel,region,opentime,closetime,picture}:
    {name:string,address:string,district:string,province:string,postalcode:string,shortLocation:string,
        tel:string,region:string,opentime:string,closetime:string,picture:string}
) {

    const response=await fetch(`${process.env.BACKEND_URL}/api/restaurants`, {
        method:"POST",
        headers:{
            "Content-Type": "application/json",  // ✅ เพิ่มส่วนนี้
            authorization:`Bearer ${token}`,
        },
        body:JSON.stringify({
            name: name,
            address: address,
            district: district,
            province: province,
            postalcode: postalcode,
            shortLocation: shortLocation,
            tel: tel,    
            region: region,
            openTime: opentime,    
            closeTime: closetime,    
            picture: picture
        })
    });

    if(!response.ok){
        throw new Error("failed to add the restaurant")
    }
    return await response.json();
}