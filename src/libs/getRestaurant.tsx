
export default async function getRestaurant(id:string,token:string) {

    const response=await fetch(`http://localhost:5000/api/restaurants/${id}`, {
        headers: {
            "Content-Type": "application/json",
            authorization:`Bearer ${'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY3ZjJhZmNhNjY3MzYyMGQxNGI5NmUyOSIsImlhdCI6MTc0NDAyNDk2OSwiZXhwIjoxNzQ2NjE2OTY5fQ.wn__6CeJd4fTH5u5Yd5oHDgsPO-cUmcRiYoTHzEiUqs'}`,
        },
        cache: "no-store" });

    if(!response.ok){
        throw new Error("failed to loaded the restaurant")
    }
    return await response.json();
}