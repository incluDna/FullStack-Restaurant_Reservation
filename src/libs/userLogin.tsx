export default async function userLogin(email: string, password: string) {

    const response = await fetch(`${process.env.BACKEND_URL}/api/auth/login`, {
        method: "POST",
        headers: { 
            "Content-Type": "application/json" 
        },
        body: JSON.stringify({ email, password }),
    })

    const data = await response.json()

    if (!response.ok || !data.token) {
        throw new Error(data.message || "Invalid email or password")
    }
    return data;
}