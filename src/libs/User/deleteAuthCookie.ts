export async function deleteAuthCookie() {
  try {
    const res = await fetch("/api/auth", {
      method: "DELETE",
      credentials: "include",
    });
    if (!res.ok) {
      throw new Error("Failed to remove cookie");
    }
    return { success: true, token: null, role: null };
  } catch (error) {
    console.error("Failed to remove auth cookie", error);
    return { success: false, token: null, role: null };
  }
}
