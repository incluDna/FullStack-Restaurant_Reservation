export async function setAuthCookie(token:string, role:string) {
    try {
        const res = await fetch("/api/auth", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ token, role }),
        });
        if (!res.ok) {
            throw new Error("Failed to set auth cookie");
        }
        return { success: true, token, role};
    } catch (error) {
        console.error(error);
        return { success: false, token, role};
    }
}
