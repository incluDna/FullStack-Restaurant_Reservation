
export default async function getRestaurant(id:string,token:string) {

    const response=await fetch(`http://localhost:5000/api/restaurants/${id}`, {
        headers: {
            "Content-Type": "application/json",
            authorization:`Bearer ${token}`,
        },
        cache: "no-store" });

    if(!response.ok){
        throw new Error("failed to loaded the restaurant")
    }
    return await response.json();
}