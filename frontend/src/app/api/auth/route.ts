import { NextResponse } from "next/server";
import { serialize } from "cookie";
import { cookies } from "next/headers";

export async function POST(req: Request) {
  const { token, role } = await req.json();

  const tokenCookie = serialize("token", token, {
    httpOnly: true,
    secure: true,
    maxAge: 60 * 60 * 24,
    path: "/",
    sameSite: "strict",
  });

  const roleCookie = serialize("role", role, {
    httpOnly: true,
    secure: true,
    maxAge: 60 * 60 * 24,
    path: "/",
    sameSite: "strict",
  });

  const response = NextResponse.json({ success: true });
  response.headers.append("Set-Cookie", tokenCookie);
  response.headers.append("Set-Cookie", roleCookie);

  return response;
}
// GET: Retrieve cookies
export async function GET() {
  const cookieStore = await cookies(); 
  const token = cookieStore.get("token")?.value;
  const role = cookieStore.get("role")?.value;

  if (!token || !role) {
    return NextResponse.json({ success: false, message: "No auth cookie found" }, { status: 401 });
  }

  return NextResponse.json({ success: true, token, role });
}

// DELETE: Clear cookies
export async function DELETE() {
  const deleteTokenCookie = serialize("token", "", {
    httpOnly: true,
    secure: true,
    maxAge: 0,
    path: "/",
    sameSite: "strict",
  });

  const deleteRoleCookie = serialize("role", "", {
    httpOnly: true,
    secure: true,
    maxAge: 0,
    path: "/",
    sameSite: "strict",
  });

  const response = NextResponse.json({ success: true, message: "Cookies cleared" });
  response.headers.append("Set-Cookie", deleteTokenCookie);
  response.headers.append("Set-Cookie", deleteRoleCookie);

  return response;
}
