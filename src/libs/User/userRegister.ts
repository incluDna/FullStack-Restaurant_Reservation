export default async function userRegister(userName: string, userEmail: string, userTel: string, userPassword: string) {
    const response = await fetch(`${process.env.BACKEND_URL}/api/auth/register`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            name: userName,
            email: userEmail,
            tel: userTel,
            password: userPassword,
            role: "user",
        }),
    });

    if (!response.ok) {
        const errorDetails = await response.json(); // Get the error details from the backend
        return { success: false, message: errorDetails.message || "Failed to register user" }; // Return error message to frontend
    }

    const data = await response.json(); // Success response from backend
    return { success: true, data }; // Return success response
}
