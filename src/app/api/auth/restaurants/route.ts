import { NextRequest, NextResponse } from 'next/server';

//refresh แล้วข้อมูลหาย
let restaurants: any[] = [];

export async function GET() {
  return NextResponse.json(restaurants);
}

export async function POST(req: NextRequest) {
  const token = req.cookies.get("token")?.value;
  const role = req.cookies.get("role")?.value;

  if (!token || role !== "employee") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json();
  const newRestaurant = {
    _id: Date.now().toString(),
    ...body,
  };

  restaurants.push(newRestaurant);
  return NextResponse.json(newRestaurant, { status: 201 });
}
