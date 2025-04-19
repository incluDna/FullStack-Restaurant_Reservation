export async function getAuthCookie() {
  try {
    const res = await fetch("/api/auth", {
      method: "GET",
      credentials: "include",
    });

    if (!res.ok) {
      throw new Error("Failed to fetch auth cookie");
    }

    const data = await res.json();
    return data;
  } catch (error) {
    console.error("Failed to fetch auth cookie", error);
    return { success: false, token: null, role: null };
  }
}
